const global_config = require('../config.json')

const express = require('express')
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')

const plutonium = require('./platforms/plutonium.js')
const alterware = require('./platforms/alterware.js')
const iw4x = require('./platforms/iw4x.js')
const aurora = require('./platforms/aurora.js')

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
        date: Date.now()
    },
    alterware: {
        servers: {
            s1: [],
            iw6: [],
            all: []
        },
        date: Date.now()
    },
    iw4x: {
        servers: {
            all: [],
            get iw4x() {
                return this.all
            }
        },
        date: Date.now()
    },
    aurora: {
        servers: {
            h1: [],
            iw7: [],
            all: []
        },
        date: Date.now()
    }
}

const get_plutonium_servers = new Task('get_plutonium_servers', async () => {
    servers.plutonium = await plutonium.getServers()
})
const get_alterware_servers = new Task('get_alterware_servers', async () => {
    servers.alterware = await alterware.getServers()
})
const get_iw4x_servers = new Task('get_iw4x_servers', async () => {
    servers.iw4x.servers.all = iw4x.getServers()
})
const get_aurora_servers = new Task('get_aurora_servers', async () => {
    servers.aurora = await aurora.getServers()
})


const get_plutonium_servers_job = new SimpleIntervalJob({ seconds: 20 }, get_plutonium_servers)
//scheduler.addSimpleIntervalJob(get_plutonium_servers_job)
//get_plutonium_servers.execute()

const get_alterware_servers_job = new SimpleIntervalJob({ seconds: 2 }, get_alterware_servers)
scheduler.addSimpleIntervalJob(get_alterware_servers_job)
get_alterware_servers.execute()

const get_iw4x_servers_job = new SimpleIntervalJob({ seconds: 5 }, get_iw4x_servers)
scheduler.addSimpleIntervalJob(get_iw4x_servers_job)
get_iw4x_servers.execute()

const get_aurora_servers_job = new SimpleIntervalJob({ seconds: 5 }, get_aurora_servers)
scheduler.addSimpleIntervalJob(get_aurora_servers_job)
get_aurora_servers.execute()


function appendServerStats(servers) {
    let countPlayers = 0
    let countBots = 0
    let maxPlayers = 0

    for (server of servers) {
        if (server.hostname.includes("_PLUTOOLSHIDDEN")) {
            continue
        }

        if (
            (server.platform == 'plutonium' && server.game !== 't4mp') || server.platform == 'alterware' || server.platform == 'aurora'
        ) {
            server.realClients = server.players.length - server.bots
        } else if (server.game == 't4mp') {
            server.realClients = server.players.length
        }  else if (server.game == 'iw4x') {
            server.realClients = server.clients
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
        let ans = appendServerStats([...servers.alterware.servers.all, ...servers.plutonium.servers.all, ...servers.iw4x.servers.all, ...servers.aurora.servers.all])
        ans.servers = ans.servers.sort((a, b) => {
            return (b.realClients) - (a.realClients)
        })

        // average date because why not
        ans.date = Math.trunc((servers.alterware.date + servers.plutonium.date + servers.iw4x.date, servers.aurora.date) / 4)
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