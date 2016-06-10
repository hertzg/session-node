var http = require('http'),
    url = require('url')

var config = require('./config.js'),
    Error404Page = require('./lib/Error404Page.js'),
    Log = require('./lib/Log.js')

var sessions = Object.create(null)
var users = Object.create(null)

var pages = Object.create(null)
pages['/'] = require('./lib/Page/Index.js')
pages['/accountNode/close'] = require('./lib/Page/AccountNode/Close.js')(sessions, users)
pages['/accountNode/open'] = require('./lib/Page/AccountNode/Open.js')(sessions, users)
pages['/accountNode/receiveMessage'] = require('./lib/Page/AccountNode/ReceiveMessage.js')(users)
pages['/frontNode/addContact'] = require('./lib/Page/FrontNode/AddContact.js')(sessions)
pages['/frontNode/changePassword'] = require('./lib/Page/FrontNode/ChangePassword.js')(sessions)
pages['/frontNode/editProfile'] = require('./lib/Page/FrontNode/EditProfile.js')(sessions)
pages['/frontNode/ignoreRequest'] = require('./lib/Page/FrontNode/IgnoreRequest.js')(sessions)
pages['/frontNode/overrideContactProfile'] = require('./lib/Page/FrontNode/OverrideContactProfile.js')(sessions)
pages['/frontNode/pullMessages'] = require('./lib/Page/FrontNode/PullMessages.js')(sessions)
pages['/frontNode/removeContact'] = require('./lib/Page/FrontNode/RemoveContact.js')(sessions)
pages['/frontNode/removeRequest'] = require('./lib/Page/FrontNode/RemoveRequest.js')(sessions)
pages['/frontNode/sendFileMessage'] = require('./lib/Page/FrontNode/SendFileMessage.js')(sessions)
pages['/frontNode/sendTextMessage'] = require('./lib/Page/FrontNode/SendTextMessage.js')(sessions)
pages['/frontNode/signOut'] = require('./lib/Page/FrontNode/SignOut.js')(sessions)

http.createServer((req, res) => {
    Log.http(req.method + ' ' + req.url)
    var parsedUrl = url.parse(req.url, true)
    var page = pages[parsedUrl.pathname]
    if (page === undefined) page = Error404Page
    page(req, res, parsedUrl)
}).listen(config.port, config.host)
