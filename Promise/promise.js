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

    then(onfulfilled, onrejected) {
        if (this.status === 'pending') {
            this.resolveCallbacks.push(() => onfulfilled(this.value))
            this.rejectCallbacks.push(() => onrejected(this.reason))
        }
        if (this.status === 'fulfilled') {
            onfulfilled(this.value)
        }
        if (this.status === 'rejected') {
            onrejected(this.reason)
        }
    }
}


module.exports = Promise