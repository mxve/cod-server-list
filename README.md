# [Plutonium](https://plutonium.pw) & [xLabs](https://xlabs.dev) Server List
### -> [Show server list](https://list.plutools.pw)

---

## Sections

#### [Links](#Links)
#### [Screenshots](#Screenshots)
#### [FAQ](#FAQ)
#### [API](#API)

---

## Links
[![PluTools](gh_assets/plutools_64.png)](https://plutools.pw/) [![Discord Server](gh_assets/discord.png)](https://discord.gg/SnJQusteNZ) [![Plutonium](gh_assets/plutonium.jpg)](https://plutonium.pw/) [![xlabs](gh_assets/xlabs.png)](https://xlabs.dev) 

---

## Screenshots

![Server list screenshot](gh_assets/screenshot1.png)
![Server page screenshot](gh_assets/screenshot2.png)

## FAQ
#### How can I get my server removed from the website?
To have your server delisted please join the discord server or open an issue with either the hostname, ip or ip and port that you want to have removed. We may require you to prove ownership of the server.

#### I can't see the player names on the website.
Player names are currently only obtainable for Plutonium games and IW4x. If the names aren't showing for **your** IW4x server make sure to open the servers port as **both** *UDP* **and** *TCP*.

#### Why is the current round only displayed for Black Ops 2 Zombies?
For the other games the data isn't (correctly) provided by the platforms, so we have no way of knowing what round the servers are on.

#### Why is some of this code so bad?
Because I don't care, as long as it works.

---

## API
### API
```https://api.plutools.pw/v1/[endpoint]```
- ```/servers```
  - Return all servers
- ```/servers/<platform>```
  - ```<platform>``` can be ```xlabs``` or ```plutonium```
  - Return all servers on specified platform
- ```/servers/<platform>/<game>```
  - ```<game>``` can be ```iw4x```, ```iw6x```, ```s1x```, ```iw5mp```, ```t4sp```, ```t4mp```, ```t5sp```, ```t5mp```, ```t6zm``` or ```t6mp```
  - Return all servers for specified game

### Server banner
```https://b.plutools.pw/v1/[endpoint]```
- ```/<identifier>```
  - ```<identifier>``` is the unique server identifier found on the API or in the server list url
  - Returns server banner png
- ```/<ip>/<port>```
  - The game servers ```<ip>``` and ```<port>```
  - Returns server banner png

### Serverlist API (legacy)
```https://list.plutools.pw/[endpoint]```
*Legacy note: Because of the way the API is implemented it should stay up-to-date with the new API and there are no plans to remove it. The new API may get extended while this one stays behind though.*
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