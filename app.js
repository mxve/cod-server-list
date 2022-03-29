const got = require('got')
const express = require('express')
const geoip = require('geoip-lite')
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')
const jimp = require('jimp')
const fs = require('fs')
const crypto = require('crypto')

const names = require('./names.js')
const slugify = require('./slugify.js')
const config = require('./config.js')
const images = require('./images.js')

let apiCache

const scheduler = new ToadScheduler()

// task to generate server preview images, runs every second,
// uses below var to control wether new images should be generate on the run
let previews_done = true;
const generate_previews_task = new Task('clear_images', async() => {
    if (previews_done) {
        previews_done = false
        got(config.preview_generator_heartbeat_url)
        let data = await getData()
        for (server of data.servers) {
            const preview_path = `data/img/server_previews/generated/${server.ip}_${server.port}.png`
            const exists = fs.existsSync(preview_path)
            if (server.changed || !exists) {
                await images.generate_server_preview(server, false)
            }
        }
        previews_done = true
    }
})
const generate_previews_job = new SimpleIntervalJob({ seconds: 1, }, generate_previews_task)
scheduler.addSimpleIntervalJob(generate_previews_job)

// api cache task
const update_api_data_task = new Task('update_api_data', async() => { apiCache = await getApiData() })
const update_api_data_job = new SimpleIntervalJob({ seconds: config.api_query_interval, }, update_api_data_task)
scheduler.addSimpleIntervalJob(update_api_data_job)

// based on https://roytanck.com/2021/10/17/generating-short-hashes-in-php/
function generateIdentifier(server) {
    // generate (hopefully) unique server identifier
    const address = `${server.ip}:${server.port}`
        // get base64 encoding of sha256 hash of address
    const hash = crypto.createHash('sha256').update(address).digest('base64');
    // make hash url safe by replacing +, / & =
    const urlsafe = hash.replaceAll('+', '-').replaceAll('/', '_').replace('=', '')
        // take first 10 chars
    const shortened = urlsafe.substr(0, 10)
    return shortened
}

function string_number_to_bool(string) {
    const num = Number(string)
    return !!num
}

function get_codInfo_value(key, codInfo, bool = false) {
    const key_index = codInfo.indexOf(key)
    if (key_index !== -1 && codInfo !== '' && codInfo.includes(key)) {
        let keyval = codInfo
            .substring(key_index + key.length + 1, codInfo.length)
        if (keyval.includes('\\')) {
            // keyval still contains more keys, so split them off
            keyval = keyval.substring(0, keyval.indexOf('\\'))
        }
        if (bool) {
            return string_number_to_bool(keyval)
        }
        return keyval
    }
    return false
}

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
        // Generate userslugs, used to identify users on plutonium forums
        for (player of server.players) {
            player.userslug = slugify(player.username)
        }

        // generate human readable gametype, map & hostname
        server.gametypeDisplay = names.gametype(server.gametype, server.game)
        server.mapDisplay = names.map(server.map, server.game)
        server.hostnameDisplay = server.hostname.replace(/\^\d/g, '')
        server.hostnameDisplayFull = server.hostnameDisplay
        server.round = get_codInfo_value('rounds', server.codInfo) || '0'
        server.gameDisplay = names.game(server.game)

        // server.password is only correct for iw5mp, so we have to parse codInfo for the correct value
        if (server.codInfo.includes('password')) {
            server.password = get_codInfo_value('password', server.codInfo, true)
        }

        // aim assist -1 = unknown, 0 = off, 1 = on
        if (server.codInfo.includes('aimassist')) {
            server.aimassist = get_codInfo_value('aimassist', server.codInfo)
        } else {
            server.aimassist = '-1'
        }

        if (server.hostnameDisplay.length > 44) {
            server.hostnameDisplay = `${server.hostnameDisplay.substring(0, 42)}...`
        }
        if (server.mapDisplay.length > 24) {
            server.mapDisplay = `${server.mapDisplay.substring(0, 22)}...`
        }

        // in the future servers are supposed to be checked against a databse
        // these vars a already in use
        server.online = true
        server.known = true

        // its a girl! she was born on:
        server.date = Date.now()

        // check server version. bigger is better (thats what she said)
        if (server.revision >= version) {
            server.uptodate = true
        } else {
            server.uptodate = false
        }

        // if we can't get the servers country we'll use the default flag
        try {
            server.country = geoip.lookup(server.ip).country.toLowerCase()
        } catch {
            server.country = 'lgbt'
        }

        // check whether a relevant server variable has changed since the last run
        // helps us reduce the amount of preview images that have to be regenerated
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
            server.identifier = prev_server[0].identifier
        } else {
            server.identifier = await generateIdentifier(server)
        }

        servers.push(server)
    }

    // save new servers as previous servers for the next run
    previous_servers = servers

    return {
        json: servers,
        date: Date.now(),
        revision: version
    }
}

// used to get servers requested by client
// includes crude search function & game filter
async function getData(game = 'all', search = undefined) {
    if (apiCache === undefined) {
        apiCache = await getApiData()
    }

    const api = apiCache

    let maxPlayers = 0
    let countPlayers = 0
    let countServers = 0

    // filter servers
    let servers = []
    for (server of api.json) {
        // we do a little searching
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

        // filter by game
        if (game !== 'all' && server.game != game) {
            continue
        }

        // stats
        maxPlayers += server.maxplayers
        countPlayers += server.players.length
        countServers += 1

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
app.disable("x-powered-by");
app.set('view engine', 'ejs')
app.use(express.static('public'))

// server list
app.get(['/', '/:game', '/json', '/:game/json'], async(req, res) => {
    let servers

    // game filter
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
        res.render('serverlist', { api: servers, config, revision: apiCache.revision })
    }
})

// server api from ip & port
app.get('/server/:ip/:port/json', async(req, res) => {
    let server = await getServer(req.params.ip, req.params.port)
    res.json(server)
})

// server api from identifier
app.get('/s/:identifier/json', async(req, res) => {
    let server = await getServerByIdentifier(req.params.identifier)
    res.json(server)
})

// server page from ip & port
app.get('/server/:ip/:port', async(req, res) => {
    let server = await getServer(req.params.ip, req.params.port)
    res.render('server', { server, config, revision: apiCache.revision })
})

// server page from identifier
app.get('/s/:identifier', async(req, res) => {
    let server = await getServerByIdentifier(req.params.identifier)
    res.render('server', { server, config, revision: apiCache.revision })
})


async function resPreviewImage(res, server) {
    let image = await images.get_server_preview(server)

    // return image buffer from jimp image
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
}

// server preview image from ip & port
app.get('/server/:ip/:port/png', async(req, res) => {
    const server = await getServer(req.params.ip, req.params.port)
    resPreviewImage(res, server)
})

// server preview image from identifier
app.get('/s/:identifier/png', async(req, res) => {
    const server = await getServerByIdentifier(req.params.identifier)
    resPreviewImage(res, server)
})

app.listen(config.port)