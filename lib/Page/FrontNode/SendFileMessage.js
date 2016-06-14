var http = require('http')

var Log = require('../../Log.js'),
    ProxyAccount = require('./lib/ProxyAccount.js'),
    ReadText = require('../../ReadText.js')

var fileNode = require('../../../config.js').fileNode

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

        var name = query.name
        if (name === undefined) {
            res.end('"INVALID_NAME"')
            return
        }

        var size = parseInt(query.size, 10)
        if (!isFinite(size)) {
            res.end('"INVALID_SIZE"')
            return
        }

        ;(() => {

            function closeListener () {
                proxyReq.removeListener('error', errorListener)
                proxyReq.on('error', () => {})
                proxyReq.abort()
            }

            function errorListener (err) {
                Log.error(logPrefix + err.code)
                Error500Page(res)
            }

            var host = fileNode.host,
                port = fileNode.port

            var logPrefix = 'file-node-client: ' + host + ':' + port + ': sessionNode/send: '

            var proxyReq = http.request({
                host: host,
                port: port,
                path: '/sessionNode/send?sessionToken=' + token +
                    '&name=' + encodeURIComponent(name) +
                    '&size=' + encodeURIComponent(size),
            }, proxyRes => {

                proxyReq.removeListener('error', errorListener)
                req.removeListener('close', closeListener)

                var statusCode = proxyRes.statusCode
                if (statusCode !== 200) {
                    Log.error(logPrefix + 'HTTP status code ' + statusCode)
                    Error500Page(res)
                    return
                }

                ReadText(proxyRes, responseText => {

                    var response = JSON.parse(responseText)

                    var queryString =
                        '?username=' + encodeURIComponent(session.username) +
                        '&contactUsername=' + encodeURIComponent(query.username) +
                        '&name=' + encodeURIComponent(name) +
                        '&size=' + encodeURIComponent(size) +
                        '&token=' + encodeURIComponent(token) +
                        '&fileToken=' + encodeURIComponent(response)

                    ProxyAccount(req, res, 'sendFileMessage', queryString)

                })


            })
            proxyReq.end()
            proxyReq.on('error', errorListener)

            req.on('close', closeListener)

        })()

    }
}
