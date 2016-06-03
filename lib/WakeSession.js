var http = require('http')

var Log = require('./Log.js')

var accountNode = require('../config.js').accountNode

module.exports = (username, token, closeCallback) => {

    function errorListener (err) {
        Log.error('account-node-client: wakeSession: ' + JSON.stringify(err))
    }

    var proxyReq = http.request({
        host: accountNode.host,
        port: accountNode.port,
        path: '/wakeSession?username=' + encodeURIComponent(username) +
            '&token=' + encodeURIComponent(token),
    }, proxyRes => {

        proxyReq.removeListener('error', errorListener)

        var statusCode = proxyRes.statusCode
        if (statusCode !== 200) {
            Log.error('account-node-client: wakeSession: HTTP status code ' + statusCode)
            return
        }

    })
    proxyReq.end()
    proxyReq.on('error', errorListener)

}
