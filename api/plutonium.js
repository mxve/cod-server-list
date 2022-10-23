const geoip = require('geoip-lite')
const slugify = require('./slugify.js')
const names2 = require('./names2.js')
const misc = require('./misc.js')
const http = require('../shared/http.js')

let previous_servers = []
async function getServers() {
    const api = await http.getBody('https://plutonium.pw/api/servers')
    let version = await http.getBody('https://cdn.plutonium.pw/updater/prod/info.json')
    version = JSON.parse(version).revision

    const json = JSON.parse(api)

    let servers = {
        iw5mp: [],
        t4sp: [],
        t4mp: [],
        t5sp: [],
        t5mp: [],
        t6zm: [],
        t6mp: [],
        get all() {
            const servers = [].concat(this.iw5mp, this.t4sp, this.t4mp, this.t5sp, this.t5mp, this.t6zm, this.t6mp)
            servers.sort((a, b) => {
                return (b.players.length - b.bots) - (a.players.length - a.bots)
            })
            return servers
        }
    }

    let country_name = new Intl.DisplayNames(['en'], { type: 'region' })
    for (server of json) {
        // if (is_ignored_server(server)) {
        //     continue
        // }

        // Generate userslugs, used to identify users on plutonium forums
        for (player of server.players) {
            player.userslug = slugify(player.username)
        }

        // generate human readable gametype, map & hostname
        server.gametypeDisplay = names2.gametype(server.gametype, server.game)
        server.mapDisplay = names2.map(server.map, server.game)
        server.hostnameDisplay = server.hostname.replace(/\^\d/g, '')
        server.hostnameDisplayFull = server.hostnameDisplay
        server.round = misc.get_codInfo_value('rounds', server.codInfo) || '0'
        server.gameDisplay = names2.game(server.game)

        // server.password is only correct for iw5mp, so we have to parse codInfo for the correct value
        if (server.codInfo.includes('password')) {
            server.password = misc.get_codInfo_value('password', server.codInfo, true)
        }

        // aim assist -1 = unknown, 0 = off, 1 = on
        if (server.codInfo.includes('aimassist')) {
            server.aimassist = misc.get_codInfo_value('aimassist', server.codInfo)
        } else {
            server.aimassist = '-1'
        }

        if (server.hostnameDisplay.length > 44) {
            server.hostnameDisplay = `${server.hostnameDisplay.substring(0, 42)}...`
        }
        if (server.mapDisplay.length > 24) {
            server.mapDisplay = `${server.mapDisplay.substring(0, 22)}...`
        }

        if (server.game === 't5mp') {
            server.bots = server.players.filter(x => x.ping == 0).length
        }

        // in the future servers are supposed to be checked against a databse
        // these vars a already in use
        server.online = true
        server.known = true

        // its a girl! she was born on:
        server.date = Date.now()

        // check server version. bigger is better (thats what she said)
        if (server.revision >= version) {
            server.uptodate = true
        } else {
            server.uptodate = false
        }

        // if we can't get the servers country we'll use the default flag
        try {
            server.country = geoip.lookup(server.ip).country.toLowerCase()
            server.countryDisplay = country_name.of(server.country.toUpperCase())
        } catch {
            server.country = 'lgbt'
            server.countryDisplay = 'Unknown'
        }

        // check whether a relevant server variable has changed since the last run
        // helps us reduce the amount of preview images that have to be regenerated
        let prev_server = previous_servers.filter(it => it.ip == server.ip && it.port == server.port)
        server.changed = false
        if (prev_server.length > 0) {
            if (prev_server[0].players.length != server.players.length ||
                prev_server[0].map != server.map ||
                prev_server[0].gametype != server.gametype ||
                prev_server[0].hostname != server.hostname ||
                prev_server[0].maxplayers != server.maxplayers) {
                server.changed = true
            }
            server.identifier = prev_server[0].identifier
        } else {
            server.identifier = await misc.generateIdentifier(server)
        }

        server.platform = 'plutonium'

        switch (server.game) {
            case 'iw5mp':
                servers.iw5mp.push(server)
                break
            case 't4sp':
                servers.t4sp.push(server)
                break
            case 't4mp':
                servers.t4mp.push(server)
                break
            case 't5sp':
                servers.t5sp.push(server)
                break
            case 't5mp':
                servers.t5mp.push(server)
                break
            case 't6zm':
                servers.t6zm.push(server)
                break
            case 't6mp':
                servers.t6mp.push(server)
                break
        }

        //servers.push(server)
    }

    // save new servers as previous servers for the next run
    previous_servers = servers.all

    return {
        servers,
        date: Date.now(),
    }
}

module.exports = {
    getServers
}