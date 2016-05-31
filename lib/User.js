module.exports = offlineListener => {

    var numSessions = 0
    var sessions = Object.create(null)

    return {
        addSession: (token, session) => {
            sessions[token] = session
            numSessions++
        },
        removeSession: token => {
            delete sessions[token]
            numSessions--
            if (!numSessions) offlineListener()
        },
        pushMessage: (message, token) => {
            for (var i in sessions) {
                if (i !== token) sessions[i].pushMessage(message)
            }
        },
    }

}
