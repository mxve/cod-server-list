const dgram = require('dgram');
const misc = require('./misc.js');

class dpmaster {
    constructor(host, port, game, protocol, filters = "full empty") {
        this.host = host;
        this.port = port;
        this.game = game;
        this.protocol = protocol;
        this.filters = filters;
        this.servers = [];
        this.temp_servers = [];
    }

    async parse_getserversResponse(buffer) {
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

            if (!this.temp_servers.some(s => s.ip === server_data.ip && s.port === server_data.port)) {
                this.temp_servers.push(server_data)
            }
        }
    }

    async requestServers() {
        const client = dgram.createSocket('udp4');
        const buffer = misc.strToCmdBuf(`getservers\n${this.game} ${this.protocol} ${this.filters}`);
        client.send(buffer, 0, buffer.length, this.port, this.host, function (err, bytes) {
            if (err)
                throw err;
        });
        console.log(`Sent ${buffer.length} bytes to ${this.host}:${this.port}\n----\n${buffer.toString()}\n----\n`);

        client.on('message', (buffer, remote) => {
            console.log(`Received ${buffer.length} bytes from ${remote.address}:${remote.port}`);

            this.parse_getserversResponse(buffer);
        });
    }

    async requestServerInfo(ip, port) {
        const client = dgram.createSocket('udp4');
        const buffer = misc.strToCmdBuf(`getinfo ${misc.randomString(8)}`);
        client.send(buffer, 0, buffer.length, port, ip, function (err, bytes) {
            if (err) {
                this.temp_servers = this.temp_servers.filter(s => s.ip !== ip && s.port !== port);
                throw err;
            }
        });
        console.log(`Sent ${buffer.length} bytes to ${ip}:${port}\n----\n${buffer.toString()}\n----\n`);

        client.on('message', (buffer, remote) => {
            console.log(`Received ${buffer.length} bytes from ${remote.address}:${remote.port}`);
            this.servers.push({
                ip: ip,
                port: port,
                info: buffer.toString(),
                date: new Date()
            });
        });
    }

    async refreshServerInfo() {
        for (let server of this.temp_servers) {
            await this.requestServerInfo(server.ip, server.port);
        }
    }
}

module.exports = dpmaster;