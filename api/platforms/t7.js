const geoip = require('geoip-lite')
const DPMaster = require('../dpmaster.js');
const misc = require('../misc.js');
const names = require('../names.js');
const config = require('../config.json');

let masters = {
    T7: null
};
const country_name = new Intl.DisplayNames(['en'], { type: 'region' });

async function main() {
    masters.T7 = new DPMaster({ host: config.dpmaster.alterware.master.host, port: config.dpmaster.alterware.master.port }, 20, 50, 'T7', config.dpmaster.alterware.games.t7.protocol);
}
main();

function gamenameToGame(gamename) {
    switch (gamename) {
        case 'T7':
            return 't7'
    }
}

function formatInfo(info) {
    return {
        challenge: info.challenge,
        checksum: info.checksum,
        password: misc.string_number_to_bool(info.isPrivate),
        hostname: info.hostname,
        hostnameDisplay: misc.limitLength(misc.strip_color_codes(info.hostname), config.misc.hostname_max_length),
        hostnameDisplayFull: misc.strip_color_codes(info.hostname),
        gamename: info.gamename,
        game: gamenameToGame(info.gamename),
        gameDisplay: names.game(gamenameToGame(info.gamename)),
        maxplayers: parseInt(info.sv_maxclients),
        gametype: info.gametype,
        gametypeDisplay: names.gametype(info.gametype, gamenameToGame(info.gamename)),
        sv_motd: info.sv_motd,
        xuid: info.xuid,
        map: info.mapname,
        mapDisplay: names.map(info.mapname, gamenameToGame(info.gamename)),
        clients: parseInt(info.clients),
        bots: parseInt(info.bots),
        protocol: parseInt(info.protocol),
        fs_game: info.fs_game,
        hc: misc.string_number_to_bool(info.hc),
        securityLevel: parseInt(info.securityLevel),
        shortversion: info.shortversion,
        sv_running: misc.string_number_to_bool(info.sv_running),
        wwwDownload: misc.string_number_to_bool(info.wwwDownload),
        wwwUrl: info.wwwUrl,
        aimassist: (typeof info.aimAssist !== "undefined") ? info.aimAssist : '-1',
        round: -1,
        known: true,
        changed: true,
        online: true,
        platform: 't7',
        players: info.players,
        endpoint_available: info.endpoint_available
    }
}

async function formatServers(game) {
    let servers = await masters[game].getServers();
    let _servers = [];

    for (const server_ref of servers.values()) {
        let server = { ...server_ref };

        let info = formatInfo(server.info);
        delete server.info;
        info = {
            ...server,
            ...info
        }

        info.players = Array(info.clients).fill('Unknown')

        try {
            info.country = geoip.lookup(info.ip).country.toLowerCase()
            info.countryDisplay = country_name.of(info.country.toUpperCase())
        } catch {
            info.country = 'lgbt'
            info.countryDisplay = 'Unknown'
        }
        _servers.push(info);
    }
    return _servers;
}

async function getServers() {
    const t7 = await formatServers('T7');

    return {
        servers: {
            t7,
            get all() {
                const servers = [].concat(this.t7)
                servers.sort((a, b) => {
                    return (b.clients - b.bots) - (a.clients - a.bots)
                })
                return servers
            }
        },
        date: Date.now()
    }
}

module.exports = { getServers };