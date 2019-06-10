const Promise = require('../promise')

let p = new Promise((resolve, reject) => {
    throw new Error('hello')
    setTimeout(() => {
        resolve(123)
    }, 2000)
})


p.then((value) => {
    console.log(value)
}, reason => {
    console.log(reason)
})