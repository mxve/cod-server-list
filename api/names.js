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
        case 'mp_silo':
            return 'Silo'
        case 'mp_zoo':
            return 'Zoo'
        case 'mp_havoc':
            return 'Jungle'
        case 'mp_gridlock':
            return 'Convoy'
        case 'mp_array':
            return 'Array'
        case 'mp_crisis':
            return 'Crisis'
        case 'mp_mountain':
            return 'Summit'
        case 'mp_cracked':
            return 'Cracked'
        case 'mp_radiation':
            return 'Radiation'
        case 'mp_berlinwall2':
            return 'Berlin Wall'
        case 'mp_cosmodrome':
            return 'Launch'
        case 'mp_russianbase':
            return 'WMD'
        case 'mp_golfcourse':
            return 'Hazard'
        case 'mp_kowloon':
            return 'Kowloon'
        case 'mp_stadium':
            return 'Stadium'
        case 'mp_area51':
            return 'Hangar 18'
        case 'mp_discovery':
            return 'Discovery'
        case 'mp_hanoi':
            return 'Hanoi'
        case 'mp_drivein':
            return 'Drive-In'
        case 'mp_cairo':
            return 'Havana'
        case 'mp_villa':
            return 'Villa'
        case 'mp_duga':
            return 'Grid'
        case 'mp_hotel':
            return 'Hotel'

        // iw4x
        case 'mp_afghan':
            return 'Afghan'
        case 'mp_derail':
            return 'Derail'
        case 'mp_estate':
            return 'Estate'
        case 'mp_favela':
            return 'Favela'
        case 'mp_highrise':
            return 'Highrise'
        case 'mp_invasion':
            return 'Invasion'
        case 'mp_checkpoint':
            return 'Karachi'
        case 'mp_quarry':
            return 'Quarry'
        case 'mp_rundown':
            return 'Rundown'
        case 'mp_rust':
            return 'Rust'
        case 'mp_boneyard':
            return 'Scrapyard'
        case 'mp_nightshift':
            return 'Skidrow'
        case 'mp_subbase':
            return 'SubBase'
        case 'mp_terminal':
            return 'Terminal'
        case 'mp_underpass':
            return 'Underpass'
        case 'mp_brecourt':
            return 'Wasteland'
        case 'mp_complex':
            return 'Bailout'
        case 'mp_crash':
            return 'Crash'
        case 'mp_overgrown':
            return 'Overgrown'
        case 'mp_compact':
            return 'Salvage'
        case 'mp_storm':
            return 'Storm'
        case 'mp_abandon':
            return 'Carnival'
        case 'mp_fuel2':
            return 'Fuel'
        case 'mp_strike':
            return 'Strike'
        case 'mp_trailerpark':
            return 'Trailer Park'
        case 'mp_vacant':
            return 'Vacant'
        case 'mp_nuked':
            return 'Nuketown'
        case 'mp_cross_fire':
            return 'Crossfire'
        case 'mp_bloc':
            return 'Bloc'
        case 'mp_cargoship':
            return 'Cargoship'
        case 'mp_killhouse':
            return 'Killhouse'
        case 'mp_bog_sh':
            return 'Bog'
        case 'mp_cargoship_sh':
            return 'Freighter'
        case 'mp_shipment':
            return 'Shipment'
        case 'mp_shipment_long':
            return 'Long Shipment'
        case 'mp_rust_long':
            return 'Long Rust'
        case 'mp_firingrange':
            return 'Firing Range'
        case 'mp_storm_spring':
            return 'Chemical Plant'
        case 'mp_fav_tropical':
            return 'Tropical Favela'
        case 'mp_estate_tropical':
            return 'Tropical Estate'
        case 'mp_crash_tropical':
            return 'Tropical Crash'
        case 'mp_bloc_sh':
            return 'Forgotten City'
        case 'oilrig':
            return 'Oilrig'
        case 'iw4_credits':
            return 'Testmap'
        case 'co_hunted':
            return 'Village'

        // iw6x
        case 'mp_prisonbreak':
            return 'Prision Break'
        case 'mp_dart':
            return 'Octane'
        case 'mp_lonestar':
            return 'Tremor'
        case 'mp_frag':
            return 'Freight'
        case 'mp_snow':
            return 'Whiteout'
        case 'mp_fahrenheit':
            return 'Stormfront'
        case 'mp_hashima':
            return 'Siege'
        case 'mp_warhawk':
            return 'Warhawk'
        case 'mp_sovereign':
            return 'Sovereign'
        case 'mp_zebra':
            return 'Overload'
        case 'mp_skeleton':
            return 'Stonehaven'
        case 'mp_chasm':
            return 'Chasm'
        case 'mp_flooded':
            return 'Flooded'
        case 'mp_strikezone':
            return 'Strikezone'
        case 'mp_descent_new':
            return 'Free Fall'
        case 'mp_dome_ns':
            return 'Unearthed'
        case 'mp_ca_impact':
            return 'Collision'
        case 'mp_ca_behemoth':
            return 'Behemoth'
        case 'mp_battery3':
            return 'Ruins'
        case 'mp_dig':
            return 'Pharaoh'
        case 'mp_favela_iw6':
            return 'Favela'
        case 'mp_pirate':
            return 'Mutiny'
        case 'mp_zulu':
            return 'Departed'
        case 'mp_conflict':
            return 'Dynasty'
        case 'mp_mine':
            return 'Goldrush'
        case 'mp_shipment_ns':
            return 'Showtime'
        case 'mp_zerosub':
            return 'Subzero'
        case 'mp_boneyard_ns':
            return 'Ignition'
        case 'mp_ca_red_river':
            return 'Containment'
        case 'mp_ca_rumble':
            return 'Bayview'
        case 'mp_swamp':
            return 'Fog'

        // iw6x zm
        case 'mp_alien_town':
            return 'Point of Contact'
        case 'mp_alien_armory':
            return 'Nightfall'
        case 'mp_alien_beacon':
            return 'Mayday'
        case 'mp_alien_dlc3':
            return 'Awakening'
        case 'mp_alien_last':
            return 'Exodus'

        // s1x
        case 'mp_refraction':
            return 'Ascend'
        case 'mp_lab2':
            return 'BioLab'
        case 'mp_comeback':
            return 'Comeback'
        case 'mp_laser2':
            return 'Defender'
        case 'mp_detroit':
            return 'Detroit'
        case 'mp_greenband':
            return 'Greenband'
        case 'mp_levity':
            return 'Horizon'
        case 'mp_instinct':
            return 'Instinct'
        case 'mp_recovery':
            return 'Recovery'
        case 'mp_venus':
            return 'Retreat'
        case 'mp_prison':
            return 'Riot'
        case 'mp_solar':
            return 'Solar'
        case 'mp_terrace':
            return 'Terrace'
        case 'mp_dam':
            return 'Atlas Gorge'
        case 'mp_spark':
            return 'ChopShop'
        case 'mp_climate_3':
            return 'Climate'
        case 'mp_sector17':
            return 'Compound'
        case 'mp_lost':
            return 'Core'
        case 'mp_torqued':
            return 'Drift'
        case 'mp_fracture':
            return 'Fracture'
        case 'mp_kremlin':
            return 'Kremlin'
        case 'mp_lair':
            return 'Overload'
        case 'mp_bigben2':
            return 'Parliament'
        case 'mp_perplex_1':
            return 'Perplex'
        case 'mp_liberty':
            return 'Quarantine'
        case 'mp_clowntown3':
            return 'Sideshow'
        case 'mp_blackbox':
            return 'Site244'
        case 'mp_highrise2':
            return 'Skyrise'
        case 'mp_seoul2':
            return 'Swarm'
        case 'mp_urban':
            return 'Urban'

        // s1x zm
        case 'mp_zombie_ark':
            return 'Outbreak'
        case 'mp_zombie_brg':
            return 'Infection'
        case 'mp_zombie_h2o':
            return 'Carrier'
        case 'mp_zombie_lab':
            return 'Descent'

        // s1x horde
        case 'mp_lab2':
            return 'Bio Lab'
        case 'mp_venus':
            return 'Retreat'
        case 'mp_detroit':
            return 'Detroit'
        case 'mp_refraction':
            return 'Ascend'
        case 'mp_levity':
            return 'Horizon'
        case 'mp_comeback':
            return 'Comeback'
        case 'mp_terrace':
            return 'Terrace'
        case 'mp_instinct':
            return 'Instinct'
        case 'mp_greenband':
            return 'Greenband'
        case 'mp_solar':
            return 'Solar'
        case 'mp_recovery':
            return 'Recovery'
        case 'mp_laser2':
            return 'Defender'
        case 'mp_prison':
            return 'Riot'
        case 'mp_clowntown3':
            return 'Sideshow'
        case 'mp_lost':
            return 'Core'
        case 'mp_torqued':
            return 'Drift'
        case 'mp_urban':
            return 'Urban'

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
        case 'iw4x':
            return 'Modern Warfare 2'
        case 'iw6x':
            return 'Ghosts'
        case 's1x':
            return 'Advanced Warfare'
    }
}

module.exports = {
    map: mapDisplay,
    gametype: gametypeDisplay,
    game: gameDisplay
}