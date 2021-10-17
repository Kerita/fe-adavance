import MPromise from './MPromise.js'

const promise = new MPromise((resolve, reject) => {
	setTimeout(() => {
		resolve({
			code: 0,
			data: 'test',
			msg: 'success'
		})
	}, 1000)
})

promise.then((value) => {
	console.log('kerita log:', value, 'value')
}).then((value) => {
	console.log('kerita log:', value, 'value')
}, (reason) => {
	console.log('kerita log:', reason, 'reason')
})