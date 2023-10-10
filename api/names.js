function mapDisplay(map, game = undefined, custom = false) {
    try {
        // load map name dict
        let map_dict = ((custom == true) ? require(`./dicts/${game}_maps_custom.json`) : require(`./dicts/${game}_maps.json`))
        let map_name = map_dict[map]

        if (map_name != undefined) {
            return map_name
        } else if (!custom) {
            // couldn't find map name, but custom map names haven't been checked yet
            return mapDisplay(map, game, true)
        }
    } catch (error) {
        // console.log(error)
    }
    return map
}

function gametypeDisplay(gametype, game = undefined) {
    try {
        let gametype_dict = require(`./dicts/${game}_gametypes.json`)
        let gametype_name = gametype_dict[gametype]
        if (gametype_name != undefined) {
            return gametype_name
        }
    } catch (error) {
        // console.log(error)
    }
    return gametype
}

function gameDisplay(game) {
    try {
        let game_dict = require('./dicts/games.json')
        let game_name = game_dict[game]
        if (game_name != undefined) {
            return game_name
        }
    } catch (error) {
        // console.log(error)
    }
    return game
}

module.exports = {
    map: mapDisplay,
    gametype: gametypeDisplay,
    game: gameDisplay,
}