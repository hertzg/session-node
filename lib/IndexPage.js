module.exports = (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.end('"session-node"')
}
