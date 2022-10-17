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

module.exports = {
    map: mapDisplay
}