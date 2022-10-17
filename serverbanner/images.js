const fs = require('fs')
const jimp = require('jimp')

async function generate_server_preview(server, create = false) {
    const filepath = `serverbanner/data/img/server_previews/generated/${server.ip}_${server.port}.png`

    const filepathexists = fs.existsSync(filepath)
    if ((!filepathexists && !create) || (filepathexists && create)) {
        return
    }

    // read error image by default, if we don't read an image at this point
    // the final image.write will throw an erro
    let image = await jimp.read('serverbanner/data/img/server_previews/error.png')

    try {
        // load title_font based on game
        // the font includes styling depending on the game
        const title_font = await jimp.loadFont(`serverbanner/data/fonts/${server.game}.fnt`)
        // default font
        const font = await jimp.loadFont(`serverbanner/data/fonts/medium.fnt`)
        image = await jimp.read('serverbanner/data/img/server_previews/background.png')
        // server hostname, centered
        image.print(title_font, 0, 5, { text: server.hostnameDisplay, alignmentX: jimp.HORIZONTAL_ALIGN_CENTER }, image.bitmap.width, image.bitmap.height)
        // player count, aligned left
        image.print(font, 12, 30, `${server.realClients}/${server.maxplayers}`)
        // map name, centered
        image.print(font, 0, 30, { text: server.mapDisplay, alignmentX: jimp.HORIZONTAL_ALIGN_CENTER }, image.bitmap.width, image.bitmap.height)
        // gametype, aligned right
        image.print(font, -12, 30, { text: server.gametypeDisplay, alignmentX: jimp.HORIZONTAL_ALIGN_RIGHT }, image.bitmap.width, image.bitmap.height)

        // add game icon
        let game_icon = await jimp.read(`serverbanner/data/img/server_previews/${server.game}.jpg`)
        game_icon.resize(18, 18)
        image.blit(game_icon, 12, 7)
    } catch (error) {
        console.log(error)
    }
    await image.write(filepath)
}

// workaround for file not found issue caused by the file creation being too slow
// this function will be called until the file could be read or a threshold was reached
async function _get_server_preview(server, create = true) {
    const filepath = `serverbanner/data/img/server_previews/generated/${server.ip}_${server.port}.png`
    try {
        if (!fs.existsSync(filepath) && create) {
            await generate_server_preview(server, true)
        } else if (!fs.existsSync(filepath)) {
            return false
        }
        return await jimp.read(filepath)
    } catch (error) {
        return false
    }
}

function timer(ms) { return new Promise(res => setTimeout(res, ms)); }
async function get_server_preview(server) {
    // if we don't know the server we don't want to create a preview image
    // bug found by Mr. Android
    if (!server.known) {
        return await jimp.read('serverbanner/data/img/server_previews/error.png')
    }

    let server_preview = await _get_server_preview(server)

    // retry getting server preview, maybe the fs is somewhat slow
    if (server_preview === false) {
        for (let i = 0; i < 10; i++) {
            await timer(10);
            server_preview = await _get_server_preview(server, false)
            if (server_preview != false) {
                break
            }
        }
    }

    if (server_preview !== false) {
        return server_preview
    }

    return await jimp.read('serverbanner/data/img/server_previews/error.png')
}

module.exports = {
    generate_server_preview,
    get_server_preview
}
