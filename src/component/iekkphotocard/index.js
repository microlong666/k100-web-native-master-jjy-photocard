import XtWeb from 'xtion-web'
import IekkPhotoCard from './IekkPhotoCard.vue'

export default {
  name: 'iekkphotocard',
  mixins: [XtWeb.Engine.UI.View],
  data () {
    return {
      value: {
        id: '',
        ksvid: ''
        // photolist: [
        //   { 'name': '门店签到', 'photo': '{"datetime":"1654072314276","watermark":"","source":"288f5f84-1817-4a0b-b917-b356ee14156e.jpg","storage":"storage"}' },
        //   { 'name': '门店签退', 'photo': '{"datetime":"1654072322733","watermark":"","source":"d4ace815-71eb-4ea4-aa26-6f66e77650ad.jpg","storage":"storage"}' }
        // ]
      }
    }
  },
  created () {
    // 执行绑定事件
    // this.executeEvent('getphotoset', {}, {}, res => {
    //   this.value = res.outparam
    // })
  },
  methods: {
    getView () {
      return this.value
    },
    setView (data) {
      console.log('setView', data)
      if (data != null && data !== '') {
        this.value = JSON.parse(data)
      }
    }
  },
  render (h) {
    return h(IekkPhotoCard, {
      props: {
        value: this.value
      }
    })
  }
}
