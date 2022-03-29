function copy(text) {
    navigator.clipboard.writeText(text);
    alert("Copied!");
}
function copyServer() {
    copy("connect <%= server.ip %>:<%= server.port %>")
}