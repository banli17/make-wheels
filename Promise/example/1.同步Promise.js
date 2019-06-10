const Promise = require('../promise')

new Promise((resolve, reject) => {
    console.log('promise')
    resolve('成功')
    reject('错误')
}).then((value) => {
    console.log('成功了', value)
}, (reason) => {
    console.log('错误了', reason)
})