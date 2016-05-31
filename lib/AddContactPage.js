var http = require('http')

var Error500Page = require('./Error500Page.js'),
    Log = require('./Log.js')

var accountNode = require('../config.js').accountNode

module.exports = sessions => {
    return (req, res, parsedUrl) => {

        res.setHeader('Content-Type', 'application/json')

        var query = parsedUrl.query

        var session = sessions[query.token]
        if (session === undefined) {
            res.end('"INVALID_TOKEN"')
            return
        }

        ;(() => {

            function errorListener (err) {
                Log.error('account-node-client: addContact: ' + JSON.stringify(err))
                Error500Page(res)
            }

            var proxyReq = http.request({
                host: accountNode.host,
                port: accountNode.port,
                path: '/addContact?username=' + encodeURIComponent(session.username) +
                    '&contactUsername=' + encodeURIComponent(query.username) +
                    '&fullName=' + encodeURIComponent(query.fullName) +
                    '&email=' + encodeURIComponent(query.email) +
                    '&phone=' + encodeURIComponent(query.phone),
            }, proxyRes => {

                proxyReq.removeListener('error', errorListener)

                var statusCode = proxyRes.statusCode
                if (statusCode !== 200) {
                    Log.error('account-node-client: addContact: HTTP status code ' + statusCode)
                    Error500Page(res)
                    return
                }

                proxyRes.pipe(res)

            })
            proxyReq.end()
            proxyReq.on('error', errorListener)

        })()

    }
}
