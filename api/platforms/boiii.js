const geoip = require('geoip-lite')
const DPMaster = require('../dpmaster.js');
const misc = require('../misc.js');
const names = require('../names2.js');
const config = require('../config.json');

let master;
const country_name = new Intl.DisplayNames(['en'], { type: 'region' });

async function main() {
    master = new DPMaster({host: config.dpmaster.boiii.master.host, port: config.dpmaster.boiii.master.port}, 5, 30, 'T7', await misc.getBoiiiProtocol());
}
main();

async function getServers() {
    let servers = await master.getServers();
    let boiii_servers = [];

    for (const server_ref of servers.values()) {
        let server = {...server_ref};

        let info = server.info;
        delete server.info;
        info = {
            ...server,
            challenge: info.challenge,
            hc: misc.string_number_to_bool(info.hc),
            password: misc.string_number_to_bool(info.isPrivate),
            playmode: parseInt(info.playmode),
            hostname: info.hostname,
            hostnameDisplay: misc.limitLength(misc.strip_color_codes(info.hostname), config.misc.hostname_max_length),
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
            aimassist: "1",
            round: (info.gametype == 'zclassic' || info.gametype == 'CLASSICX') ? parseInt(info.rounds_played) + 1 || -1 : -1,
            known: true,
            changed: true,
            online: true,
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