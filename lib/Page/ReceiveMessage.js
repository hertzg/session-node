module.exports = users => {
    return (req, res, parsedUrl) => {
        var requestText = ''
        req.setEncoding('utf8')
        req.on('data', chunk => {
            requestText += chunk
        })
        req.on('end', () => {

            res.setHeader('Content-Type', 'application/json')

            var query = parsedUrl.query

            var user = users[query.username]
            if (user === undefined) {
                res.end('"INVALID_USERNAME"')
                return
            }

            try {
                var requestObject = JSON.parse(requestText)
            } catch (e) {
                res.end('"BAD_REQUEST"')
                return
            }

            user.pushMessage(requestObject, query.token)

        })
    }
}
