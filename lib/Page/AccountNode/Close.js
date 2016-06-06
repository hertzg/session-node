var Log = require('../../Log.js')

var accountNode = require('../../../config.js').accountNode

module.exports = sessions => {
    return (req, res, parsedUrl) => {

        res.setHeader('Content-Type', 'application/json')

        var query = parsedUrl.query

        var tokens = query.tokens
        if (tokens !== undefined) {
            tokens.split(',').forEach(token => {
                var session = sessions[token]
                if (session !== undefined) session.close()
            })
        }

        res.end('true')

    }
}
