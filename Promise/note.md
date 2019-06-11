# Promise

1. 实现同步版Promise
2. then是异步的，且能链式调用: 使用发布订阅模式

## 功能

- 完成符合promises-aplus-tests的Promise版本。

使用`promises-aplus-tests`测试。

```
npx promises-aplus-tests promise.js 
```

- 添加 race/all/catch/finally/resolve/reject。
- 添加 promisify 功能，将 node api 转成 promise。