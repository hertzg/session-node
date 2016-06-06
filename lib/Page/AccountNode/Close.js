var Log = require('../../Log.js')

var accountNode = require('../../../config.js').accountNode

module.exports = sessions => {
    return (req, res, parsedUrl) => {

        res.setHeader('Content-Type', 'application/json')

        var query = parsedUrl.query

        var session = sessions[query.token]
        if (session === undefined) {
            res.end('"INVALID_TOKEN"')
            return
        }

        session.close()
        res.end('true')

    }
}
