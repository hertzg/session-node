module.exports = (req, res) => {
    res.statusCode = 404
    res.setHeader('Content-Type', 'application/json')
    res.end('"NOT_FOUND"')
}
