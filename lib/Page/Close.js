var http = require('http')

var Error500Page = require('../Error500Page.js')

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
