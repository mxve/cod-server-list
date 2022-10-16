const dgram = require('dgram')
const geoip = require('geoip-lite')
const config = require('./config.json')
const misc = require('./misc.js')
const names = require('./names.js')

function parse_codInfo(codInfo) {
    const codInfo_parsed = {
        challenge: misc.get_codInfo_value('challenge', codInfo),
        checksum: misc.get_codInfo_value('checksum', codInfo),
        password: misc.get_codInfo_value('isPrivate', codInfo, true),
        hostname: misc.get_codInfo_value('hostname', codInfo),
        gamename: misc.get_codInfo_value('gamename', codInfo),
        maxplayers: parseInt(misc.get_codInfo_value('sv_maxclients', codInfo, false, true)),
        gametype: misc.get_codInfo_value('gametype', codInfo),
        sv_motd: misc.get_codInfo_value('sv_motd', codInfo),
        xuid: misc.get_codInfo_value('xuid', codInfo),
        map: misc.get_codInfo_value('mapname', codInfo),
        clients: parseInt(misc.get_codInfo_value('clients', codInfo, false, true)),
        bots: parseInt(misc.get_codInfo_value('bots', codInfo, false, true)),
        protocol: misc.get_codInfo_value('protocol', codInfo),
        fs_game: misc.get_codInfo_value('fs_game', codInfo),
        hc: misc.get_codInfo_value('hc', codInfo, true),
        securityLevel: misc.get_codInfo_value('securityLevel', codInfo),
        shortversion: misc.get_codInfo_value('shortversion', codInfo),
        sv_running: misc.get_codInfo_value('sv_running', codInfo, true),
        wwwDownload: misc.get_codInfo_value('wwwDownload', codInfo),
        wwwUrl: misc.get_codInfo_value('wwwUrl', codInfo),
    }

    // in the past i used players.length for player count on plutonium, this is for compatibility
    codInfo_parsed.players = Array(codInfo_parsed.clients).fill('')

    return codInfo_parsed
}

function gamenameToGame(gamename) {
    switch (gamename) {
        case 'IW4':
            return 'iw4x'
        case 'S1':
            return 's1x'
        case 'IW6':
            return 'iw6x'
        case 'T7':
            return 't7'
    }
}

async function parse_getserversResponse(buffer) {
    let byte_count = 0
    let part = 0
    let segment = []

    let parsed_data = {
        header: [],
        command: [],
        servers: [],
    }

    for (byte of buffer) {
        // get header, first 4 bytes xFF
        if (byte_count < 4 && byte === 255) {
            segment.push(byte)
            if (byte_count === 3) {
                parsed_data.header = segment
                segment = []
            }
        }

        if (byte_count >= 4) {
            // 92 = '/', delimits parts of the response
            if (byte === 92) {
                // first part is the command
                // valid servers have a length of 6 bytes
                if (part === 0 || segment.length === 6) {
                    if (part === 0) {
                        parsed_data.command = segment
                    } else {
                        parsed_data.servers.push(segment)
                    }
                    segment = []
                    part++
                    continue
                }
            }
            segment.push(byte)
        }

        byte_count++
    }

    let servers = []

    const client = dgram.createSocket('udp4')

    let country_name = new Intl.DisplayNames(['en'], { type: 'region' })
    client.on('message', function(msg, rinfo) {
        // parse the response
        const codInfo = msg.toString().split("infoResponse\n")[1]
        const codInfo_parsed = parse_codInfo(codInfo)
        const server = {
            ip: rinfo.address,
            port: rinfo.port,
            ...codInfo_parsed,
            codInfo,
            gametypeDisplay: names.gametype(codInfo_parsed.gametype, gamenameToGame(codInfo_parsed.gamename)),
            mapDisplay: names.map(codInfo_parsed.map, codInfo_parsed.game),
            hostnameDisplay: codInfo_parsed.hostname.replace(/\^(\d|:)/g, ''),
            hostnameDisplayFull: codInfo_parsed.hostname.replace(/\^(\d|:)/g, ''),
            round: misc.get_codInfo_value('rounds', codInfo) || '0',
            gameDisplay: names.game(gamenameToGame(codInfo_parsed.gamename)),
            game: gamenameToGame(codInfo_parsed.gamename),
            known: true,
            platform: 'xlabs',
        }
        try {
            server.country = geoip.lookup(server.ip).country.toLowerCase()
            server.countryDisplay = country_name.of(server.country.toUpperCase())
        } catch {
            server.country = 'lgbt'
            server.countryDisplay = 'Unknown'
        }

        let prev_server = previous_servers.filter(it => it.ip == server.ip && it.port == server.port)
        server.identifier = misc.generateIdentifier(server)
        server.changed = true

        servers.push(server)
    })

    for (server of parsed_data.servers) {
        // ignore servers that aren't 6 bytes long
        if (server.length !== 6) { continue }

        // parse server data
        // first 4 bytes are the ip address
        // byte 5-6 are the port
        let server_data = {
            ip: server[0] + '.' + server[1] + '.' + server[2] + '.' + server[3],
            port: server[4] * 256 + server[5],
        }

        // query the server for info
        const buffer = misc.strToCmdBuf(`getinfo ${misc.randomString(8)}`)
        client.send(buffer, 0, buffer.length, server_data.port, server_data.ip, function(err, bytes) {
            if (err) throw err
        })
    }

    // give servers some time to answer before closing the client
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 5000)
    })

    client.close()
    parsed_data.servers = servers
    return parsed_data
}

let previous_servers = []

async function getServers() {
    let xlabs_servers = {
        iw4x: [],
        iw6x: [],
        s1x: [],
        get all() {
            const servers = [].concat(this.iw4x, this.iw6x, this.s1x)
            servers.sort((a, b) => {
                return (b.clients - b.bots) - (a.clients - a.bots)
            })
            return servers
        }
    }
    const client = dgram.createSocket('udp4')
    for (game of config.xlabs.games) {
        const buffer = misc.strToCmdBuf(`getservers\n${game.game_id} ${game.protocol} full empty`)

        client.send(buffer, 0, buffer.length, config.xlabs.master.port, config.xlabs.master.host, function(err, bytes) {
            if (err) throw err
                // console.log(`Sent ${bytes} bytes to ${config.xlabs.master.host}:${config.xlabs.master.port}\n----\n${buffer.toString()}\n----\n`)
        })

        let response = await new Promise((resolve, reject) => {
            client.on('message', function(buffer, remote) {
                // console.log(`Received ${buffer.length} bytes from ${remote.address}:${remote.port}`)
                resolve(buffer)
            })
        })

        let servers = await parse_getserversResponse(response)
        servers = servers.servers
        servers = servers.sort((a, b) => {
            return (b.clients - b.bots) - (a.clients - a.bots)
        })
        switch (game.game_id) {
            case 'IW4':
                xlabs_servers.iw4x = servers
                break
            case 'IW6':
                xlabs_servers.iw6x = servers
                break
            case 'S1':
                xlabs_servers.s1x = servers
                break
        }
    }
    client.close()
    previous_servers = xlabs_servers.all
    return {
        servers: xlabs_servers,
        date: Date.now(),
    }
}

module.exports = {
    getServers
}