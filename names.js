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
            return 'War'
        default:
            return gametype
    }
}


// For what ever reason you are reading this code so
// I want to apologize, the following maps aren't in
// any specific order at all.

function mapDisplay(map, game = undefined) {
    switch (map) {
        case 'mp_mogadishu':
            return 'Bakaara'
        case 'mp_mirage':
            return 'Mirage'
        case 'mp_nuketown_2020':
            return 'Nuketown 2025'
        case 'mp_hijacked':
            return 'Hijacked'
        case 'mp_paris':
            return 'Resistance'
        case 'mp_hydro':
            return 'Hydro'
        case 'mp_skate':
            return 'Grind'
        case 'mp_studio':
            return 'Studio'
        case 'mp_village':
            switch (game) {
                case 't6mp':
                    return 'Standoff'
                case 'iw5mp':
                    return 'Village'
            }
            return 'Standoff'
        case 'mp_slums':
            return 'Slums'
        case 'mp_raid':
            return 'Raid'
        case 'mp_rust':
            return 'Rust'
        case 'mp_concert':
            return 'Encore'
        case 'mp_nuked':
            return 'Nuketown'
        case 'zm_prison':
            return 'Mob of the Dead'
        case 'zm_transit':
        case 'zm_transit_dr':
            return 'TranZit'
        case 'zm_nuked':
            return 'Nuketown Zombies'
        case 'mp_vertigo':
            return 'Vertigo'
        case 'mp_six_ss':
            return 'Vortex'
        case 'mp_dome':
            return 'Dome'
        case 'zm_buried':
            return 'Buried'
        case 'mp_bridge':
            return 'Detour'
        case 'mp_paintball':
            return 'Rush'
        case 'mp_plaza2':
            return 'Arkaden'
        case 'mp_downhill':
            return 'Downhill'
        case 'mp_turbine':
            return 'Turbine'
        case 'zm_tomb':
            return 'Origins'
        case 'mp_bravo':
            return 'Mission'
        case 'zm_highrise':
            return 'Die Rise'
        case 'mp_takeoff':
            return 'Takeoff'
        case 'mp_meteora':
            return 'Sanctuary'
        case 'mp_highrise':
            return 'Highrise'
        case 'mp_favela':
            return 'Favela'
        case 'mp_express':
            return 'Express'
        case 'mp_alpha':
            return 'Lockdown'
        case 'mp_carrier':
            return 'Carrier'
        case 'mp_dig':
            return 'Dig'
        case 'mp_makin_day':
            return 'Makin Day'
        case 'mp_drone':
            return 'Drone'
        case 'mp_hardhat':
            return 'Hardhat'
        case 'mp_suburban':
            return 'Upheaval'
        case 'mp_underground':
            return 'Underground'
        case 'mp_bootleg':
            return 'Bootleg'
        case 'mp_asylum':
            return 'Asylum'
        case 'mp_meltdown':
            return 'Meltdown'
        case 'mp_exchange':
            return 'Downturn'
        case 'mp_shipbreaker':
            return 'Decommission'
        case 'mp_terminal':
        case 'mp_terminal_cls':
            return 'Terminal'
        case 'mp_uplink':
            return 'Uplink'
        case 'mp_dockside':
            return 'Cargo'
        case 'mp_la':
            return 'Aftermath'
        case 'mp_overwatch':
            return 'Overwatch'
        case 'mp_castle':
            return 'Castle'
        case 'mp_vodka':
            return 'Revolution'
        case 'mp_lambeth':
            return 'Fallen'
        case 'mp_seatown':
            return 'Seatown'
        case 'mp_frostbite':
            return 'Frost'
        case 'mp_airfield':
            return 'Airfield'
        case 'mp_interchange':
            return 'Interchange'
        case 'mp_socotra':
            return 'Yemen'
        case 'mp_nightclub':
            return 'Plaza'
        case 'mp_courtyard':
        case 'mp_courtyard_ss':
            return 'Courtyard'
        case 'mp_outskirts':
            return 'Outskirts'
        case 'mp_carbon':
            return 'Carbon'
        case 'mp_morningwood': // bruh
            return 'Black Box'
        case 'mp_magma':
            return 'Magma'
        case 'mp_kwai':
            return 'Banzai'
        case 'mp_shrine':
            return 'Cliffside'
        case 'mp_roundhouse':
            return 'Roundhouse'
        case 'mp_seelow':
            return 'Seelow'
        case 'mp_boneyard':
        case 'mp_scrapyard':
            return 'Scrapyard'
        case 'mp_poolparty':
            return 'Poolparty'
        case 'mp_italy':
            return 'Piazza'
        case 'mp_pod':
            return 'Pod'
        case 'mp_nightshift':
            return 'Skidrow'
        case 'mp_docks':
            return 'Docks'
        case 'mp_roughneck':
            return 'Off Shore'
        case 'mp_radar':
            return 'Outpost'
        case 'mp_qadeem':
            return 'Oasis'
        case 'mp_makin':
            return 'Makin'
        case 'mp_bgate':
            return 'Breach'
        case 'mp_nachtfeuer':
            return 'Nightfire'
        case 'mp_drum':
            return 'Battery'
        case 'mp_hangar':
            return 'Hangar'
        case 'mp_aground_ss':
            return 'Aground'
        case 'mp_hillside_ss':
            return 'Getaway'
        case 'mp_overflow':
            return 'Overflow'
        case 'mp_downfall':
            return 'Downfall'
        case 'mp_burn_ss':
            return 'U-Turn'
        case 'mp_nola':
            return 'Parish'
        case 'mp_castaway':
            return 'Cove'
        case 'mp_restrepo_ss':
            return 'Lookout'
        case 'mp_kneedeep':
            return 'Knee Deep'
        case 'mp_moab':
            return 'Gulch'
        case 'mp_shipment':
            return 'Shipment'
        case 'mp_cbble':
            return 'Cobblestone'
        case 'mp_poolparty':
            return 'Poolparty'
        case 'mp_memegallery':
            return 'Meme Gallery'
        case 'mp_park':
            return 'Liberation'
        case 'mp_firingrange':
            return 'Firing Range'
        case 'mp_killhouse':
            return 'Killhouse'
        case 'mp_cbble':
            return 'Cobblestone'
        case 'mp_crosswalk_ss':
            return 'Intersection'
        case 'zombie_theater':
            return 'Kino der Toten'
        case 'zombie_pentagon':
            return '"Five"'
        case 'zombie_cod5_prototype':
        case 'nazi_zombie_prototype':
            return 'Nacht der Untoten'
        case 'zombie_coast':
            return 'Call of the Dead'
        case 'zombie_cod5_factory':
        case 'nazi_zombie_factory':
            return 'Der Riese'
        case 'zombie_cod5_asylum':
        case 'nazi_zombie_asylum':
            return 'Verrückt'
        case 'zombie_cosmodrome':
            return 'Ascension'
        case 'zombie_cod5_sumpf':
        case 'nazi_zombie_sumpf':
            return 'Shi No Numa'
        case 'zombie_paris':
        case 'zombie_moon':
            return 'Moon'
        case 'zombie_temple':
            return 'Shangri-La'
        default:
            return map
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
    }
}

module.exports = {
    map: mapDisplay,
    gametype: gametypeDisplay,
    game: gameDisplay
}