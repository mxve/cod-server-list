const geoip = require('geoip-lite')
const DPMaster = require('../dpmaster.js');
const misc = require('../misc.js');
const names = require('../names2.js');

let master;
const country_name = new Intl.DisplayNames(['en'], { type: 'region' });

async function main() {
    master = new DPMaster({host: 'master.xlabs.dev', port: 20810}, 5, 30, 'T7', await misc.getBoiiiProtocol());
}
main();

async function getServers() {
    let servers = await master.getServers();
    let boiii_servers = [];
    for (const server of servers.values()) {
        if (!server.info) {
            return;
        }

        let info = server.info;
        delete server.info;
        info = {
            ...server,
            challenge: info.challenge,
            hc: misc.string_number_to_bool(info.hc),
            password: misc.string_number_to_bool(info.isPrivate),
            playmode: parseInt(info.playmode),
            hostname: info.hostname,
            hostnameDisplay: misc.strip_color_codes(info.hostname),
            hostnameDisplayFull: misc.strip_color_codes(info.hostname),
            gamename: info.gamename,
            game: 'boiii',
            gameDisplay: names.game('boiii'),
            maxplayers: parseInt(info.sv_maxclients),
            gametype: info.gametype,
            gametypeDisplay: names.gametype(info.gametype, 'boiii'),
            sv_motd: info.description,
            xuid: info.xuid,
            map: info.mapname,
            mapDisplay: names.map(info.mapname, 'boiii'),
            clients: parseInt(info.clients),
            bots: parseInt(info.bots),
            protocol: parseInt(info.protocol),
            gamemode: parseInt(info.gamemode),
            sv_running: misc.string_number_to_bool(info.sv_running),
            dedicated: misc.string_number_to_bool(info.dedicated),
            shortversion: info.shortversion,
            known: true,
            changed: true,
            platform: 'boiii',
        }

        info.players = Array(info.clients).fill('Unknown')

        try {
            info.country = geoip.lookup(info.ip).country.toLowerCase()
            info.countryDisplay = country_name.of(info.country.toUpperCase())
        } catch {
            info.country = 'lgbt'
            info.countryDisplay = 'Unknown'
        }
        boiii_servers.push(info);
    }
    return {
        servers: {
            boiii: boiii_servers,
            all: boiii_servers,
        },
        date: Date.now(),
    };
}

module.exports = {getServers};