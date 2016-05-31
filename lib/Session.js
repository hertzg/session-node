var assert = require('assert')

var Log = require('./Log.js')

module.exports = (username, user, closeListener) => {

    function close () {
        closed = true
        closeListener()
    }

    function startTimeout () {
        timeout = setTimeout(close, 1000 * 60)
    }

    function wake () {
        clearTimeout(timeout)
        startTimeout()
    }

    var closed = false

    var messages = [],
        messageListeners = []

    var timeout
    startTimeout()

    return {
        user: user,
        username: username,
        wake: wake,
        addMessageListener: listener => {
            messageListeners.push(listener)
        },
        close: () => {
            assert.strictEqual(closed, false)
            clearTimeout(timeout)
            close()
        },
        pullMessages: callback => {
            return messages.splice(0)
        },
        pushMessage: message => {
            if (messageListeners.length === 0) messages.push(message)
            else {
                messageListeners.splice(0).forEach(listener => {
                    listener(message)
                })
            }
        },
        removeMessageListener: listener => {
            var index = messageListeners.indexOf(listener)
            assert.notStrictEqual(index, -1)
            messageListeners.splice(index, 1)
        },
    }

}
