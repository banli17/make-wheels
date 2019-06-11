const Promise = require('../promise')
let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('123')
    }, 1000)
})

p.then(() => {
    console.log('ok1')
    throw new Error('错误')
    return {}
}, () => {
    console.log('err1')
}).then((value) => {
    console.log('ok2', value)
}).catch(r => {
    console.log('catch', r)
})
// .then(() => {
//     console.log('reok')
// })
.finally(()=>{
    console.log('finally')
    setTimeout(()=>{
        console.log('1000 finally')
    },1000)
}).then(()=>{
    console.log('finally next ok')
})

Promise.resolve(123).then((val) => {
    console.log('resolve', val)
})
Promise.reject(456).then(null, (val) => {
    console.log('reject', val)
})

console.log(3)