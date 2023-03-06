const Task = require('./task')

const task = new Task()
task.compile((source) => {
  task.watch()
  task.onWatch((err, source) => {
    if (err) {
      console.log('err:::::::::::::: => ', err)
      return
    }
    console.log('source:::::: => ')
  })
})
