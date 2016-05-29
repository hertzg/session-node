module.exports = (user, timeoutListener) => {

    setTimeout(timeoutListener, 1000 * 60)

    return { user: user }

}
