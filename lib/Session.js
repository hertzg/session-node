var assert = require('assert')

var Log = require('./Log.js')

module.exports = (username, user, closeListener) => {

    function close () {
        destroyed = true
        closeListener()
    }

    function startTimeout () {
        timeout = setTimeout(close, 1000 * 60)
    }

    var destroyed = false

    var messages = [],
        messageListeners = []

    var timeout
    startTimeout()

    return {
        user: user,
        username: username,
        addMessageListener: listener => {
            messageListeners.push(listener)
        },
        close: () => {
            assert.strictEqual(destroyed, false)
            clearTimeout(timeout)
            close()
        },
        pullMessages: callback => {
            assert.strictEqual(destroyed, false)
            return messages.splice(0)
        },
        pushMessage: message => {
            assert.strictEqual(destroyed, false)
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
        wake: function () {
            assert.strictEqual(destroyed, false)
            clearTimeout(timeout)
            startTimeout()
        },
    }

}
