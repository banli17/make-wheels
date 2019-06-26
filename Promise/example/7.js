const Promise = require('../promise')
const p =Promise.resolve();
;(()=>{
    const implicit_promise = new Promise(resolve =>{
        // 此函数会立即执行
        // 一个promise resolve另一个promise
        const promise = new Promise(res=>res(p));
        promise.then(()=>{ // 这个promise 又多了then了一次
            console.log('after:await');
            resolve()
        })
    });
    return implicit_promise
})();
// 微任务的顺序
p.then(()=>{ // 默认这个promise是成功 所有执行成功的方法
    console.log('tick:a');
    return undefined
}).then(()=>{ // 马上继续then 但是这个then不会立即执行
    console.log('tick:b');
}).then(()=>{
    console.log('tick:c');
});