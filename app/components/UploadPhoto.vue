<template>
<div v-if="uploaderSign">
  <div class="avatar-uploader-video">
    <input @change="fileChange" accept="file/ai" ref="file" type="file" v-show="false">
    <div @click="$refs.file.click()" class="upload-graph">
      <div class="el-upload__text">点击上传ai文件</div>
    </div>
    <img :src="img" v-if="img.length">
  </div>
</div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

  data () {
    return {
      uploaderSign: true,
      uploaderData: {},
      imageUploadCount: 0,
      img: ''
    }
  },

  methods: {
    //上传
    async fileChange (e: any) {
    // @ts-ignore
      this.request.post('/cgi/graph/token')
        .then((response: any) => {
          const uploaderSign = response.data.body || {}
          const type = e.target.value.split('.').pop().toLowerCase()
          const param = new FormData()
          param.append('OSSAccessKeyId', uploaderSign['accessid'])
          param.append('policy', uploaderSign['policy'])
          param.append('Signature', uploaderSign['signature'])
          param.append('key', uploaderSign['dir'] + '.' + type)
          param.append('success_action_status', '200')
          param.append('file', (this.$refs['file'] as any).files[0])

          const config = {
            //添加请求头
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            //添加上传进度监听事件
            onUploadProgress: (e: any) => {
              let completeProgress = ((e.loaded / e.total * 100) | 0) + '%'
            }
          }
          // @ts-ignore
          this.request.post(uploaderSign.host, param, config).then(
            () => {
              // console.log('response', response)
              const graph = {
                source: param.get('key'),
                graphId: uploaderSign.graphId
              }
              this.$emit('finish', graph)
              this.uploaderSign = false
              // this.img = 'http://printer.oss.mm-it.cn/' + param.get('key')
              // console.log('img', this.img)
            }).catch((error: any) => {
            console.log(error)
          })

        })
        .catch((error: any) => {
          console.log(error)
        })

    }
  },

})
</script>


<style lang="scss">

.video-name {
  height: 40px;
  line-height: 40px;
}

.avatar-uploader-video {

  .el-upload__change {
    text-align: center;
    width: 100px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    border: 1px solid #b3d8ff;
    border-radius: 2px;
    cursor: pointer;
    color: #409eff;
    background: #ecf5ff;

    &:hover {
      background: #409eff;
      border: 1px solid #409eff;
      color: #fff;
    }

  }

  .el-upload-tip-change {
    text-align: center;
    color: #999;
    font-size: 11px;
    line-height: 20px;
  }

  .upload-graph {
    margin: 0 auto;
    box-sizing: border-box;
    text-align: center;
    position: relative;
    overflow: hidden;
    border-radius: 2px;
    cursor: pointer;
    width: 110px;
    height: 40px;
    line-height: 40px;
  }
}


</style>
