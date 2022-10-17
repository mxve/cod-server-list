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
    game: gameDisplay
}