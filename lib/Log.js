var log = require('../config.js').log

module.exports = {
    error: text => {
        if (!log.error) return
        console.log((new Date).toISOString() + ' \x1b[31;1merror\x1b[m: ' + text)
    },
    http: text => {
        if (!log.http) return
        console.log((new Date).toISOString() + ' http: ' + text)
    },
    info: text => {
        if (!log.info) return
        console.log((new Date).toISOString() + ' info: ' + text)
    },
}
