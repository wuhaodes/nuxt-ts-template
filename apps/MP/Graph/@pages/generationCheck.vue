<template>
  <div class="generation_check">
    <div class="QR_id">
      <!--      <p>{{QRForm.QRId}}</p>-->
      <!--      <el-input v-model="QRForm.QRId" placeholder="请输入内容" size="large"></el-input>-->
      <el-input @keyup.enter.native="checkCode" class="input-with-select fr" clearable placeholder="二维码校验值"
                size="medium" style="width: 400px;height: 26px;" v-model="value">
        <el-button @click="checkCode" slot="append">校验</el-button>
      </el-input>
    </div>

    <div class="QR_type" v-if="isCheckSuccess">
      <img alt="" src="../../../../app/assets/image/checkSuccess.png" style="width: 174px;margin-bottom: 10px;">
      <p class="check">校验成功</p>
      <div class="QR_info">
        <p class="info_title">模板名称：<span>{{QRForm.name}}</span></p>
        <p class="info_title">模板分类：<span class="">{{QRForm.type}}</span></p>
        <p class="info_title">生成者：<span>{{QRForm.createName}}</span></p>
        <p class="info_title">生成时间：<span>{{QRForm.createTime | dateFormat}}</span></p>
      </div>
    </div>

    <div class="QR_type" v-if="isCheckError">
      <img alt="" src="../../../../app/assets/image/hasBeenChecked.png" style="width: 174px;margin-bottom: 10px;">
      <p class="close">校验失败，出现重复码</p>
      <div class="QR_info">
        <p class="info_title">模板名称：<span>{{QRForm.name}}</span></p>
        <p class="info_title">模板分类：<span class="">{{QRForm.type}}</span></p>
        <p class="info_title">生成者：<span>{{QRForm.createName}}</span></p>
        <p class="info_title">生成时间：<span>{{QRForm.createTime | dateFormat}}</span></p>
        <p class="info_title">首次扫码时间：<span>{{QRForm.checkAt | dateFormat}}</span></p>
      </div>
    </div>

    <div class="QR_type" v-if="isValueNotFound">
      <img alt="" src="../../../../app/assets/image/valueNotFound.png" style="width: 174px;margin-bottom: 10px;">
      <p class="close">校验失败，识别错误码</p>
    </div>

    <!--    <div class="QR_info">-->
    <!--      <p class="info_title">模板名称：<span>{{QRForm.name}}</span></p>-->
    <!--      <p class="info_title">模板分类：<span class="">{{QRForm.type}}</span></p>-->
    <!--      <p class="info_title">生成者：<span>{{QRForm.createName}}</span></p>-->
    <!--      <p class="info_title">生成时间：<span>{{QRForm.createTime | dateFormat}}</span></p>-->
    <!--    </div>-->

    <!--    hidden-->
    <!--    <audio controls="controls" ref="audio" >-->
    <!--      <source :src="require('@/assets/audio/iphone.mp3')" type="audio/mpeg" @error="isError">-->
    <!--    </audio>-->

    <!-- <audio controls="controls"  ref="audio" src="http://up_mp4.t57.cn/2018/1/03m/13/396131232171.m4a"></audio>-->
    <!--    <el-button @click="bofang">-&#45;&#45;</el-button>-->

  </div>
</template>


<script lang="ts">
  import uCgi from '~/app/@biz/uCgi'
  import uHelper from '~/app/@biz/uHelper'
  import Vue from 'vue'


  export default Vue.extend({
    layout: 'default_detail',

    data () {
      return {
        isCheckSuccess: false,
        isCheckError: false,
        isValueNotFound: false,
        value: '',

        QRForm: {
          name: '',
          type: '',
          createName: '',
          createTime: 0,
          checkAt: 0
        }
      }
    },
    filters: {
      dateFormat: (value:string) => {
        return uHelper.dateFormat(value, 'YYYY-MM-DD HH:mm:ss')
      }
    },

    methods: {
      async checkCode () {
        if (this.value === '') {
          this.isCheckSuccess = false
          this.isCheckError = false
          this.isValueNotFound = false
          return
        }
        const result = await uCgi.GraphCheck({ value: this.value })
        // console.log('GraphCheck',result)
        if (result.code === 200 && result.body.result === 'CheckSuccess') {
          this.isCheckSuccess = true
          this.isCheckError = false
          this.isValueNotFound = false
          this.QRForm.name = result.body.graphPage ? result.body.graphPage.graph.name : ''
          this.QRForm.type = result.body.graphPage ? result.body.graphPage.rule.name : ''
          this.QRForm.createName = result.body.graphPage ? result.body.graphPage.operator.name : ''
          this.QRForm.createTime = result.body.graphCheck ? result.body.graphCheck.checkAt : 0     //校验时间----需要修改（打印时间）

          // this.$refs.audio.currentTime = 0 //从头开始播放提示音
          // this.$refs.audio.play() //播放
        }
        if (result.code === 200 && result.body.result === 'HasBeenChecked') {
          this.isCheckError = true
          this.isCheckSuccess = false
          this.isValueNotFound = false
          this.QRForm.name = result.body.graphPage ? result.body.graphPage.graph.name : ''
          this.QRForm.type = result.body.graphPage ? result.body.graphPage.rule.name : ''
          this.QRForm.createName = result.body.graphPage ? result.body.graphPage.operator.name : ''
          this.QRForm.createTime = result.body.graphCheck ? result.body.graphCheck.checkAt : 0      //校验时间----需要修改（打印时间）
          this.QRForm.checkAt = result.body.graphCheck ? result.body.graphCheck.checkAt : 0
        }
        if (result.code === 200 && result.body.result === 'ValueNotFound') {
          this.isCheckError = false
          this.isCheckSuccess = false
          this.isValueNotFound = true

          // console.log('this.$refs.audio', this.$refs.audio)
          // // this.$refs.audio.currentTime = 0; //从头开始播放提示音
          // this.$refs.audio.play() //播放
        }
      },

      // bofang () {
      //   console.log('this.$refs.audio', this.$refs.audio)
      //   this.$refs.audio.play()
      // },
      //
      // isError(e){
      //   console.log('isError', e)
      // }
    }
  })
</script>

<style lang="scss">
  .generation_check {
    padding: 60px 440px;

    .QR_id {
      margin: 0 auto 40px;
      width: 400px;

      .el-input__inner {
        height: 48px;
        text-align: center;
        background-color: #FAFAFA;
        border-radius: 2px 0 0 2px;
      }

      .el-input-group__append, .el-input-group__prepend {
        border-radius: 0 2px 2px 0;
      }
    }

    .QR_type {
      min-width: 400px;
      padding: 40px 0;
      text-align: center;

      .el-icon-circle-check {
        font-size: 200px;
        margin-bottom: 16px;
        color: #6DD401;
      }

      .check {
        font-size: 16px;
        color: #6DD401;
      }

      .el-icon-circle-close {
        font-size: 200px;
        margin-bottom: 16px;
        color: #F84F51;
      }

      .close {
        font-size: 16px;
        color: #F84F51;
      }

      .QR_info {
        /*background-color: #b3d8ff;*/
        /*padding-left: 20px;*/
        min-width: 400px;
        width: 250px;
        text-align: left;
        padding-left: 120px;
        margin: 40px auto;

        .info_title {
          height: 16px;
          font-size: 14px;
          font-weight: 600;
          color: rgba(51, 51, 51, 1);
          line-height: 16px;
          margin-bottom: 24px;

          span {
            font-weight: 400;
          }
        }
      }

    }

  }
</style>
