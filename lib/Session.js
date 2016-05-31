var assert = require('assert')

var Log = require('./Log.js')

module.exports = (username, user, closeListener) => {

    function startTimeout () {
        setTimeout(closeListener, 1000 * 60 * 5)
    }

    function wake () {
        clearTimeout(timeout)
        startTimeout()
    }

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
            clearTimeout(timeout)
            closeListener()
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
