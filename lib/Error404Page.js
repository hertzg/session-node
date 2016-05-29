module.exports = (req, res) => {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end('404 Not Found')
}
