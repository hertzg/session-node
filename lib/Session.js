module.exports = (username, user, closeListener) => {

    var timeout = setTimeout(closeListener, 1000 * 10)

    return {
        user: user,
        username: username,
        close: function () {
            clearTimeout(timeout)
            closeListener()
        },
    }

}
