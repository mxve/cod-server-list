# [Plutonium](https://plutonium.pw), [X Labs](https://xlabs.dev) & [BOIII](https://boiii.re) Server List
### -> [Show server list](https://list.plutools.pw)

---

## Sections

#### [Links](#Links-1)
#### [Screenshots](#Screenshots-1)
#### [FAQ](#FAQ-1)
#### [API](#API-1)

---

## Links
[![PluTools](gh_assets/plutools_64.png)](https://plutools.pw/) [![Discord Server](gh_assets/discord.png)](https://discord.gg/SnJQusteNZ) [![Plutonium](gh_assets/plutonium.jpg)](https://plutonium.pw/) [![X Labs](gh_assets/xlabs.png)](https://xlabs.dev) [![YEAH OIII](gh_assets/boiii.jpg)](https://boiii.re)

---

## Screenshots

![Server list screenshot](gh_assets/screenshot1.png)
![Server page screenshot](gh_assets/screenshot2.png)

## FAQ
#### How can I get my server removed from the website?
To have your server delisted please join the discord server or open an issue with either the hostname, ip or ip and port that you want to have removed. We may require you to prove ownership of the server.

#### I can't see the player names on the website.
Player names are currently only obtainable for Plutonium clients and IW4x. If the names aren't showing for **your** IW4x server make sure to open the servers port as **both** *UDP* **and** *TCP*.

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
  - ```<platform>``` can be ```xlabs```, ```plutonium``` or ```boiii```
  - Return all servers on specified platform
- ```/servers/<platform>/<game>```
  - ```<game>``` can be ```iw4x```, ```iw6x```, ```s1x```, ```iw5mp```, ```t4sp```, ```t4mp```, ```t5sp```, ```t5mp```, ```t6zm```, ```t6mp``` or ```boiii```
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
- ```/s/<identifier>/json```, ```/server/<ip>/<port>/json```
  - returns the matching server, see servers array above for keys
- ```/s/<identifier>/png```, ```/server/<ip>/<port>/png```
  - Preview image with server details