const crypto = require('crypto')

function strToBuf(string) {
    let arr = []
    for (let c of string) {
        arr.push(c.charCodeAt(0))
    }
    return new Buffer.from(arr)
}

function addCmdHeader(buffer) {
    return new Buffer.from([255, 255, 255, 255, ...buffer])
}

function strToCmdBuf(string) {
    return addCmdHeader(strToBuf(string))
}

function string_number_to_bool(string) {
    const num = Number(string)
    return !!num
}

function get_codInfo_value(key, codInfo, bool = false, int = false) {
    const key_index = codInfo.indexOf(key)
    if (key_index !== -1 && codInfo !== '' && codInfo.includes(key)) {
        let keyval = codInfo
            .substring(key_index + key.length + 1, codInfo.length)
        if (keyval.includes('\\')) {
            // keyval still contains more keys, so split them off
            keyval = keyval.substring(0, keyval.indexOf('\\'))
        }
        if (bool) {
            return string_number_to_bool(keyval)
        }
        return keyval
    }
    if (int === true) {
        return 0
    }
    return ''
}

function generateIdentifier(server) {
    // generate (hopefully) unique server identifier
    const address = `${server.ip}:${server.port}`
    // get base64 encoding of sha256 hash of address
    const hash = crypto.createHash('sha256').update(address).digest('base64')
    // make hash url safe by replacing +, / & =
    const urlsafe = hash.replaceAll('+', '-').replaceAll('/', '_').replace('=', '')
    // take first 10 chars
    const shortened = urlsafe.substr(0, 10)
    return shortened
}

function randomString(length) {
    let dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += dict.charAt(Math.floor(Math.random() *
            dict.length))
    }
    return result
}

// function combineObjectArrays(obj) {
//     let combined = []
//     for (const [key, value] of Object.entries(obj)) {
//         combined = combined.concat(value)
//     }
//     return combined
// }

module.exports = {
    strToBuf,
    addCmdHeader,
    strToCmdBuf,
    string_number_to_bool,
    get_codInfo_value,
    generateIdentifier,
    randomString,
}