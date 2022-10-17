function gametypeDisplay(gametype, game = undefined) {
    switch (gametype) {
        case 'war':
        case 'tdm':
            return 'Team-Deathmatch'
        case 'dm':
            return 'Free-For-All'
        case 'sd':
            return 'Search & Destroy'
        case 'sab':
            return 'Sabotage'
        case 'dom':
            return 'Domination'
        case 'koth':
            if (game == 't6mp') { return 'Hardpoint' } // fall-through if not t6mp
        case 'hq':
            return 'Headquarters'
        case 'ctf':
            return 'Capture the Flag'
        case 'oneflag':
            return 'One-flag CTF'
        case 'dd':
        case 'dem':
            return 'Demolition'
        case 'tdef':
            return 'Team Defender'
        case 'conf':
            return 'Kill Confirmed'
        case 'grnd':
        case 'dzone':
            return 'Drop Zone'
        case 'tjugg':
            return 'Team Juggernaut'
        case 'jugg':
            return 'Juggernaut'
        case 'gun':
        case 'gg':
            return 'Gun Game'
        case 'infect':
            return 'Infected'
        case 'oic':
        case 'oitc':
            return 'One In The Chamber'
        case 'gtnw':
            return 'Global Thermonuclear War'
        case 'shrp':
            return 'Sharpshooter'
        case 'zom':
        case 'zombies':
        case 'cmp':
            return 'Zombies'
        case 'zclassic':
            return 'Classic'
        case 'zstandard':
            return 'Standard'
        case 'zgrief':
            return 'Grief'
        case 'zcleansed':
            return 'Turned'
        case 'sas':
            return 'Sticks & Stones'
        case 'twar':
            if (game == 's1x') { return 'Momentum' }
            return 'War'
        case 'blitz':
            return 'Blitz'
        case 'crank':
            return 'Cranked'
        case 'grind':
            return 'Grind'
        case 'grnd':
            return 'Drop Zone'
        case 'horde':
            if (game == 'iw6x') { return 'Safeguard' }
            return 'EXO Survival' // s1x
        case 'sotf':
            return 'Hunted'
        case 'sotf_ffa':
            return 'Hunted FFA'
        case 'sr':
            return 'Search & Rescue'
        case 'aliens':
            return 'Extinction'
        case 'hp':
            return 'Hardpoint'
        case 'ball':
            return 'Uplink'

        default:
            return gametype
    }
}

function gameDisplay(game) {
    switch (game) {
        case 'iw5mp':
            return 'Modern Warfare 3'
        case 't4mp':
            return 'World at War'
        case 't4sp':
            return 'World at War: Zombies'
        case 't5mp':
            return 'Black Ops'
        case 't5sp':
            return 'Black Ops: Zombies'
        case 't6mp':
            return 'Black Ops II'
        case 't6zm':
            return 'Black Ops II: Zombies'
        case 'iw4x':
            return 'Modern Warfare 2'
        case 'iw6x':
            return 'Ghosts'
        case 's1x':
            return 'Advanced Warfare'
    }
}

module.exports = {
    gametype: gametypeDisplay,
    game: gameDisplay
}