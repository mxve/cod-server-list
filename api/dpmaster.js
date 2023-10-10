const dgram = require('dgram');
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')
const misc = require('./misc.js');

class DPMaster {
    #udpClient = dgram.createSocket('udp4');
    servers = new Map();
    debug = process.env.debug === 'true'

    constructor(address, refreshInterval, maxAge, game, protocol, filters = "full empty", enableInfoEndpoint = true) {
        this.host = address.host;
        this.port = address.port;
        this.refreshInterval = refreshInterval;
        this.maxAge = maxAge;
        this.game = game;
        this.protocol = protocol;
        this.filters = filters;
        this.enableInfoEndpoint = enableInfoEndpoint;

        this.#setupUdpClient();
        this.#setupScheduler();
        this.#requestServers();
    }

    #setupScheduler() {
        this.scheduler = new ToadScheduler();

        this.refreshJob = new SimpleIntervalJob({ seconds: this.refreshInterval, }, new Task('dpmaster_refresh', () => {
            this.#requestServers();
        }));
        this.cleanJob = new SimpleIntervalJob({ seconds: 5, }, new Task('dpmaster_cleanup', () => {
            this.servers.forEach((server, identifier) => {
                if (server.date < Date.now() - this.maxAge * 1000) {
                    this.servers.delete(identifier);
                    if (this.debug)
                        console.log(`Removed ${identifier} from server list.\n----\n${JSON.stringify(server)}\n----\n`)
                }
            });
        }));

        this.scheduler.addSimpleIntervalJob(this.refreshJob);
        this.scheduler.addSimpleIntervalJob(this.cleanJob);
    }

    #setupUdpClient() {
        this.#udpClient.on('message', (buffer, remote) => {
            try {
                let cmd = buffer.toString();
                cmd = cmd.toString().substring(4, cmd.indexOf('Response') + 8);

                if (this.debug)
                    console.log(`Received ${cmd}, ${buffer.length} bytes from ${remote.address}:${remote.port}`);

                switch (cmd) {
                    case 'getserversResponse':
                        this.#handle_getserversResponse(buffer);
                        break;
                    case 'infoResponse':
                        this.#handle_infoResponse(buffer, remote.address, remote.port);
                        break;
                    default:
                        break;
                }
            } catch (err) {
                console.log(err);
            }
        });
    }

    #requestServers() {
        this.#sendCmd(this.host, this.port, `getservers ${this.game} ${this.protocol} ${this.filters}`)
    }

    #requestServerInfo(ip, port) {
        this.#sendCmd(ip, port, `getinfo ${misc.randomString(8)}`);
    }

    #sendCmd(ip, port, cmd) {
        const buffer = misc.strToCmdBuf(cmd);
        try {
            this.#udpClient.send(buffer, 0, buffer.length, port, ip);
        } catch (err) {
            console.log(err);
        }

        if (this.debug)
            console.log(`Sent "${cmd}" (${buffer.length} bytes) to ${ip}:${port}\n`);
    }

    #handle_getserversResponse(buffer) {
        const servers = []
        let segment = []

        // first 24 bytes are
        //  "0xFF0xFF0xFF0xFFgetserversResponse\n "
        for (const byte of buffer.slice(24)) {
            if (byte !== 92) {
                segment.push(byte)
                continue
            }

            if (segment.length === 6) {
                servers.push(segment)
            }

            segment = []
        }

        for (const server of servers) {
            const server_data = {
                ip: `${server[0]}.${server[1]}.${server[2]}.${server[3]}`,
                port: server[4] * 256 + server[5],
                date: new Date()
            }

            this.#requestServerInfo(server_data.ip, server_data.port);
        }
    }

    #handle_infoResponse(buffer, ip, port) {
        const server = {
            identifier: misc.generateIdentifier({ ip, port }),
            ip: ip,
            port: port,
            date: new Date(),
            info: misc.codInfoToKeyVal(buffer.toString().slice(17))
        }

        if (this.enableInfoEndpoint === true) {
            server.info.endpoint = `http://${ip}:${port}/info`

            fetch(server.info.endpoint)
                .then(res => res.json())
                .then(json => {
                    server.info = { ...server.info, ...json }
                    server.info.endpoint_available = true
                })
                .catch(err => {
                    server.info.endpoint_available = false
                })
        }

        if (this.debug && !this.servers.has(server.identifier))
            console.log(`Added ${server.identifier} to server list.\n----\n${JSON.stringify(server)}\n----\n`)

        this.servers.set(
            server.identifier,
            server
        );
    }

    getServer(identifier) {
        return this.servers.get(identifier);
    }

    getServerByAddress(ip, port) {
        return this.getServer(misc.generateIdentifier({ ip, port }));
    }

    getServers() {
        return this.servers;
    }
}

module.exports = DPMaster;