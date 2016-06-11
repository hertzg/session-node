var crypto = require('crypto'),
    http = require('http')

var Log = require('../../Log.js'),
    Session = require('../../Session.js'),
    User = require('../../User.js')

var accountNode = require('../../../config.js').accountNode

module.exports = (sessions, users) => {
    return (req, res, parsedUrl) => {

        var username = parsedUrl.query.username

        var user = users[username]
        if (user === undefined) {
            user = users[username] = User(() => {
                delete users[username]
                Log.info('"' + username + '" offline')
            })
            Log.info('"' + username + '" online')
        }

        var token = crypto.randomBytes(20).toString('hex')
        var session = Session(token, username, user, () => {
            delete sessions[token]
            Log.info('Session ' + token + ' closed')
            user.removeSession(token)
        }, () => {

            function errorListener (err) {
                Log.error(logPrefix + err.code)
            }

            var host = accountNode.host,
                port = accountNode.port

            var logPrefix = 'account-node-client: ' + host + ':' + port + ': sessionNode/removeSession: '

            var proxyReq = http.request({
                host: host,
                port: port,
                path: '/sessionNode/removeSession' +
                    '?username=' + encodeURIComponent(session.username) +
                    '&token=' + encodeURIComponent(token)
            }, proxyRes => {

                proxyReq.removeListener('error', errorListener)

                var statusCode = proxyRes.statusCode
                if (statusCode !== 200) {
                    Log.error(logPrefix + 'HTTP status code ' + statusCode)
                    return
                }

                var responseText = ''
                proxyRes.setEncoding('utf8')
                proxyRes.on('data', chunk => {
                    responseText += chunk
                })
                proxyRes.on('end', () => {

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

        })
        user.addSession(token, session)

        sessions[token] = session
        Log.info('Session ' + token + ' opened')

        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(token))

    }
}
