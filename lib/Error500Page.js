module.exports = res => {
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain')
    res.end('500 Internal Server Error')
}
