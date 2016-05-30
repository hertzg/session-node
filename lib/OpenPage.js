var crypto = require('crypto'),
    http = require('http')

var Session = require('./Session.js'),
    User = require('./User.js')

var accountNode = require('../config.js').accountNode

module.exports = (sessions, users) => {
    return (req, res, parsedUrl) => {

        var username = parsedUrl.query.username

        var user = users[username]
        if (user === undefined) {
            user = users[username] = User(() => {
                delete users[username]
                console.log('INFO: User ' + username + ' offline')
            })
            console.log('INFO: User ' + username + ' online')
        }

        var token = crypto.randomBytes(10).toString('hex')
        var session = Session(username, user, () => {

            delete sessions[token]
            console.log('INFO: Token ' + token + ' closed')
            user.removeSession(token)

            ;(() => {

                function errorListener (err) {
                    console.log('ERROR: account-node-client: signOut: ' + JSON.stringify(err))
                }

                var proxyReq = http.request({
                    host: accountNode.host,
                    port: accountNode.port,
                    path: '/signOut' +
                        '?username=' + encodeURIComponent(session.username) +
                        '&token=' + encodeURIComponent(token)
                }, proxyRes => {

                    proxyReq.removeListener('error', errorListener)

                    var statusCode = proxyRes.statusCode
                    if (statusCode !== 200) {
                        console.log('ERROR: account-node-client: signOut: HTTP status code ' + statusCode)
                        return
                    }

                    var responseText = ''
                    proxyRes.setEncoding('utf8')
                    proxyRes.on('data', chunk => {
                        responseText += chunk
                    })
                    proxyRes.on('end', () => {
                        var response = JSON.parse(responseText)
                        if (response !== true) {
                            console.log('ERROR: account-node-client: signOut: Invalid response ' + JSON.stringify(response))
                        }
                    })

                })
                proxyReq.end()
                proxyReq.on('error', errorListener)

            })()
        })
        user.addSession(token, session)

        sessions[token] = session
        console.log('INFO: Token ' + token + ' opened')

        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(token))

    }
}
