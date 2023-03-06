/*
 * @Author: 卢丽莎
 * @Email: lulisha@wxchina.com
 * @Date: 2022-05-26 10:20:52
 * @Last Modified by: 张伟龙
 * @Last Modified time: 2023-03-06 14:26:32
 * @Description: 家家宜门店拜访照片集
 */
<template>
  <div class="xt-photo-card">
    <div id="viewer" class="photo-container">
      <div v-for="item in photoList" :key="item.photo" class="photo">
        <div
          v-if="item.isfake === '1' || item.issame === '1'"
          :class="
            item.isfake === '1'
              ? item.issame === '1'
                ? 'flag both'
                : 'flag fake'
              : item.issame === '1'
              ? 'flag same'
              : 'flag'
          "
          @click="showPhotoSetDialog(item)"
        >
          <div class="description">
            疑似<br />{{ item.isfake === "1" ? "翻拍" : "重复" }}
          </div>
        </div>
        <img :src="item.photo" :alt="item.name" />
        <div class="type">{{ item.name }}</div>
      </div>
    </div>

    <div v-if="timeoutPhotoList.length > 0">
      <div
        style="font-size: 14px; font-weight: bold; color: rgba(0, 0, 0, 0.65)"
        class="photo-container"
      >
        超时说明：{{ timeoutDesc }}
      </div>
      <div id="viewer" class="photo-container">
        <div v-for="item in timeoutPhotoList" :key="item.photo" class="photo">
          <div
            v-if="item.isfake === '1' || item.issame === '1'"
            :class="
              item.isfake === '1'
                ? item.issame === '1'
                  ? 'flag both'
                  : 'flag fake'
                : item.issame === '1'
                ? 'flag same'
                : 'flag'
            "
            @click="showPhotoSetDialog(item)"
          >
            <div class="description">
              疑似<br />{{ item.isfake === "1" ? "翻拍" : "重复" }}
            </div>
          </div>
          <img :src="item.photo" :alt="item.name" />
          <div class="type">
            <span style="visibility: hidden">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 暂无数据 -->
    <div v-if="photoList.length === 0" class="empty">
      <img src="./static/empty.png" alt="" />
      <div class="text">暂无数据</div>
    </div>
    <!-- 重复照片集dialog -->
    <el-dialog
      title="疑似重复照片集"
      :modal="false"
      :visible.sync="isShowPhotoSet"
      :before-close="closePhotoSetDialog"
    >
      <div class="dialog-container">
        <h5>原图</h5>
        <div class="target-photo">
          <img :src="targetPhoto" />
        </div>
        <h5>疑似相似图片</h5>
        <div id="photoSet" class="same-photo-list">
          <div
            v-for="(item, index) in samePhotoList"
            :key="index"
            class="same-photo-item"
          >
            <img :src="item.photo" />
            <div class="info-card">
              <div>日期：{{ item.date }}</div>
              <div>门店：{{ item.storename }}</div>
              <div>照片类型：{{ item.name }}</div>
              <div>相似度：{{ item.score }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import XtWeb from 'xtion-web'
import { getImageUrl } from './util.js'
import './viewerjs/viewer.css'
import IEKKViewer from './viewerjs/viewer.js'
import { post } from './http'
export default {
  mixins: [XtWeb.Engine.UI.View],
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          id: '', // 门店id
          ksvid: '' // 拜访明细id
        }
      }
    }
  },
  data () {
    return {
      options: {
        zIndex: 99999,
        inline: false,
        button: true,
        title: false,
        navbar: false,
        tooltip: true,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: false,
        transition: true,
        fullscreen: true,
        keyboard: true,
        toolbar: {
          zoomIn: true,
          zoomOut: true,
          oneToOne: true,
          reset: true,
          prev: true,
          next: true,
          rotateLeft: true,
          rotateRight: true
        }
      },
      isShowPhotoSet: false,
      targetPhoto: '',
      samePhotoSet: [],
      viewer: null,
      photoSetViewer: null,
      hasTimeout: false,
      timeoutDesc: '',
      photoList: [],
      timeoutPhotoList: [],
      samePhotoList: []
    }
  },
  watch: {
    value () {
      this.getPhotoSet()
    }
  },
  mounted () {
    // this.getPhotoSet();
  },
  methods: {
    // 查看疑似重复/翻拍照片集对话框
    showPhotoSetDialog (data) {
      if (data.issame === '1') {
        this.isShowPhotoSet = true
        this.targetPhoto = data.photo
        if (data.imagecode) {
          this.getSamePhotoSet(data.imagecode)
        }
      }
    },
    // 关闭疑似重复/翻拍照片集对话框
    closePhotoSetDialog () {
      this.isShowPhotoSet = false
      this.targetPhoto = ''
      this.samePhotoSet = []
    },
    // 获取照片
    async getPhotoSet () {
      this.photoList = []
      let json = {
        kx_kq_store: this.value
      }
      const res = await post(
        this,
        '/api/teapi/dy-biz/893405830819483679/1539056393896726627',
        json
      )
      let photoSet = res.outparam
      photoSet.forEach((item) => {
        if (item.name === '超时举证') {
          this.hasTimeout = true
          this.timeoutDesc = res.outparam_timeout.timeoutdesc
        }
        item.photo = getImageUrl(item.photo)
      })
      // 超时举证照片划分
      if (!this.hasTimeout) {
        this.photoList = photoSet
      } else {
        // 抓出超时和签退
        this.timeoutPhotoList = photoSet.filter((item) => {
          return item.name === '超时举证'
        })
        let signOutPhoto = photoSet.pop()
        this.photoList = photoSet.filter((item) => {
          return item.name !== '超时举证'
        })
        this.timeoutPhotoList.push(signOutPhoto)
      }
      this.$nextTick(function () {
        if (this.viewer) {
          this.viewer.destroy()
        }
        this.viewer = new IEKKViewer(
          document.getElementById('viewer'),
          this.options
        )
        // this.observerhandle(document.querySelectorAll('.photo img'))
        console.log('$nexttick', this.viewer)
      })
      console.log('getPhotoSet', this.photoList)
    },
    // 获取相似照片集
    async getSamePhotoSet (imageCode) {
      this.samePhotoList = []
      let json = {
        tn_ai_similarity_result: {
          imagecode: imageCode
        }
      }
      const res = await post(
        this,
        '/api/teapi/dy-biz/893405830819483679/1539056393896726625',
        json
      )
      let samePhotoSet = res.outparam
      samePhotoSet.forEach((item) => {
        item.photo = getImageUrl(item.photo)
      })
      this.samePhotoList = samePhotoSet
      this.$nextTick(function () {
        if (this.photoSetViewer) {
          this.photoSetViewer.destroy()
        }
        this.photoSetViewer = new IEKKViewer(
          document.getElementById('photoSet'),
          this.options
        )
        console.log('$nexttick', this.photoSetViewer)
      })
      console.log('getSamePhotoSet', this.samePhotoList)
    }
    // 图片懒加载  "intersection-observer": "^0.12.2"
    // observerhandle (els, callback) {
    //   let observer = new IntersectionObserver(entries => {
    //     entries.forEach((item) => {
    //       console.log(item.intersectionRatio)
    //       if (item.intersectionRatio >= 0.01) {
    //         let img = item.target
    //         let trueSrc = img.getAttribute('data-src')
    //         img.setAttribute('src', trueSrc)
    //         observer.unobserve(img)
    //         callback && callback()
    //       }
    //     })
    //   }, {
    //     threshold: [0.01] // 展示面积为50%触发
    //   })
    //   observer.POLL_INTERVAL = 50 // 节流时间为50毫秒
    //   Array.from(els).forEach(el => {
    //     observer.observe(el)
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
.xt-photo-card {
  height: 100%;
  position: relative;
  .photo-container {
    display: flex;
    flex-wrap: wrap;
    width: 1240px;
    margin: 10px auto;
    .photo {
      margin-bottom: 10px;
      margin-right: 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      &:nth-child(3n) {
        margin-right: 0;
      }
      .flag {
        position: absolute;
        right: -100px;
        top: -100px;
        border: 100px solid;
        // height: 200px;
        text-align: center;
        border-radius: 50%;
        &.same {
          border-color: rgba(47, 108, 226, 0.7);
          cursor: pointer;
        }
        &.fake {
          border-color: rgba(255, 73, 73, 0.7);
          cursor: default;
        }
        &.both {
          border-left-color: rgba(255, 73, 73, 0.7);
          border-bottom-color: rgba(47, 108, 226, 0.7);
          cursor: pointer;
        }
        .description {
          position: absolute;
          top: 15px;
          left: -60px;
          color: #fff;
          font-weight: 700;
          font-size: 18px;
        }
      }
      img {
        width: 400px;
        height: 500px;
        cursor: pointer;
      }
      .type {
        padding: 10px 0;
        text-align: center;
        font-size: 14px;
        font-weight: 700;
      }
    }
  }
  .empty {
    text-align: center;
    margin-top: 50px;
    .text {
      color: #5e7382;
      margin-top: 10px;
    }
  }
  /deep/ .el-dialog {
    z-index: 9999;
    width: 100%;
    bottom: 0 !important;
    top: 0 !important;
    margin-bottom: 0 !important;
    overflow: hidden;

    .el-dialog__header {
      padding: 8px 20px !important;
    }

    .el-dialog__body {
      height: 100%;
      overflow: auto;
      padding-top: 10px !important;
      padding-bottom: 5% !important;
    }
    .dialog-container {
      .same-photo-list {
        display: flex;
        flex-wrap: wrap;
        .same-photo-item {
          margin-right: 10px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          img {
            cursor: pointer;
          }
          .info-card {
            padding: 5px 10px;
          }
        }
      }
    }
    img {
      width: 400px;
      height: 500px;
    }
  }
}
</style>
