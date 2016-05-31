var http = require('http'),
    url = require('url')

var config = require('./config.js'),
    Error404Page = require('./lib/Error404Page.js'),
    Log = require('./lib/Log.js')

var sessions = Object.create(null)
var users = Object.create(null)

var pages = Object.create(null)
pages['/'] = require('./lib/IndexPage.js')
pages['/addContact'] = require('./lib/AddContactPage.js')(sessions)
pages['/changePassword'] = require('./lib/ChangePasswordPage.js')(sessions)
pages['/close'] = require('./lib/ClosePage.js')(sessions, users)
pages['/editContact'] = require('./lib/EditContactPage.js')(sessions)
pages['/editProfile'] = require('./lib/EditProfilePage.js')(sessions)
pages['/open'] = require('./lib/OpenPage.js')(sessions, users)
pages['/removeContact'] = require('./lib/RemoveContactPage.js')(sessions)

http.createServer((req, res) => {
    Log.http(req.method + ' ' + req.url)
    var parsedUrl = url.parse(req.url, true)
    var page = pages[parsedUrl.pathname]
    if (page === undefined) page = Error404Page
    page(req, res, parsedUrl)
}).listen(config.port, config.host)
