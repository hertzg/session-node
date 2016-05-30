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
                console.log('ERROR: account-node-client: editProfile: ' + JSON.stringify(err))
                Error500Page(res)
            }

            var proxyReq = http.request({
                host: accountNode.host,
                port: accountNode.port,
                path: '/editProfile?username=' + encodeURIComponent(session.username) +
                    '&fullName=' + encodeURIComponent(query.fullName) +
                    '&email=' + encodeURIComponent(query.email) +
                    '&phone=' + encodeURIComponent(query.phone),
            }, proxyRes => {

                proxyReq.removeListener('error', errorListener)

                var statusCode = proxyRes.statusCode
                if (statusCode !== 200) {
                    console.log('ERROR: account-node-client: editProfile: HTTP status code ' + statusCode)
                    Error500Page(res)
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
                        console.log('ERROR: account-node-client: editProfile: Invalid response ' + JSON.stringify(response))
                        Error500Page(res)
                        return
                    }

                    res.end('true')

                })

            })
            proxyReq.end()
            proxyReq.on('error', errorListener)

        })()

    }
}
