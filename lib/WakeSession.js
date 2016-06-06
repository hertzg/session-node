var http = require('http')

var Log = require('./Log.js')

var accountNode = require('../config.js').accountNode

module.exports = (username, token, closeCallback) => {

    function errorListener (err) {
        Log.error(logPrefix + err.code)
    }

    var host = accountNode.host,
        port = accountNode.port

    var logPrefix = 'account-node-client: ' + host + ':' + port + ': sessionNode/wakeSession: '

    var proxyReq = http.request({
        host: accountNode.host,
        port: accountNode.port,
        path: '/sessionNode/wakeSession?username=' + encodeURIComponent(username) +
            '&token=' + encodeURIComponent(token),
    }, proxyRes => {

        proxyReq.removeListener('error', errorListener)

        var statusCode = proxyRes.statusCode
        if (statusCode !== 200) {
            Log.error(logPrefix + 'HTTP status code ' + statusCode)
            return
        }

    })
    proxyReq.end()
    proxyReq.on('error', errorListener)

}
