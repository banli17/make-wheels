# 写一个 http-server 静态服务

[http-server](https://github.com/indexzero/http-server) 是一个命令行http服务器。它的用法是：

```
http server [path] [options]
```

- `path`: 默认情况下是`./public`，如果不存在则是`./`。默认是开启缓存的，可以使用参数`-c-1`禁用缓存。
- `options`: 
    - `-p | --port`: 端口，默认是 8080
    - `-a`: 使用的地址，默认是`0.0.0.0`
    - `-d`: 显示目录列表，默认是 true
    - `-e | -ext`: 默认文件扩展名，默认是`html`
    - `--cors`: 允许 CORS ，如 Access-Control-Allow-Origin 头
    - `-o [path]`: 服务运行后自动打开浏览器，可以提供一个路径如 -o /other/dir/
    - `-P | --proxy`: 代理所有请求到给定的url，`http-server --proxy http://localhost:8080?`注意后面的?
    - `-S | --ssl`: 允许 https
    - `-C | --cert`: ssl证书，默认是 cert.pem
    - `-K | --key`：ssl密钥，默认是key.pem

## 用到的库

- `chalk`: 控制台打印有颜色的文本
- `opener`: 打开默认浏览器
- `ejs`: 展示列表模版
- `mime`: 获取资源的 mime 类型

## 功能

- 静态资源的缓存

## npm link

npm link 会在 node bin 下新建一个命令 指向 node bin node_modules http-server/bin/http-server
这个再指向 本目录

/Users/banli/.nvm/versions/node/v12.3.1/bin/bl-http-server -> /Users/banli/.nvm/versions/node/v12.3.1/lib/node_modules/http-server/bin/http-server
/Users/banli/.nvm/versions/node/v12.3.1/lib/node_modules/http-server -> /Users/banli/Desktop/training/make-wheels/http-server
