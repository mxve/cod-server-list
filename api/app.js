const global_config = require('../config.json')
const config = require('./config.json')

const express = require('express')

const plutonium = require('./platforms/plutonium.js')
const xlabs = require('./platforms/xlabs.js')
const db = require('./db.js')
db.connect(config.db.uri)

async function updateServers() {
    let last_run = new Date() - 1000 * 30

    while (true) {
        if ((new Date() - last_run) < 20000) {
            await new Promise(r => setTimeout(r, 2000))
            continue
        }
    
        let _servers = await plutonium.getServers()
        for (server of _servers.servers) {
            await db.updateOrInsertServer(server)
        }
    
        _servers = await xlabs.getServers()
        for (server of _servers.servers) {
            // add server to database
            await db.updateOrInsertServer(server)
        }

        last_run = new Date()
    }
}
updateServers()

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
        date: new Date(),
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

app.get('/v1/servers/search/:query', async (req, res) => {
    try {
        res.json(prepareResponse(await db.getServersBySearch(req.params.query)))
    } catch(err) {
        console.log(err)
        res.json([])
    }
})

// server/identifier/:id
app.get('/v1/server/identifier/:id', async (req, res) => {
    try {
        res.json(await db.getServer(req.params.id))
    } catch {
        res.json({})
    }
})

// server/address/:ip/:port
app.get('/v1/server/address/:ip/:port', async (req, res) => {
    try {
        res.json(await db.getServerByAddress(req.params.ip, req.params.port))
    } catch {
        res.json({})
    }
})


app.listen(global_config.api.port)