module.exports = sessions => {
    return (req, res, parsedUrl) => {

        res.setHeader('Content-Type', 'application/json')

        var query = parsedUrl.query

        var session = sessions[query.token]
        if (session === undefined) {
            res.end('"INVALID_TOKEN"')
            return
        }

        var fileToken = query.fileToken
        if (fileToken === undefined) {
            res.end('"INVALID_FILE_TOKEN"')
            return
        }

        session.pushMessage(['requestFile', fileToken])
        res.end('true')

    }
}
