const got = require('got')
const sanitizer = require('sanitizer')
const express = require('express')
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')

const names = require('./names.js')
const slugify = require('./slugify.js')

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

        server.gametypeDisplay = names.gametype(server.gametype)
        server.mapDisplay = names.map(server.map)
        server.hostnameDisplay = sanitizer.escape(server.hostname.replace(/\^\d/g, ''))
        servers.push(server)
    }

    return {
        json: servers,
        date: Date.now()
    }
}

async function getData(game = 'all') {
    if (apiCache === undefined) {
        apiCache = await getApiData()
    }

    const api = apiCache

    let maxPlayers = 0
    let countPlayers = 0
    let countServers = 0

    let servers = []
    for (server of api.json) {
        if (game !== 'all' && server.game != game) {
            continue
        }

        maxPlayers += server.maxplayers
        countPlayers += server.players.length
        countServers += 1

        servers.push(server)
    }
 
    let age = `${Date.now() - apiCache.date}ms`

    return {
        servers,
        age,
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

    let server
    for (iserver of json) {
        if (iserver.ip == ip && iserver.port == port) {
            server = iserver
            break
        }
    }

    return server
}

const app = express()
app.disable("x-powered-by");
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get(['/', '/:game'], async (req, res) => {
    if (req.params.game === 'iw5mp' ||
        req.params.game === 't6mp' ||
        req.params.game === 't6zm' || 
        req.params.game === 't4mp' ||
        req.params.game === 't4sp') {
            res.render('servers', { api: await getData(req.params.game) })
    } else {
            res.render('servers', { api: await getData('all') })
    }
})

app.get('/server/:ip/:port', async (req, res) => {
    res.render('server', { server: await getServer(req.params.ip, req.params.port) })
})

app.listen(1998)