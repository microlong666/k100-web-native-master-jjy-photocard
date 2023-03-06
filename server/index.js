const compile = require('./compile')
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

app.get('/build', function (req, res) {
  try {
    compile().then(function (result) {
      res.send(result)
    }, function (err) {
      res.status(400).send(JSON.stringify(err))
    })
  } catch (err) {
    res.status(500).send(JSON.stringify(err))
  }
})

setTimeout(() => {
  app.listen(9090, function () {
    console.log(`build server is running at 9090`)
  })
})
