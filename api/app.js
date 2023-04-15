const global_config = require('../config.json')

const express = require('express')
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')

const plutonium = require('./platforms/plutonium.js')
const xlabs = require('./platforms/xlabs.js')
const boiii = require('./platforms/boiii.js')

const scheduler = new ToadScheduler()

let servers = {
    plutonium: {
        servers: {
            iw5mp: [],
            t4mp: [],
            t4sp: [],
            t5mp: [],
            t5sp: [],
            t6mp: [],
            t6zm: [],
            all: []
        },
        date: 0
    },
    xlabs: {
        servers: {
            iw4x: [],
            iw6x: [],
            s1x: [],
            all: []
        },
        date: 0
    },
    boiii: {
        servers: {
            all: []
        },
        date: 0
    }
}

const get_plutonium_servers = new Task('get_plutonium_servers', async () => {
    servers.plutonium = await plutonium.getServers()
})
const get_xlabs_servers = new Task('get_xlabs_servers', async () => {
    servers.xlabs = await xlabs.getServers()
})
const get_boiii_servers = new Task('get_boiii_servers', async () => {
    const _servers = await boiii.getServers()
    if (_servers) {
        servers.boiii = _servers
    }
})



const get_plutonium_servers_job = new SimpleIntervalJob({ seconds: 20 }, get_plutonium_servers)
scheduler.addSimpleIntervalJob(get_plutonium_servers_job)
get_plutonium_servers.execute()

const get_xlabs_servers_job = new SimpleIntervalJob({ seconds: 20 }, get_xlabs_servers)
scheduler.addSimpleIntervalJob(get_xlabs_servers_job)
get_xlabs_servers.execute()

const get_boiii_servers_job = new SimpleIntervalJob({ seconds: 1 }, get_boiii_servers)
scheduler.addSimpleIntervalJob(get_boiii_servers_job)


function appendServerStats(servers) {
    let countPlayers = 0
    let countBots = 0
    let maxPlayers = 0

    for (server of servers) {
        if (
            (server.platform == 'plutonium' && server.game !== 't4mp') ||
            (server.game !== 'iw4x' && server.platform == 'xlabs')
        ) {
            server.realClients = server.players.length - server.bots
        } else if (server.game == 'iw4x') {
            server.realClients = server.clients
        } else if (server.game == 't4mp') {
            server.realClients = server.players.length
        } else if (server.platform == 'boiii') {
            server.realClients = server.clients - server.bots
        }

        countPlayers += server.realClients
        maxPlayers += server.maxplayers
        countBots += server.bots
    }

    return {
        servers: servers,
        countPlayers,
        countBots,
        maxPlayers,
        countServers: servers.length,
    }
}

const app = express()
app.disable("x-powered-by")

app.get(['/v1/servers', '/v1/servers/all'], (req, res) => {
    try {
        let ans = appendServerStats([...servers.xlabs.servers.all, ...servers.plutonium.servers.all, ...servers.boiii.servers.all])
        ans.servers = ans.servers.sort((a, b) => {
            return (b.realClients) - (a.realClients)
        })

        // average date because why not
        ans.date = (servers.xlabs.date + servers.plutonium.date + servers.boiii.date) / 3
        ans.platform = 'all'
        res.send(ans)
    } catch (err) {
        console.log(err)
        res.send([])
    }
})

app.get('/v1/servers/:platform', (req, res) => {
    try {
        let ans = appendServerStats(servers[req.params.platform].servers.all)
        ans.date = servers[req.params.platform].date
        ans.platform = req.params.platform
        res.send(ans)
    } catch (err) {
        console.log(err)
        res.send([])
    }
})

app.get('/v1/servers/:platform/:game', (req, res) => {
    try {
        let ans = appendServerStats(servers[req.params.platform].servers[req.params.game])
        ans.date = servers[req.params.platform].date
        ans.platform = req.params.platform
        res.send(ans)
    } catch {
        res.send([])
    }
})

app.listen(global_config.api.port)