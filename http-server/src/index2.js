
let http = require('http');
let fs = require('mz/fs');
let url = require('url');
let path = require('path');
let mime = require('mime');
let server = http.createServer(async (req,res)=>{
    let {pathname} = url.parse(req.url);
    let filePath = path.join(__dirname,pathname);
    // 静态的
    // 设置文件 强制走缓存
    // 10s内不要来找我了  缓存的目标是引用的文件，引用的文件会被缓存起来
    res.setHeader('Cache-Control','max-age=100000');
    // res.setHeader('Cache-Control','no-cache');
    res.setHeader('Expires', new Date(Date.now() + 10000).toGMTString());

    // 对比缓存 304  last-modified  服务端 if-modified-since 客户端
    // 缺陷就是 修改时间变了 ，但是可能文件并没有发生变化
    // 频繁的改动可能无法监控到， cdn 部署的时候 也会出现一些问题

    // 用etag 指纹 md5
    console.log(req.url);
    try{
        let statObj = await fs.stat(filePath);
        if(statObj.isDirectory()){
            // 如果是目录 就找index.html ，找到后返回
            filePath = path.join(filePath,'index.html');
            await fs.access(filePath);
        }
        let ctime = statObj.ctime.toGMTString()
        res.setHeader('Last-Modified',ctime);

        if(req.headers['if-modified-since'] === ctime){
            res.statusCode = 304;
            return res.end();
        }

        res.setHeader('Content-Type',mime.getType(filePath)+';charset=utf8');



        fs.createReadStream(filePath).pipe(res);
    }catch(e){// 只要出错就返回404
        res.statusCode = 404;
        res.end('Not Found');
    }
});
server.listen(3003);

