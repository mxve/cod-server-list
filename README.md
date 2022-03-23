# [Plutonium](https://plutonium.pw) Server List

## -> [Show server list](https://list.plutools.pw)

[![alt text](https://plutools.pw/assets/img/plutools_64.png)](https://plutools.pw/) [![alt text](http://i.epvpimg.com/2m4qdab.png)](https://discord.gg/SnJQusteNZ) 

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
                date: string,
                uptodate: boolean,
                country: ISO 3166-1 alpha-2,
                aimassist: '-1' = unknown/'0' = off/'1' = on,
                identifier: string,
                round: string
            }
        ],
        date: string,
        maxPlayers: integer,
        countPlayers: integer,
        countServers: integer
    }
    ```
- ```/s/<identifier>/json```, ```/server/<ip>/<port>/json```
  - returns the matching server, see servers array above for keys
- ```/s/<identifier>/png```, ```/server/<ip>/<port>/png```
  - Preview image with server details

## Credits
- [NodeBB](https://github.com/NodeBB/NodeBB) authors for [slugify.js](slugify.js) | [GPLv3](https://github.com/NodeBB/NodeBB/blob/master/LICENSE)
- [Flagpack](https://github.com/jackiboy/flagpack) authors for [public/flags](public/flags), [public/css/flagpack.css](public/css/flagpack.css) | No License
- [Sortable](https://github.com/tofsjonas/sortable) authors for [public/js/sortable.js](public/js/sortable.js) | [Unlicense](https://github.com/tofsjonas/sortable/blob/main/LICENSE)
- [JS-Simple-Tooltip](https://github.com/wwwebbify/JS-Simple-Tooltip) authors for [public/js/tooltip.js](public/js/tooltip.js) | [GPLv3](https://github.com/wwwebbify/JS-Simple-Tooltip/blob/master/LICENSE)