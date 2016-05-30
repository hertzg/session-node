var crypto = require('crypto')

var Session = require('./Session.js'),
    User = require('./User.js')

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
        })
        user.addSession(token, session)

        sessions[token] = session
        console.log('INFO: Token ' + token + ' opened')

        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(token))

    }
}
