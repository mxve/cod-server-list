const dgram = require('dgram');
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');
const geoip = require('geoip-lite');
const misc = require('../misc.js');
const config = require('../config.json');
const names = require('../names.js')
const country_name = new Intl.DisplayNames(['en'], { type: 'region' });

const server_list = new Map();
let server_address_list = [];

const scheduler = new ToadScheduler();
const refreshAddressesJob = new SimpleIntervalJob({ seconds: 120 }, new Task('iw4x_refresh_addresses', refreshAddresses));
const refreshServersJob = new SimpleIntervalJob({ seconds: 20 }, new Task('iw4x_refresh_servers', refreshServers));

scheduler.addSimpleIntervalJob(refreshAddressesJob);
scheduler.addSimpleIntervalJob(refreshServersJob);

const udpClient = dgram.createSocket('udp4');
udpClient.on('message', async (buffer, remote) => {
    try {
        let cmd = buffer.toString();
        cmd = cmd.substring(4, cmd.indexOf('Response') + 8);

        if (cmd === 'infoResponse') {
            handle_infoResponse(buffer, remote.address, remote.port);
        }
    } catch (e) {
        console.log(e);
    }
});

function formatServer(info, address, port) {
    let ret = {
        identifier: misc.generateIdentifier({ ip: address, port }),
        ip: address,
        port,
        challenge: info.challenge,
        checksum: info.checksum,
        password: misc.string_number_to_bool(info.isPrivate),
        hostname: info.hostname,
        hostnameDisplay: misc.limitLength(misc.strip_color_codes(info.hostname), config.misc.hostname_max_length),
        hostnameDisplayFull: misc.strip_color_codes(info.hostname),
        gamename: info.gamename,
        game: "iw4",
        gameDisplay: names.game("iw4"),
        maxplayers: parseInt(info.sv_maxclients),
        gametype: info.gametype,
        gametypeDisplay: names.gametype(info.gametype, "iw4"),
        sv_motd: info.sv_motd,
        xuid: info.xuid,
        map: info.mapname,
        mapDisplay: names.map(info.mapname, "iw4"),
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
        platform: 'alterware',
        players: Array(info.clients).fill('Unknown'),
        date: Date.now()
    }
    try {
        ret.country = geoip.lookup(ret.ip).country.toLowerCase()
        ret.countryDisplay = country_name.of(ret.country.toUpperCase())
    } catch {
        ret.country = 'lgbt'
        ret.countryDisplay = 'Unknown'
    }

    return ret;
}

async function handle_infoResponse(buffer, address, port) {
    const info = misc.codInfoToKeyVal(buffer.toString().slice(17));
    const server = formatServer(info, address, port);

    if (server.protocol < 150) { // update your servers 149 bruh
        return
    }

    server_list.set(server.identifier, server);
}

function sendCmd(address, port, cmd) {
    const buffer = misc.strToCmdBuf(cmd);
    try {
        udpClient.send(buffer, 0, buffer.length, port, address);
    } catch (e) {
        console.log(e);
    }
}

// Kick things off by getting the server list from nodes
refreshAddresses();

async function refreshAddresses() {
    const servers = await fetch(`${config.iw4x.master}`).then(res => res.json());
    let server_addresses = servers.servers.map(server => `${server.ip}:${server.port}`);
    server_address_list = [...new Set(server_addresses.flat())];
}

async function refreshServers() {
    for (const address of server_address_list) {
        const [ip, port] = address.split(':');
        try {
            sendCmd(ip, port, `getinfo ${misc.randomString(8)}`);
        } catch (e) {
            console.log(e);
        }
    }

    const currentTime = Date.now();
    for (const [identifier, server] of server_list.entries()) {
        if (server.date < currentTime - 300 * 1000) {
            server_list.delete(identifier);
        }
    }
}

function getServers() {
    return Array.from(server_list.values());
}

module.exports = {
    getServers
};
