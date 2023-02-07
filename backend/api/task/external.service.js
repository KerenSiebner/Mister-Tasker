function execute(task) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            if (Math.random() > 0.5) res(parseInt(Math.random() * 100))
            else reject('High Temperature')
        }, 5000)
    })
}
module.exports = {
    execute
}