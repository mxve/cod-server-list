const got = require('got')
const express = require('express')
const geoip = require('geoip-lite')
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')
const jimp = require('jimp')
const fs = require('fs')
const crypto = require('crypto')
const compression = require('compression')

const config = require('./config.js')
const global_config = require('../config.json')

const games = ['iw5mp', 't4mp', 't4sp', 't5mp', 't5sp', 't6mp', 't6zm', 'iw4x', 'iw6x', 's1x']

let apiCache

const scheduler = new ToadScheduler()

// api cache task
const update_api_data_task = new Task('update_api_data', async () => { apiCache = await getApiData() })
const update_api_data_job = new SimpleIntervalJob({ seconds: config.api_query_interval, }, update_api_data_task)
scheduler.addSimpleIntervalJob(update_api_data_job)

async function getApiData() {
    let api = await got(`${global_config.api.url}/v1/servers/`)
    api = JSON.parse(api.body).servers
    let version = await got('https://cdn.plutonium.pw/updater/prod/info.json')
    version = JSON.parse(version.body).revision

    return {
        json: api,
        date: Date.now(),
        revision: version
    }
}

function searchInArray(search, searchables, searchablesFull = []) {
    for (searchable of searchablesFull) {
        if (searchable && searchable.toString().toLowerCase() === search.toString().toLowerCase()) {
            return true
        }
    }

    for (searchable of searchables) {
        if (searchable && searchable.toString().toLowerCase().includes(search.toString().toLowerCase())) {
            return true
        }
    }

    return false
}

// used to get servers requested by client
// includes crude search function & game filter
async function getData(game = 'all', search = undefined, includePlayers = false) {
    if (apiCache === undefined) {
        apiCache = await getApiData()
    }

    const api = apiCache

    let maxPlayers = 0
    let countPlayers = 0
    let countServers = 0
    let countBots = 0

    // filter servers
    let servers = []
    for (server of api.json) {
        // we do a little searching
        if (search !== undefined) {
            // if any of these values contains search its a match
            let searchables = [
                server.hostname,
                server.map,
                server.mapDisplay,
                server.gametype,
                server.gametypeDisplay,
                server.country,
                server.countryDisplay,
                server.gameDisplay,
                server.game
            ]

            // these values have to match completely (aside from case)
            let searchablesFull = [
                server.ip,
                server.port,
                server.maxplayers,
                server.players.length,
                server.round,
                server.identifier
            ]

            // add player names to searchable values
            if (includePlayers && server.players.length > 0) {
                let players
                for (player of server.players) {
                    if (!players) {
                        players = `${player.username}`
                        continue
                    }
                    players = `${players};${player.username};${player.userslug}`
                }
                searchables.push(players)
            }

            if (!searchInArray(search, searchables, searchablesFull)) {
                continue
            }
        }

        // filter by game
        if (game !== 'all' && server.game != game) {
            continue
        }

        // stats
        maxPlayers += server.maxplayers
        countPlayers += server.players.length
        countServers += 1
        countBots += server.bots

        servers.push(server)
    }

    return {
        servers,
        date: apiCache.date,
        maxPlayers,
        countPlayers,
        countBots,
        countServers
    }
}

// get a single server
async function getServer(ip, port) {
    if (apiCache === undefined) {
        apiCache = await getApiData()
    }

    const json = apiCache.json

    // find server in api cache
    let server = { ip, port, online: false, known: false }
    for (iserver of json) {
        if (iserver.ip == ip && iserver.port == port) {
            server = iserver
            break
        }
    }

    return server
}

async function getServerByIdentifier(identifier) {
    if (apiCache === undefined) {
        apiCache = await getApiData()
    }

    const json = apiCache.json

    // find server in api cache
    for (iserver of json) {
        if (iserver.identifier == identifier) {
            return iserver
        }
    }

    return { identifier, online: false, known: false }
}

const app = express()
app.disable("x-powered-by")
app.set('views', 'serverlist/views')
app.set('view engine', 'ejs')
app.use(express.static('serverlist/public'))
app.use(compression())

// server list
app.get(['/', '/:game', '/json', '/:game/json'], async (req, res) => {
    let servers

    const includePlayers = req.query.players == 'on' ? true : false
    // game filter
    if (games.includes(req.params.game)) {
        servers = await getData(req.params.game, req.query.s, includePlayers)
        servers.game = req.params.game
    } else {
        servers = await getData('all', req.query.s, includePlayers)
        servers.game = 'all'
    }

    if (req.url.endsWith('json')) {
        res.json(servers)
    } else {
        res.render('serverlist', { api: servers, config, revision: apiCache.revision })
    }
})

// server api from ip & port
app.get('/server/:ip/:port/json', async (req, res) => {
    let server = await getServer(req.params.ip, req.params.port)
    res.json(server)
})

// server api from identifier
app.get('/s/:identifier/json', async (req, res) => {
    let server = await getServerByIdentifier(req.params.identifier)
    res.json(server)
})

// server page from ip & port
app.get('/server/:ip/:port', async (req, res) => {
    let server = await getServer(req.params.ip, req.params.port)
    res.render('server', { server, config, revision: apiCache.revision, global_config })
})

// server page from identifier
app.get('/s/:identifier', async (req, res) => {
    let server = await getServerByIdentifier(req.params.identifier)
    res.render('server', { server, config, revision: apiCache.revision, global_config })
})


// legacy serverbanner "proxy"
async function resPreviewImage(res, server) {
    // move this to client side
    let image = await got(`${global_config.serverbanner.url}/v1/${server.ip}/${server.port}`)
    res.setHeader('Content-Type', 'image/png')
    res.set({
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
    })
    res.writeHead(200, {
        'Content-Type': 'image/png'
    })
    res.end(image.rawBody)
}

// server preview image from ip & port
app.get('/server/:ip/:port/png', async (req, res) => {
    const server = await getServer(req.params.ip, req.params.port)
    resPreviewImage(res, server)
})

// server preview image from identifier
app.get('/s/:identifier/png', async (req, res) => {
    const server = await getServerByIdentifier(req.params.identifier)
    resPreviewImage(res, server)
})

// site banner
app.get('/img/banner', async (req, res) => {
    const rand = Math.random()
    const dir = 'public/img/banner/'
    let img = 'default.png'
    if (rand < 0.02) {
        // prepend dir with "serverlist" which has been omitted so dir can be used with sendFile root
        const files = fs.readdirSync('serverlist/' + dir).filter(fn => fn.startsWith('special'))
        img = files[Math.floor(Math.random() * files.length)]
    }
    res.sendFile(dir + img, { root: __dirname })
})

app.listen(config.port)