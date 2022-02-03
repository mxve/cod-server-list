# [Plutonium](https://plutonium.pw) Server List

## -> [Show server list](https://pluto.mxve.de)

![](https://screen.sbs/i/nub625vm.png)

## API
- ```/json```, ```/<game>/json```
  - ```<game>``` can be ```all```, ```iw5mp```, ```t6mp```, ```t6zm```, ```t4mp``` or ```t4sp```
  - returns matching servers
    - for each server ip, port, known & online are always returned, everything else only if the server is online.
    ```
    {
        servers: [
            {
                ip: string,
                port: integer,
                game: string,
                hostname: string,
                map: string,
                gametype: string,
                players: [
                    {
                        username: string,
                        id: integer,
                        ping: integer,
                        userslug: string
                    }
                ],
                maxplayers: integer,
                hardcore: boolean,
                password: boolean,
                bots: integer,
                voice: integer,
                description: string,
                codInfo: string,
                revision: integer,
                gametypeDisplay: string,
                mapDisplay: string,
                hostnameDisplay: string,
                known: boolean,
                online: boolean,
                uptodate: boolean
            }
        ],
        age: string,
        maxPlayers: integer,
        countPlayers: integer,
        countServers: integer
    }
    ```
- ```/server/<ip>/<port>/json```
  - returns the matching server, see servers array above for keys


## Credits
- [NodeBB](https://github.com/NodeBB/NodeBB) authors for [slugify.js](slugify.js) | [Licensed under GPLv3](https://github.com/NodeBB/NodeBB/blob/master/LICENSE)