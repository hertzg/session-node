var http = require('http')

var Log = require('../../Log.js'),
    ReadText = require('../../ReadText.js')

var accountNode = require('../../../config.js').accountNode

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

        session.close()
        res.end('true')

        ;(() => {

            function errorListener (err) {
                Log.error(logPrefix + err.code)
            }

            var host = accountNode.host,
                port = accountNode.port

            var logPrefix = 'account-node-client: ' + host + ':' + port + ': sessionNode/signOut: '

            var proxyReq = http.request({
                host: host,
                port: port,
                path: '/sessionNode/signOut' +
                    '?username=' + encodeURIComponent(session.username) +
                    '&token=' + encodeURIComponent(token)
            }, proxyRes => {

                proxyReq.removeListener('error', errorListener)

                var statusCode = proxyRes.statusCode
                if (statusCode !== 200) {
                    Log.error(logPrefix + 'HTTP status code ' + statusCode)
                    return
                }

                ReadText(proxyRes, responseText => {

                    var response = JSON.parse(responseText)
                    if (response === 'INVALID_TOKEN') return

                    if (response !== true) {
                        Log.error(logPrefix + 'Invalid response: ' + JSON.stringify(response))
                    }

                })

            })
            proxyReq.end()
            proxyReq.on('error', errorListener)

            req.on('close', () => {
                proxyReq.abort()
            })

        })()

    }
}
