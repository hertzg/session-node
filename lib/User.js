var assert = require('assert')

module.exports = destroyListener => {

    var numSessions = 0
    var sessions = Object.create(null)

    var destroyed = false

    return {
        addSession: (token, session) => {
            assert.strictEqual(destroyed, false)
            assert.strictEqual(sessions[token], undefined)
            sessions[token] = session
            numSessions++
        },
        removeSession: token => {
            assert.strictEqual(destroyed, false)
            assert.notStrictEqual(sessions[token], undefined)
            delete sessions[token]
            numSessions--
            if (!numSessions) {
                destroyed = true
                destroyListener()
            }
        },
        pushMessage: (message, excludeToken) => {
            assert.strictEqual(destroyed, false)
            for (var i in sessions) {
                if (i !== excludeToken) sessions[i].pushMessage(message)
            }
        },
    }

}
