const express = require('express')
const fs = require('fs')
const compression = require('compression')

const config = require('./config.js')
const global_config = require('../config.json')
const http = require('../shared/http.js')

const pluto_games = ['iw5mp', 't4mp', 't4sp', 't5mp', 't5sp', 't6mp', 't6zm']
const xlabs_games = ['iw4x', 'iw6x', 's1x']

async function getServers(game = 'all', search = undefined, includePlayers = false) {
    let endpoint = 'servers'

    if (search) {
        endpoint = `servers/search/${search}`
    } else {
        switch (game) {
            case 'plutonium':
                endpoint = 'servers/platform/plutonium'
                break
            case 'xlabs':
                endpoint = 'servers/platform/xlabs'
                break
            default:
                if (pluto_games.includes(game) || xlabs_games.includes(game)) {
                    endpoint = `servers/game/${game}`
                }
        }
    }

    let servers = await http.getBody(`${global_config.api.url}/v1/${endpoint}`)

    let filtered_servers = []
    api_iter:
    for (server of JSON.parse(servers)) {
        // iterate config.ignored_servers and check for either ip, ip and port or hostname
        for (ignored_server of config.ignored_servers) {
            if ((ignored_server.ip == server.ip && (ignored_server.port == server.port || ignored_server.port == 'any')) ||
                ignored_server.hostname == server.hostname) {
                continue api_iter
            }
        }

        filtered_servers.push(server)
    }

    return data = filtered_servers
}

// get a single server
async function getServer(ip, port) {
    let server = await http.getBody(`${global_config.api.url}/v1/server/address/${ip}/${port}`)
    server = JSON.parse(server)

    return server
}

async function getServerByIdentifier(identifier) {
    let server = await http.getBody(`${global_config.api.url}/v1/server/identifier/${identifier}`)
    server = JSON.parse(server)

    return server
}

const app = express()
app.disable("x-powered-by")
app.set('views', 'views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(compression())

// server list
app.get(['/', '/:game', '/json', '/:game/json'], async (req, res) => {
    let data = await getServers(req.params.game, req.query.search, req.query.players)

    if (req.url.endsWith('json')) {
        res.json(data)
    } else {
        res.render('serverlist', { api: data, config })
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
    res.render('server', { server, config, global_config })
})

// server page from identifier
app.get('/s/:identifier', async (req, res) => {
    let server = await getServerByIdentifier(req.params.identifier)
    res.render('server', { server, config, global_config })
})



// legacy serverbanner "proxy"
// serverbanners are now linked directly to serverbanner generator api on the client side
async function resPreviewImage(res, server) {
    let image = await http.getBuffer(`${global_config.serverbanner.url}/v1/${server.ip}/${server.port}`)
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
    res.end(image)
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
        const files = fs.readdirSync(dir).filter(fn => fn.startsWith('special'))
        img = files[Math.floor(Math.random() * files.length)]
    }
    res.sendFile(dir + img, { root: __dirname })
})

app.listen(config.port)