# Promise

基本功能
1. Promise有三个状态 pending, fufilled, rejected，状态转换规则如下:
    - pending -> fufilled，调用resolve()
    - pending -> rejected，调用reject()
一旦状态改变，就不能再改变。

2. new Promise(executor)里的executor是同步执行的。then是异步执行的。异步执行实现采用发布订阅的模式。
