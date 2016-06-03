var assert = require('assert')

var Log = require('./Log.js'),
    WakeSession = require('./WakeSession.js')

module.exports = (token, username, user, destroyListener) => {

    function destroy () {
        assert.strictEqual(destroyed, false)
        destroyed = true
        destroyListener()
    }

    function startAccountWakeTimeout () {
        assert.strictEqual(destroyed, false)
        assert.strictEqual(accountWakeTimeout, 0)
        accountWakeTimeout = setTimeout(() => {
            accountWakeTimeout = 0
            WakeSession(username, token)
            startAccountWakeTimeout()
        }, 1000 * 10)
    }

    function startTimeout () {
        assert.strictEqual(destroyed, false)
        assert.strictEqual(timeout, 0)
        timeout = setTimeout(() => {
            timeout = 0
            destroy()
        }, 1000 * 10)
    }

    function stopAccountWakeTimeout () {
        assert.notStrictEqual(accountWakeTimeout, 0)
        clearTimeout(accountWakeTimeout)
        accountWakeTimeout = 0
    }

    function stopTimeout () {
        assert.notStrictEqual(timeout, 0)
        clearTimeout(timeout)
        timeout = 0
    }

    var destroyed = false

    var messages = [],
        messageListeners = []

    var timeout = 0
    startTimeout()

    var accountWakeTimeout = 0

    return {
        user: user,
        username: username,
        addMessageListener: listener => {
            messageListeners.push(listener)
            if (messageListeners.length === 1) {
                stopTimeout()
                startAccountWakeTimeout()
            }
        },
        destroy: () => {
            assert.strictEqual(destroyed, false)
            if (messageListeners.length === 0) stopTimeout()
            else stopAccountWakeTimeout()
            destroy()
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
                stopAccountWakeTimeout()
                startTimeout()
            }
        },
        removeMessageListener: listener => {
            var index = messageListeners.indexOf(listener)
            assert.notStrictEqual(index, -1)
            messageListeners.splice(index, 1)
            if (messageListeners.length === 0) {
                stopAccountWakeTimeout()
                startTimeout()
            }
        },
        wake: function () {
            assert.strictEqual(destroyed, false)
            if (messageListeners.length === 0) {
                stopTimeout()
                startTimeout()
            } else {
                stopAccountWakeTimeout()
                startAccountWakeTimeout()
            }
        },
    }

}
