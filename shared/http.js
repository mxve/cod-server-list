async function getBody(url) {
    const req = await fetch(url)
    return await req.text()
}

async function getBuffer(url) {
    const req = await fetch(url)
    const arr = await req.arrayBuffer()
    return Buffer.from(arr)
}

module.exports = {
    getBody,
    getBuffer
}