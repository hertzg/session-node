var http = require('http')

var Error500Page = require('./Error500Page.js'),
    Log = require('./Log.js')

var accountNode = require('../config.js').accountNode

module.exports = sessions => {
    return (req, res, parsedUrl) => {
        var requestText = ''
        req.setEncoding('utf8')
        req.on('data', chunk => {
            requestText += chunk
        })
        req.on('end', () => {

            res.setHeader('Content-Type', 'application/json')

            var query = parsedUrl.query

            var session = sessions[query.token]
            if (session === undefined) {
                res.end('"INVALID_TOKEN"')
                return
            }

            try {
                var requestObject = JSON.parse(requestText)
            } catch (e) {
                res.end('"BAD_REQUEST"')
                return
            }

            session.pushMessage(requestObject)

        })
    }
}
