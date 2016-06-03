var http = require('http'),
    url = require('url')

var config = require('./config.js'),
    Error404Page = require('./lib/Error404Page.js'),
    Log = require('./lib/Log.js')

var sessions = Object.create(null)
var users = Object.create(null)

var pages = Object.create(null)
pages['/'] = require('./lib/Page/Index.js')
pages['/addContact'] = require('./lib/Page/AddContact.js')(sessions)
pages['/changePassword'] = require('./lib/Page/ChangePassword.js')(sessions)
pages['/close'] = require('./lib/Page/Close.js')(sessions, users)
pages['/editContact'] = require('./lib/Page/EditContact.js')(sessions)
pages['/editProfile'] = require('./lib/Page/EditProfile.js')(sessions)
pages['/ignoreRequest'] = require('./lib/Page/IgnoreRequest.js')(sessions)
pages['/open'] = require('./lib/Page/Open.js')(sessions, users)
pages['/pullMessages'] = require('./lib/Page/PullMessages.js')(sessions)
pages['/receiveMessage'] = require('./lib/Page/ReceiveMessage.js')(users)
pages['/removeContact'] = require('./lib/Page/RemoveContact.js')(sessions)
pages['/removeRequest'] = require('./lib/Page/RemoveRequest.js')(sessions)

http.createServer((req, res) => {
    Log.http(req.method + ' ' + req.url)
    var parsedUrl = url.parse(req.url, true)
    var page = pages[parsedUrl.pathname]
    if (page === undefined) page = Error404Page
    page(req, res, parsedUrl)
}).listen(config.port, config.host)
