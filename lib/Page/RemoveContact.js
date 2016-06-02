var http = require('http')

var Error500Page = require('../Error500Page.js'),
    Log = require('../Log.js')

var accountNode = require('../../config.js').accountNode

module.exports = sessions => {
    return (req, res, parsedUrl) => {

        res.setHeader('Content-Type', 'application/json')

        var query = parsedUrl.query
        var token = query.token

        var session = sessions[token]
        if (session === undefined) {
            res.end('"INVALID_TOKEN"')
            return
        }

        session.wake()

        ;(() => {

            function errorListener (err) {
                Log.error('account-node-client: removeContact: ' + JSON.stringify(err))
                Error500Page(res)
            }

            var proxyReq = http.request({
                host: accountNode.host,
                port: accountNode.port,
                path: '/removeContact?username=' + encodeURIComponent(session.username) +
                    '&contactUsername=' + encodeURIComponent(query.username) +
                    '&token=' + encodeURIComponent(token),
            }, proxyRes => {

                proxyReq.removeListener('error', errorListener)

                var statusCode = proxyRes.statusCode
                if (statusCode !== 200) {
                    Log.error('account-node-client: removeContact: HTTP status code ' + statusCode)
                    Error500Page(res)
                    return
                }

                proxyRes.pipe(res)

            })
            proxyReq.end()
            proxyReq.on('error', errorListener)

            req.on('close', () => {
                proxyReq.abort()
            })

        })()

    }
}
