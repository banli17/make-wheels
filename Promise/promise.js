class Promise {
    constructor(executor) {
        this.status = 'pending'
        this.value = ''
        this.reason = ''

        executor(this.resolve.bind(this), this.reject.bind(this))
    }

    resolve(value) {
        if (this.status !== 'pending') return
        this.status = 'fulfilled'
        this.value = value
    }

    reject(reason) {
        if (this.status !== 'pending') return
        this.status = 'rejected'
        this.reason = reason
    }

    then(onfulfilled, onrejected) {
        if (this.status === 'fulfilled') {
            onfulfilled(this.value)
        }
        if (this.status === 'rejected') {
            onrejected(this.reason)
        }
    }
}


module.exports = Promise