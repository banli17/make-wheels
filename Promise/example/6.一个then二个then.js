const Promise = require('../promise')
const p1 = Promise.resolve()
const p2 = Promise.resolve()

// setTimeout(() => {
//     console.log('setTimeout')
// }, 0)

p1.then(() => {
    console.log('p1 1')
}).then(() => {
    console.log('p1 2')
})

// then本来是微任务
// 链式调用相当于，第二轮的then会等第一次then执行后再放入微任务
new Promise(()=>{
    setTimeout(()=>{
        console.log('p1 1')
        setTimeout(()=>{
            console.log('p1 2')
        })
    })
})

p2.then(() => {
    console.log('p2 1')
}).then(() => {
    console.log('p2 2')
})

