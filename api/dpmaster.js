const dgram = require('dgram');
const misc = require('./misc.js');

const debug = process.env.debug === 'true' ? true : false;

class dpmaster {
    constructor(host, port, game, protocol, filters = "full empty") {
        this.host = host;
        this.port = port;
        this.game = game;
        this.protocol = protocol;
        this.filters = filters;
        this.servers = new Map();
    }

    parseServers(buffer) {
        let segment = []
        let servers = []

        // first 24 bytes are
        //  "0xFF0xFF0xFF0xFFgetserversResponse\n "
        for (const byte of buffer.slice(24)) {
            if (byte != 92) {
                segment.push(byte)
                continue
            }

            if (segment.length === 6) {
                servers.push(segment)
            }

            segment = []
        }


        for (const server of servers) {
            let server_data = {
                ip: server[0] + '.' + server[1] + '.' + server[2] + '.' + server[3],
                port: server[4] * 256 + server[5],
                date: new Date()
            }

            this.requestServerInfo(server_data.ip, server_data.port);
        }
    }

    async requestServers() {
        const client = dgram.createSocket('udp4');
        const buffer = misc.strToCmdBuf(`getservers\n${this.game} ${this.protocol} ${this.filters}`);
        client.send(buffer, 0, buffer.length, this.port, this.host, function (err, bytes) {
            if (err)
                throw err;
        });

        if (debug)
            console.log(`Sent ${buffer.length} bytes to ${this.host}:${this.port}\n----\n${buffer.toString()}\n----\n`);

        client.on('message', (buffer, remote) => {
            if (debug)
                console.log(`Received ${buffer.length} bytes from ${remote.address}:${remote.port}`);

            this.parseServers(buffer);
        });
    }

    async requestServerInfo(ip, port) {
        const client = dgram.createSocket('udp4');
        const buffer = misc.strToCmdBuf(`getinfo ${misc.randomString(8)}`);
        client.send(buffer, 0, buffer.length, port, ip, function (err, bytes) {
            if (err) {
                throw err;
            }
        });
        if (debug)
            console.log(`Sent ${buffer.length} bytes to ${ip}:${port}\n----\n${buffer.toString()}\n----\n`);

        client.on('message', (buffer, remote) => {
            if (debug)
                console.log(`Received ${buffer.length} bytes from ${remote.address}:${remote.port}`);
            let server = {
                identifier: misc.generateIdentifier({ ip, port }),
                ip: ip,
                port: port,
                date: new Date(),
                info: this.parseInfo(buffer.toString().slice(17))
            }

            this.servers.set(
                server.identifier,
                server
            );
        });
    }

    parseInfo(info) {
        if (info.startsWith('\\')) {
            info = info.slice(1);
        }

        let info_array = info.split('\\');
        let info_obj = {};

        for (let i = 0; i < info_array.length; i += 2) {
            info_obj[info_array[i]] = info_array[i + 1];
        }

        return info_obj
    }

    getServer(identifier) {
        return this.servers.get(identifier);
    }

    getServerByAddress(ip, port) {
        return this.getServer(misc.generateIdentifier({ ip, port }));
    }

    getServers() {
        return [...this.servers.values()];
    }
}

module.exports = dpmaster;