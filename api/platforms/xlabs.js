const geoip = require('geoip-lite')
const DPMaster = require('../dpmaster.js');
const misc = require('../misc.js');
const names = require('../names2.js');
const config = require('../config.json');

let masters = {
    IW4: null,
    S1: null,
    IW6: null
};
const country_name = new Intl.DisplayNames(['en'], { type: 'region' });

async function main() {
    masters.IW4 = new DPMaster({ host: config.dpmaster.xlabs.master.host, port: config.dpmaster.xlabs.master.port }, 5, 30, 'IW4', config.dpmaster.xlabs.games.iw4x.protocol, "full empty", true);
    masters.S1 = new DPMaster({ host: config.dpmaster.xlabs.master.host, port: config.dpmaster.xlabs.master.port }, 5, 30, 'S1', config.dpmaster.xlabs.games.s1x.protocol);
    masters.IW6 = new DPMaster({ host: config.dpmaster.xlabs.master.host, port: config.dpmaster.xlabs.master.port }, 5, 30, 'IW6', config.dpmaster.xlabs.games.iw6x.protocol);
}
main();

function gamenameToGame(gamename) {
    switch (gamename) {
        case 'IW4':
            return 'iw4x'
        case 'S1':
            return 's1x'
        case 'IW6':
            return 'iw6x'
    }
}

function formatInfo(info) {
    return {
        challenge: info.challenge,
        checksum: info.checksum,
        password: misc.string_number_to_bool(info.isPrivate),
        hostname: info.hostname,
        hostnameDisplay: misc.strip_color_codes(info.hostname),
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
        aimassist: misc.string_number_to_bool(info.aimassist),
        known: true,
        changed: true,
        online: true,
        platform: 'xlabs',
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

        if (!(info.game === 'iw4x' && info.endpoint_available === true)) {
            info.players = Array(info.clients).fill('Unknown')
        }

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
    const iw4x = await formatServers('IW4');
    const s1x = await formatServers('S1');
    const iw6x = await formatServers('IW6');

    return {
        servers: {
            iw4x,
            iw6x,
            s1x,
            get all() {
                const servers = [].concat(this.iw4x, this.iw6x, this.s1x)
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