const got = require('got')
const sanitizer = require('sanitizer')
const express = require('express')
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')

const names = require('./names.js')
const slugify = require('./slugify.js')
const config = require('./config.js')

let apiCache

const scheduler = new ToadScheduler()

const task = new Task('simple task', async () => { apiCache = await getApiData() })
const job = new SimpleIntervalJob({ seconds: 10, }, task)
scheduler.addSimpleIntervalJob(job)


async function getApiData() {
    const api = await got('https://plutonium.pw/api/servers')
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
        server.mapDisplay = names.map(server.map)
        server.hostnameDisplay = sanitizer.escape(server.hostname.replace(/\^\d/g, ''))
        server.online = true
        server.known = true
        server.date = Date.now()

        if (server.revision >= config.latestRevision) {
            server.uptodate = true
        } else {
            server.uptodate = false
        }

        servers.push(server)
    }

    return {
        json: servers,
        date: Date.now()
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
        res.render('servers', { api: servers, config })
    }
})

app.get(['/server/:ip/:port', '/server/:ip/:port/json'], async (req, res) => {
    let server = await getServer(req.params.ip, req.params.port)

    if (req.url.endsWith('json')) {
        res.json(server)
    } else {
        res.render('server', { server, config })
    }
})

app.listen(1998)