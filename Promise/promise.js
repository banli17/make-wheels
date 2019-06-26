function resolvePromise(promise2, x, resolve, reject) {
    // 循环引用
    if (promise2 === x) {
        return reject(new TypeError('循环引用'))
    }

    // 如果x是Promise或object，这里x可能是别人的promise
    if (typeof x === 'function' || (typeof x === 'object' && x !== null)) {
        let called;
        try {
            // 可能是别人 Object.defineProperty定义的then，可能取时报错
            let then = x.then
            // 是promise
            if (typeof then === 'function') {
                then.call(x, y => {
                    if (called) return
                    called = true
                    resolvePromise(promise2, y, resolve, reject)
                }, r => {
                    if (called) return
                    called = true
                    reject(r)
                })
            } else {
                // x是一个普通对象，上面没有then方法
                resolve(x)
            }
        } catch (e) {
            if (called) return
            called = true
            // 如果x.then报错
            reject(e)
        }
    } else {
        resolve(x)
    }
}


class Promise {
    constructor(executor) {
        this.status = 'pending'
        this.value = ''
        this.reason = ''
        this.resolveCallbacks = []
        this.rejectCallbacks = []

        try {
            executor(this.resolve.bind(this), this.reject.bind(this))
        } catch (e) {
            this.reject(e)
        }
    }

    resolve(value) {
        if (this.status !== 'pending') return
        this.status = 'fulfilled'
        this.value = value

        this.resolveCallbacks.forEach(callback => callback())
    }

    reject(reason) {
        if (this.status !== 'pending') return
        this.status = 'rejected'
        this.reason = reason

        this.rejectCallbacks.forEach(callback => callback())
    }

    // then 方法里的onfulfilled,onreject需要异步执行，为了保证then在同步代码之后 ，保证promise2存在。 
    // then返回一个新的promise
    // then里面发生错误，会走下面一个then的onrejected，需要try..catch..
    // then的返回值x决定下一个then的走向
    // - 是普通值包括undefined，走下一个onfulfilled(返回值)   
    // - 返回Promise
    then(onfulfilled, onrejected) {
        onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : v => v
        onrejected = typeof onrejected === 'function' ? onrejected : e => {
            throw e
        }
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === 'pending') {
                this.resolveCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onfulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    })
                })

                this.rejectCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onrejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    })
                })
            }
            if (this.status === 'fulfilled') {
                setTimeout(() => {
                    try {
                        let x = onfulfilled(this.value)
                        // new Promise创建对象时调用，但是promise2是创建的对象，所以还没有promise2
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }
            if (this.status === 'rejected') {
                setTimeout(() => {
                    try {
                        let x = onrejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }
        })
        return promise2
    }

    catch(callback) {
        return this.then(null, (reason) => {
            return callback(reason)
        })
    }

    // callback 需要执行，可能是异步。value,reason需要传下去
    finally(callback) {
        return this.then(value => {
            // callback(value)
            // return value
            return Promise.resolve(callback()).then(() => value)
        }, reason => {
            // callback(reason)
            // return reason
            return Promise.resolve(callback()).then(() => {
                throw reason
            })
        })
    }

    static resolve(value) {
        return new Promise((resolve, reject) => resolve(value))
    }

    static reject(reason) {
        return new Promise((resolve, reject) => reject(reason))
    }

    static race(args) {
        return new Promise((resolve, reject) => {
            args.forEach(arg => {
                if (typeof arg === 'function' || (typeof arg === 'object' && arg !== null)) {
                    let then = arg.then
                    if (typeof then === 'function') {
                        // 如果是promise，则执行，这里是用户写的promise
                        then.call(arg, resolve, reject)
                    } else {
                        resolve(arg)
                    }
                } else {
                    resolve(arg)
                }
            })
        })
    }

    static all(args) {
        return new Promise((resolve, reject) => {
            let results = []
            let i = 0
            let processData = (r, index) => {
                results[index] = r
                if (++i === args.length) {
                    resolve(results)
                }
            }
            args.forEach((arg, index) => {
                if (typeof arg === 'function' || (typeof arg === 'object') && arg !== null) {
                    let then = arg.then
                    if (typeof then === 'function') {
                        then.call(arg, y => {
                            processData(y, index)
                        }, reject)
                    } else {
                        processData(arg, index)
                    }
                } else {
                    processData(arg, index)
                }
            })
        })
    }

    // 用于将node中的api转为promise
    static promisify(fn) {
        return (...args) => {
            return new Promise((resolve, reject) => {
                fn(...args, (err, data) => {
                    if (err) {
                        return reject(err)
                    }
                    resolve(data)
                })
            })
        }
    }

}


Promise.deferred = () => {
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}

module.exports = Promise