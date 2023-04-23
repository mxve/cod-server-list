const crypto = require('crypto')
const http = require('../shared/http.js')
const config = require('./config.json');

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

function strip_color_codes(string) {
    return string.replace(/\^(\d|:)/g, '')
}

function get_codInfo_value(key, codInfo, bool = false, int = false) {
    const key_index = codInfo.indexOf(key)
    if (key_index !== -1 && codInfo !== '' && codInfo.includes(key)) {
        // plutonium codInfo is not prepended with \\, so we need to make sure we aren't at index 0
        // if the char before our key isn't \ then we've hit a substring, so we try again with a slice
        if (key_index !== 0 && codInfo.charAt(key_index - 1) != '\\') {
            return get_codInfo_value(key, codInfo.slice(key_index + 1), bool, int)
        }

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

// TODO: make general getProtocol function for boiii & xlabs games
async function getBoiiiProtocol() {
    let src = await http.getBody(config.dpmaster.boiii.games.boiii.protocol_file_url)
    for (let line of src.split('\n')) {
        if (line.startsWith('#define PROTOCOL')) {
            return line.split(' ')[2]
        }
    }
    return config.dpmaster.boiii.games.boiii.protocol
}

function codInfoToKeyVal(info) {
    if (info.startsWith('\\')) {
        info = info.slice(1);
    }

    let info_array = info.split('\\');
    let info_obj = {};

    for (let i = 0; i < info_array.length; i += 2) {
        info_obj[info_array[i]] = info_array[i + 1];
    }

    return info_obj
}

module.exports = {
    strToBuf,
    addCmdHeader,
    strToCmdBuf,
    string_number_to_bool,
    get_codInfo_value,
    generateIdentifier,
    randomString,
    strip_color_codes,
    getBoiiiProtocol,
    codInfoToKeyVal
}