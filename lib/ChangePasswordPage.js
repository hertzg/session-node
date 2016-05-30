var http = require('http')

var Error500Page = require('./Error500Page.js')

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
                console.log('ERROR: account-node-client: changePassword: ' + JSON.stringify(err))
                Error500Page(res)
            }

            var proxyReq = http.request({
                host: accountNode.host,
                port: accountNode.port,
                path: '/changePassword?username=' + encodeURIComponent(session.username) +
                    '&currentPassword=' + encodeURIComponent(query.currentPassword) +
                    '&newPassword=' + encodeURIComponent(query.newPassword)
            }, proxyRes => {

                proxyReq.removeListener('error', errorListener)

                var statusCode = proxyRes.statusCode
                if (statusCode !== 200) {
                    console.log('ERROR: account-node-client: changePassword: HTTP status code ' + statusCode)
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
