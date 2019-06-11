// 链式调用then
// then返回一个新的promise2
// 如果onrejected了，就无法再走成功了，因为status已经定了
const Promise = require('../promise')
let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('123')
   },3000)
})

p.then(() => {
    console.log('ok1')
    // throw new Error('错误')
    return {}
}, () => {
    console.log('err1')
}).then((value) => {
    console.log('ok2', value)
}, (e) => {
    console.log('err2',e)
})
console.log(3)