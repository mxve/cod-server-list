const global_config = require('../config.json')
const config = require('./config.json')

const express = require('express')
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')

const plutonium = require('./platforms/plutonium.js')
const xlabs = require('./platforms/xlabs.js')
const db = require('./db.js')
db.connect(config.db.uri)

const scheduler = new ToadScheduler()

let servers = {
    plutonium: {},
    xlabs: {},
}

const get_plutonium_servers = new Task('get_plutonium_servers', async () => {
    let _servers = await plutonium.getServers()

    for (server of _servers.servers.all) {
        // map server to database server
        // TODO: do in plutonium.js
        let _server = {}
        _server.identifier = server.identifier
        _server.ip = server.ip
        _server.port = server.port
        _server.platform = 'plutonium'
        _server.game = server.game
        _server.game_display = server.gameDisplay
        _server.hostname = server.hostname
        _server.hostname_display = server.hostnameDisplay
        _server.map = server.map
        _server.map_display = server.mapDisplay
        _server.gametype = server.gametype
        _server.gametype_display = server.gametypeDisplay
        _server.clients_max = server.maxplayers
        _server.clients = server.players.length - server.bots
        _server.bots = server.bots
        _server.players = server.players
        _server.hardcore = server.hardcore
        _server.password = server.password
        _server.round = server.round
        _server.voice = server.voice
        _server.aimassist = server.aimassist
        _server.description = server.description
        _server.cod_info = server.codInfo
        _server.version = server.revision
        _server.last_seen = new Date()
        _server.country_code = server.country
        _server.country = server.countryDisplay

        // add server to database
        await db.updateOrInsertServer(_server)
    }

    servers.plutonium = _servers
})
const get_xlabs_servers = new Task('get_xlabs_servers', async () => {
    let _servers = await xlabs.getServers()

    for (server of _servers.servers.all) {
        // map server to database server
        // TODO: do in plutonium.js
        let _server = {}
        _server.identifier = server.identifier
        _server.ip = server.ip
        _server.port = server.port
        _server.platform = 'xlabs'
        _server.game = server.game
        _server.game_display = server.gameDisplay
        _server.hostname = server.hostname
        _server.hostname_display = server.hostnameDisplay
        _server.map = server.map
        _server.map_display = server.mapDisplay
        _server.gametype = server.gametype
        _server.gametype_display = server.gametypeDisplay
        _server.clients_max = server.maxplayers
        if (server.game == 'iw4x') {
            _server.clients = server.clients
        } else {
            _server.clients = server.players.length - server.bots
        }
        _server.bots = server.bots
        _server.players = server.players
        _server.hardcore = server.hardcore
        _server.password = server.password
        _server.round = server.round
        _server.voice = server.voice
        _server.aimassist = server.aimassist
        _server.description = server.description
        _server.cod_info = server.codInfo
        _server.version = server.shortversion
        _server.last_seen = new Date()
        _server.country_code = server.country
        _server.country = server.countryDisplay

        // add server to database
        await db.updateOrInsertServer(_server)
    }

    servers.xlabs = _servers
})


const get_plutonium_servers_job = new SimpleIntervalJob({ seconds: 20 }, get_plutonium_servers)
scheduler.addSimpleIntervalJob(get_plutonium_servers_job)
get_plutonium_servers.execute()

const get_xlabs_servers_job = new SimpleIntervalJob({ seconds: 20 }, get_xlabs_servers)
scheduler.addSimpleIntervalJob(get_xlabs_servers_job)
get_xlabs_servers.execute()

function appendStats(servers) {
    let countPlayers = 0
    let countBots = 0
    let maxPlayers = 0

    for (server of servers) {
        countPlayers += server.clients
        maxPlayers += server.clients_max
        countBots += server.bots
    }

    return {
        clients_max: maxPlayers,
        clients_total: countPlayers,
        bots_total: countBots,
        servers_total: servers.length,
        servers: servers
    }
}

function prepareResponse(servers) {
    let _servers = servers.sort((a, b) => {
        return (b.clients) - (a.clients)
    })
    return appendStats(_servers)
}

const app = express()
app.disable("x-powered-by")

app.get(['/v1/servers', '/v1/servers/all'], async (req, res) => {
    try {
        res.json(prepareResponse(await db.getServers()))
    } catch {
        res.json([])
    }
})

app.get('/v1/servers/platform/:platform', async (req, res) => {
    try {
        res.json(prepareResponse(await db.getServersByPlatform(req.params.platform)))
    } catch {
        res.json([])
    }
})

app.get('/v1/servers/game/:game', async (req, res) => {
    try {
        res.json(prepareResponse(await db.getServersByGame(req.params.game)))
    } catch {
        res.json([])
    }
})

app.listen(global_config.api.port)