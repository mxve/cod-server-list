module.exports = {
    apps: [
        {
            name: "plutools-api",
            script: "./api/app.js",
            env: {
                "NODE_ENV": "production",
            }
        },
        {
            name: "plutools-serverbanner",
            script: "./serverbanner/app.js",
            env: {
                "NODE_ENV": "production",
            }
        }
    ]
}
