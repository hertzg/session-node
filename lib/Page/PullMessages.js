var http = require('http')

var Error500Page = require('../Error500Page.js'),
    Log = require('../Log.js')

var accountNode = require('../../config.js').accountNode

module.exports = sessions => {
    return (req, res, parsedUrl) => {

        res.setHeader('Content-Type', 'application/json')

        var query = parsedUrl.query

        var session = sessions[query.token]
        if (session === undefined) {
            res.end('"INVALID_TOKEN"')
            return
        }

        session.wake()

        var messages = session.pullMessages()
        if (messages.length > 0) {
            res.end(JSON.stringify(messages))
            return
        }

        ;(() => {

            function listener (message) {
                clearTimeout(timeout)
                res.end(JSON.stringify([message]))
            }

            session.addMessageListener(listener)

            var timeout = setTimeout(() => {
                session.removeMessageListener(listener)
                res.end(JSON.stringify('NOTHING_TO_PULL'))
            }, 1000 * 30)

        })()
    }
}
