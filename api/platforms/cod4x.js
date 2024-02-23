const geoip = require('geoip-lite')
const DPMaster = require('../dpmaster.js');
const misc = require('../misc.js');
const names = require('../names.js');
const config = require('../config.json');

let masters = {
    IW3: null,
};
const country_name = new Intl.DisplayNames(['en'], { type: 'region' });

async function main() {
    masters.IW3 = new DPMaster({ host: config.dpmaster.cod4x.master.host, port: config.dpmaster.cod4x.master.port }, 20, 50, '', config.dpmaster.cod4x.games.iw3.protocol);
}
main();

function gamenameToGame(gamename) {
    switch (gamename) {
        case 'IW3':
            return 'iw3'
    }
}

function formatInfo(info) {
    return {
        challenge: info.challenge,
        checksum: info.checksum,
        password: misc.string_number_to_bool(info.pswrd),
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
        clients: parseInt(info.clients) || 0,
        bots: parseInt(info.bots) || 0,
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
        platform: 'cod4x',
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
    const iw3 = await formatServers('IW3');

    return {
        servers: {
            iw3,
            get all() {
                return this.iw3;
            }
        },
        date: Date.now()
    }
}

module.exports = { getServers };