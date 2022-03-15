const got = require('got')
const express = require('express')
const geoip = require('geoip-lite')
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')
const jimp = require('jimp')
const fs = require('fs')


const names = require('./names.js')
const slugify = require('./slugify.js')
const config = require('./config.js')
const images = require('./images.js')

let apiCache

const scheduler = new ToadScheduler()

let previews_done = true;
const clear_image_cache_task = new Task('clear_images', async () => {
    if (previews_done) {
        previews_done = false
        let data = await getData()
        for (server of data.servers) {
            const preview_path = `data/img/server_previews/generated/${server.ip}_${server.port}.png`
            const exists = fs.existsSync(preview_path)
            if (server.changed || !exists) {
                // if (exists) {
                //     const stats = fs.statSync(preview_path)
                //     if ((new Date().getTime() - stats.mtime.getTime()) > (1000 * config.image_cache_max_age)) {
                //         console.log(`skipping ${server.hostname}`)
                //         continue
                //     }
                // }
                await images.generate_server_preview(server, false)
            }
        }
        previews_done = true
    }
})
const clear_image_cache_job = new SimpleIntervalJob({ seconds: 1, }, clear_image_cache_task)
scheduler.addSimpleIntervalJob(clear_image_cache_job)

const update_api_data_task = new Task('update_api_data', async () => { apiCache = await getApiData() })
const update_api_data_job = new SimpleIntervalJob({ seconds: config.api_query_interval, }, update_api_data_task)
scheduler.addSimpleIntervalJob(update_api_data_job)

let previous_servers = []
async function getApiData() {
    const api = await got('https://plutonium.pw/api/servers')
    let version = await got('https://cdn.plutonium.pw/updater/prod/info.json')
    version = JSON.parse(version.body).revision

    const json = JSON.parse(api.body)
    json.sort((a, b) => {
        return b.players.length - a.players.length
    })

    let servers = []
    for (server of json) {
        for (player of server.players) {
            player.userslug = slugify(player.username)
        }

        server.gametypeDisplay = names.gametype(server.gametype, server.game)
        server.mapDisplay = names.map(server.map, server.game)
        server.hostnameDisplay = server.hostname.replace(/\^\d/g, '')

        server.online = true
        server.known = true
        server.date = Date.now()

        if (server.revision >= version) {
            server.uptodate = true
        } else {
            server.uptodate = false
        }

        try {
            server.country = geoip.lookup(server.ip).country.toLowerCase()
        } catch {
            server.country = 'lgbt'
        }

        let prev_server = previous_servers.filter(it => it.ip == server.ip && it.port == server.port)

        server.changed = false
        if (prev_server.length > 0) {
            if (prev_server[0].players.length != server.players.length ||
                prev_server[0].map != server.map ||
                prev_server[0].gametype != server.gametype ||
                prev_server[0].hostname != server.hostname ||
                prev_server[0].maxplayers != server.maxplayers) {
                server.changed = true
            }
        }

        servers.push(server)
    }

    previous_servers = servers

    return {
        json: servers,
        date: Date.now(),
        revision: version
    }
}

async function getData(game = 'all', search = undefined) {
    if (apiCache === undefined) {
        apiCache = await getApiData()
    }

    const api = apiCache

    let maxPlayers = 0
    let countPlayers = 0
    let countServers = 0

    let servers = []
    for (server of api.json) {
        if (search !== undefined) {
            if (!server.hostname.toLowerCase().includes(search.toLowerCase()) &&
                server.ip != search &&
                server.port != search &&
                server.maxplayers != search &&
                server.players.length != search &&
                !server.map.toLowerCase().includes(search.toLowerCase()) &&
                !server.mapDisplay.toLowerCase().includes(search.toLowerCase()) &&
                !server.gametype.toLowerCase().includes(search.toLowerCase()) &&
                !server.gametypeDisplay.toLowerCase().includes(search.toLowerCase())) {
                continue
            }
        }

        if (game !== 'all' && server.game != game) {
            continue
        }


        maxPlayers += server.maxplayers
        countPlayers += server.players.length
        countServers += 1

        server.online = true
        server.known = true

        servers.push(server)
    }

    return {
        servers,
        date: apiCache.date,
        maxPlayers,
        countPlayers,
        countServers
    }
}

async function getServer(ip, port) {
    if (apiCache === undefined) {
        apiCache = await getApiData()
    }

    const json = apiCache.json

    let server = { ip, port, online: false, known: false }
    for (iserver of json) {
        if (iserver.ip == ip && iserver.port == port) {
            server = iserver
            server.online = true
            server.known = true
            break
        }
    }

    return server
}


const app = express()
app.disable("x-powered-by");
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get(['/', '/:game', '/json', '/:game/json'], async (req, res) => {
    let servers

    if (req.params.game === 'iw5mp' ||
        req.params.game === 't6mp' ||
        req.params.game === 't6zm' ||
        req.params.game === 't4mp' ||
        req.params.game === 't4sp') {

        servers = await getData(req.params.game, req.query.s)
        servers.game = req.params.game
    } else {
        servers = await getData('all', req.query.s)
        servers.game = 'all'
    }

    if (req.url.endsWith('json')) {
        res.json(servers)
    } else {
        res.render('servers', { api: servers, config, revision: apiCache.revision })
    }
})

app.get(['/server/:ip/:port', '/server/:ip/:port/json'], async (req, res) => {
    let server = await getServer(req.params.ip, req.params.port)

    if (req.url.endsWith('json')) {
        res.json(server)
    } else {
        res.render('server', { server, config, revision: apiCache.revision })
    }
})

app.get('/server/:ip/:port/png', async (req, res) => {
    const server = await getServer(req.params.ip, req.params.port)
    let image = await images.get_server_preview(server)
    image.getBuffer(jimp.MIME_PNG, (err, buffer) => {
        res.set({
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
        })
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': buffer.length
        })
        res.end(buffer)
    })
})

app.listen(1998)