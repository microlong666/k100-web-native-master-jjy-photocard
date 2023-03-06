const io = require('socket.io-client')
const socket = io('http://127.0.0.1:9090')
socket.emit('update-native-source')
