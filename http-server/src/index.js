const http = require('http')
const fs = require('fs')
const fsPromise = fs.promises
const path = require('path')
const url = require('url')
const crypto = require('crypto')
const mime = require('mime')
const ejs = require('ejs')
const chalk = require('chalk')
const opener = require('opener')

const template = fs.readFileSync(path.resolve(__dirname, 'template.ejs'), 'utf8')

class Server {
    constructor(config) {
        this.path = config.args[0] || './'
        this.port = config.port || 8000
        this.open = config.open 
    }

    async handlerRequest(req, res) {
        const {
            pathname
        } = url.parse(req.url)

        // 这个是页面内的资源缓存，如果打开资源的url，则会重新发送请求
        res.setHeader('Expires', new Date(Date.now() + 60 * 60 * 24 * 1000).toGMTString())
        res.setHeader('Cache-Control', 'max-age=1000');

        try {
            const filepath = path.join(this.path, pathname)
            let stat = await fsPromise.stat(filepath)
            if (stat.isDirectory()) {
                let dirs = await fsPromise.readdir(filepath)
                dirs = dirs.map(filename => {
                    return {
                        title: filename,
                        href: path.join(pathname, filename) // 注意这里
                    }
                })
                let html = ejs.render(template, {
                    dirs
                })
                res.statusCode = 200
                res.end(html)
            } else {
                let ctime = stat.ctime.toGMTString()

                // 小文件可以用这种方式，大文件用文件大小 stat.size 代替
                const tag = crypto.createHash('md5').update(fs.readFileSync(filepath)).digest('base64')
                if (req.headers['if-modified-since'] >= ctime || req.headers['if-none-match'] === tag) {
                    res.statusCode = 304
                    return res.end()
                }
                res.statusCode = 200

                res.setHeader('Etag', tag)
                res.setHeader('Last-Modified', ctime)
                res.setHeader('Content-Type', `text/plain;charset=utf8`)
                fs.createReadStream(filepath).pipe(res)
            }
        } catch (e) {
            console.log(`${e}`)
            this.sendError(e, res)
        }
    }

    sendError(e, res) {
        res.statusCode = 404
        res.end(`Not Found`)
    }

    // 开启一个 http 服务
    start() {
        const server = http.createServer(this.handlerRequest.bind(this))
        const domain = `http://127.0.0.1`

        server.listen(this.port, () => {
            console.log([
                `${chalk.yellow('Starting up http-server, serving ')}${chalk.cyan(this.path)}`,
                `${chalk.yellow('Available on:')}`,
                `  ${domain}:${chalk.green(this.port)}`,
                'Hit CTRL-C to stop the server'
            ].join('\n'))

            if (this.open) {
                opener(`${domain}:${this.port}`)
            }
        })
    }
}

module.exports = Server