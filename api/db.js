const mongoose = require("mongoose")

const ignored_fields = '-_id -__v'

const serverSchema = new mongoose.Schema({
    identifier: String,
    ip: String,
    port: Number,
    platform: String,
    game: String,
    game_display: String,
    hostname: String,
    hostname_display: String,
    map: String,
    map_display: String,
    gametype: String,
    gametype_display: String,
    clients_max: Number,
    clients: Number,
    bots: Number,
    players: Array,
    hardcore: Boolean,
    password: Boolean,
    round: Number,
    voice: Boolean,
    aimassist: String,
    description: String,
    cod_info: String,
    version: String,
    last_seen: Date,
    country_code: String,
    country: String
})

function two_minutes_ago() {
    const two_minutes_ago = new Date()
    two_minutes_ago.setMinutes(two_minutes_ago.getMinutes() - 2)
    return two_minutes_ago
}

const Server = mongoose.model('Server', serverSchema)

const getServer = async (identifier) => {
    const server = await Server.findOne({ identifier, last_seen: { $gte: two_minutes_ago() } }, ignored_fields)
    return server
}

const getServerByIp = async (ip, port) => {
    const server = await Server.findOne({ ip, port, last_seen: { $gte: two_minutes_ago() } }, ignored_fields)
    return server
}

const getServers = async () => {
    // don't get servers where last_seen is older than 5 minutes
    const servers = await Server.find({ last_seen: { $gte: two_minutes_ago() } }, ignored_fields)
    return servers
}

const getServersByGame = async (game) => {
    const servers = await Server.find({ game, last_seen: { $gte: two_minutes_ago() } }, ignored_fields)
    return servers
}

const getServersByPlatform = async (platform) => {
    const servers = await Server.find({ platform, last_seen: { $gte: two_minutes_ago() } }, ignored_fields)
    return servers
}

const insertServer = async (server) => {
    const newServer = new Server(server)
    await newServer.save()
}

const updateServer = async (server) => {
    await Server.updateOne({ identifier: server.identifier, last_seen: { $gte: two_minutes_ago() } }, server)
}

const updateOrInsertServer = async (server) => {
    const existingServer = await getServer(server.identifier)
    if (existingServer) {
        await updateServer(server)
    } else {
        await insertServer(server)
    }
}

const deleteServer = async (identifier) => {
    await Server.deleteOne({ identifier })
}

const deleteServerByIp = async (ip, port) => {
    await Server.deleteOne({ ip, port })
}

const connect = async (uri) => {
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

module.exports = {
    connect,
    serverSchema,
    Server,
    getServer,
    getServerByIp,
    getServers,
    getServersByGame,
    getServersByPlatform,
    insertServer,
    updateServer,
    updateOrInsertServer,
    deleteServer,
    deleteServerByIp
}