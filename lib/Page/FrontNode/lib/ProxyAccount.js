var http = require('http')

var Error500Page = require('../../../Error500Page.js'),
    Log = require('../../../Log.js')

var accountNode = require('../../../../config.js').accountNode

module.exports = (req, res, method, queryString) => {

    function closeListener () {
        proxyReq.removeListener('error', errorListener)
        proxyReq.on('error', () => {})
        proxyReq.abort()
    }

    function errorListener (err) {
        Log.error(logPrefix + err.code)
        Error500Page(res)
    }

    var host = accountNode.host,
        port = accountNode.port

    var logPrefix = 'account-node-client: ' + host + ':' + port + ': ' + method + ': '

    var proxyReq = http.request({
        host: host,
        port: port,
        path: '/' + method + queryString,
    }, proxyRes => {

        proxyReq.removeListener('error', errorListener)
        req.removeListener('close', closeListener)

        var statusCode = proxyRes.statusCode
        if (statusCode !== 200) {
            Log.error(logPrefix + 'HTTP status code ' + statusCode)
            Error500Page(res)
            return
        }

        proxyRes.pipe(res)

    })
    proxyReq.end()
    proxyReq.on('error', errorListener)

    req.on('close', closeListener)

}


