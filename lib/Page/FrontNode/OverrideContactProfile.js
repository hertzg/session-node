var ProxyAccount = require('./lib/ProxyAccount.js')

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

        var queryString =
            '?username=' + encodeURIComponent(session.username) +
            '&contactUsername=' + encodeURIComponent(query.username) +
            '&fullName=' + encodeURIComponent(query.fullName) +
            '&email=' + encodeURIComponent(query.email) +
            '&phone=' + encodeURIComponent(query.phone) +
            '&token=' + encodeURIComponent(token)

        ProxyAccount(req, res, 'overrideContactProfile', queryString)

    }
}
