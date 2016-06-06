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
            '&fullName=' + encodeURIComponent(query.fullName) +
            '&fullNamePrivacy=' + encodeURIComponent(query.fullNamePrivacy) +
            '&email=' + encodeURIComponent(query.email) +
            '&emailPrivacy=' + encodeURIComponent(query.emailPrivacy) +
            '&phone=' + encodeURIComponent(query.phone) +
            '&phonePrivacy=' + encodeURIComponent(query.phonePrivacy) +
            '&token=' + encodeURIComponent(token)

        ProxyAccount(req, res, 'editProfile', queryString)

    }
}
