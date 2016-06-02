var ProxyAccount = require('./lib/ProxyAccount.js')

module.exports = sessions => {
    return (req, res, parsedUrl) => {

        res.setHeader('Content-Type', 'application/json')

        var query = parsedUrl.query

        var session = sessions[query.token]
        if (session === undefined) {
            res.end('"INVALID_TOKEN"')
            return
        }

        session.wake()

        var queryString =
            '?username=' + encodeURIComponent(session.username) +
            '&currentPassword=' + encodeURIComponent(query.currentPassword) +
            '&newPassword=' + encodeURIComponent(query.newPassword)

        ProxyAccount(req, res, 'changePassword', queryString)

    }
}
