const global_config = require('../config.json')

const express = require('express')
const jimp = require('jimp')
const fs = require('fs')
const got = require('got')
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')

const images = require('./images')

const scheduler = new ToadScheduler()

// todo: add caching
async function getData() {
    const res = await got('https://list.plutools.pw/json')
    return JSON.parse(res.body)
}

async function getServer(ip, port) {
    const json = await getData()

    // find server in api cache
    let server = { ip, port, online: false, known: false }
    for (iserver of json.servers) {
        if (iserver.ip == ip && iserver.port == port) {
            server = iserver
            break
        }
    }

    return server
}

// task to generate server preview images, runs every second,
// uses below var to control wether new images should be generate on the run
let previews_done = true
const generate_previews_task = new Task('clear_images', async() => {
    if (previews_done) {
        previews_done = false
        //got(config.preview_generator_heartbeat_url)
        let data = await getData()
        for (server of data.servers) {
            const preview_path = `serverbanner/data/img/server_previews/generated/${server.ip}_${server.port}.png`
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


const app = express()

app.get('/v1/:ip/:port', async (req, res) => {
    const server = await getServer(req.params.ip, req.params.port)

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
})

app.listen(global_config.serverbanner.port)
