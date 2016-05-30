var http = require('http'),
    url = require('url')

var config = require('./config.js'),
    Error404Page = require('./lib/Error404Page.js')

var sessions = Object.create(null)
var users = Object.create(null)

var pages = Object.create(null)
pages['/'] = require('./lib/IndexPage.js')
pages['/changePassword'] = require('./lib/ChangePasswordPage.js')(sessions)
pages['/editProfile'] = require('./lib/EditProfilePage.js')(sessions)
pages['/open'] = require('./lib/OpenPage.js')(sessions, users)

http.createServer((req, res) => {
    var parsedUrl = url.parse(req.url, true)
    var page = pages[parsedUrl.pathname]
    if (page === undefined) page = Error404Page
    page(req, res, parsedUrl)
}).listen(config.port, config.host)
