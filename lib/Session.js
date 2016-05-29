module.exports = (username, user, timeoutListener) => {

    setTimeout(timeoutListener, 1000 * 60)

    return {
        user: user,
        username: username,
    }

}
