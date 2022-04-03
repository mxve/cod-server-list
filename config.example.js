let config = {
    // public url
    url: 'https://list.plutools.pw',
    // delay in seconds before querying plutonium api again
    api_query_interval: 5,
    // listen port
    port: 1998,
    // get url for preview generator heartbeat
    preview_generator_heartbeat_url: '',
    // embedded on every page
    analytics: '<script>console.log("analytics")</script>',
    // don't list these servers
    ignored_servers: [
        // {
        //     ip: '127.0.0.1',
        //     port: '27016'
        // },
        // {
        //     ip: '127.0.0.2',
        //     port: 'any'
        // },
        // {
        //     hostname: 'Example ^1Hostname'
        // }
    ]
}

module.exports = config