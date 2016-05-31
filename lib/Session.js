module.exports = (username, user, closeListener) => {

    var timeout = setTimeout(closeListener, 1000 * 60 * 5)

    return {
        user: user,
        username: username,
        close: function () {
            clearTimeout(timeout)
            closeListener()
        },
    }

}
