const fs = require('fs')
const jimp = require('jimp')

async function server_preview(server) {
    const filepath = `data/img/server_previews/generated/${server.ip}_${server.port}.png`
    let image
    try {
        fs.mkdirSync("data/img/server_previews/generated/", { recursive: true })
        if (fs.existsSync(filepath)) {
            console.log('file')
            image = jimp.read(filepath)
        } else {
            console.log('gen')
            const title_font = await jimp.loadFont(`data/fonts/${server.game}.fnt`)
            const font = await jimp.loadFont(`data/fonts/medium.fnt`)
            image = await jimp.read('data/img/server_previews/background.png')
            image.print(title_font, 0, 5, { text: server.hostnameDisplay, alignmentX: jimp.HORIZONTAL_ALIGN_CENTER }, image.bitmap.width, image.bitmap.height)
            image.print(font, 12, 30, `${server.players.length}/${server.maxplayers}`)
            image.print(font, 0, 30, { text: server.mapDisplay, alignmentX: jimp.HORIZONTAL_ALIGN_CENTER }, image.bitmap.width, image.bitmap.height)
            image.print(font, -12, 30, { text: server.gametypeDisplay, alignmentX: jimp.HORIZONTAL_ALIGN_RIGHT }, image.bitmap.width, image.bitmap.height)

            let game_icon = await jimp.read(`data/img/server_previews/${server.game}.jpg`)
            game_icon.resize(18, 18)
            image.blit(game_icon, 12, 7)
            image.write(filepath)
        }
    } catch (error) {
        console.log(error)
        image = jimp.read('data/img/server_previews/error.png')
    }

    return image
}

module.exports = {
    server_preview
}
