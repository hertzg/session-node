module.exports = res => {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end('"INTERNAL_SERVER_ERROR"')
}
