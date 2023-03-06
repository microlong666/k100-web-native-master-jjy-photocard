const express = require('express')
const app = express()
// const ws = require('ws')
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  // wsEngine: 'ws',
  // serveClient: false,
  // pingTimeout: 60000,
  // pingInterval: 25000,
  // upgradeTimeout: 10000,
  // maxHttpBufferSize: 100000000,
  // allowUpgrades: true,
  // transports: 'websocket'
})
const Task = require('./task')
const cors = require('cors')

const task = new Task()

app.use(cors())

let initialSource = ''
task.compile(function (source) {
  initialSource = source
})

io.on('connection', function (socket) {
  let lastSource = ''
  task.watch()
  task.onWatch((err, source) => {
    // console.log('-----------------------------------watch start', source)
    if (err) {
      console.log('err:::::::::::::: => ', err)
      return
    }
    console.log('watch:::::: => success')
    lastSource = source
    initialSource = source
    io.emit('update-native-source', source) // 向所有客户端发送信息
  })

  socket.on('update-native-source', () => {
    console.log('=====================================', lastSource)
    io.emit('update-native-source', lastSource || initialSource)
  })
  // socket.on("监听频道", msg => {  // 监听的频道必须和客户端监听的频道相同，等待消息
  //   io.emit("监听频道", "发送的信息");  // 向所有客户端发送信息
  // });
  // 客户端断开连接
  io.on('disconnect', function () {
    console.log(`build server has stop`)
  })
})

http.listen(9090, function () {
  console.log(`build server is running at 9090`)
})
