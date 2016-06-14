module.exports = (stream, callback) => {
    var text = ''
    stream.setEncoding('utf8')
    stream.on('data', chunk => {
        text += chunk
    })
    stream.on('end', () => {
        callback(text)
    })
}
