<template>
  <div class="debugger-container">
    <iframe ref="iframe" :src="WEB_ROOT" frameborder="0" scrolling="no"></iframe>
  </div>
</template>

<script>
import { WEB_ROOT } from '../config'
import DEV_PROTOCOL from '../config/page'
import io from 'socket.io-client'
import ComponentJSon from '../component/package.json'
export default {
  data () {
    return {
      WEB_ROOT,
      DEV_PROTOCOL
    }
  },
  computed: {
    webUrl () {
      return `${this.WEB_ROOT}/#/preview`
    }
  },
  mounted () {
    const iframe = this.$refs.iframe
    iframe.addEventListener('load', () => {
      iframe.contentWindow.postMessage({
        type: 'SetDebuggerEnvironment',
        __$$xtNativeDev: true
      }, '*')
      window.addEventListener('message', (event) => {
        if (event.data.type === 'getPreviewProtocol') {
          iframe.contentWindow.postMessage({
            type: 'setPreviewProtocol',
            protocol: this.DEV_PROTOCOL
          }, '*')
          socket.emit('update-native-source')
        }
      })
      const socket = io('http://127.0.0.1:9090', {
        // transports: ['websocket', 'polling', 'flashsocket']
      })
      // 接收服务端推送的信息
      socket.on('update-native-source', (res) => {
        console.log('执行一次成功', res)
        iframe.contentWindow.postMessage({
          type: 'updateNativeComponent',
          newCode: res,
          compName: ComponentJSon.name
          // compName: 'my-testctrl'
        }, '*')
        iframe.contentWindow.postMessage({
          type: 'setPreviewProtocol',
          protocol: this.DEV_PROTOCOL
        }, '*')
      })
      socket.on('connect', () => {
        console.log('socket client connect')
      })
    })
  }
}
</script>

<style lang="less" scoped>
.debugger-container > iframe {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
