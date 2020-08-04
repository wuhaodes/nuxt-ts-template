<template>
<div class="QR_code">
  <div  v-if="qrType === 'qr' ">
    <div :style="`width:${logoInfo.width}%;height:${logoInfo.width}%;background-image:url(${oss2image(logoInfo.path,'ci0')})`" class="qr-logo" v-if="logoInfo && logoInfo.path"></div>
    <svg class="QR_img" shape-rendering="crispEdges" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
      <path :stroke="color"
            d="M0 0.5h7m1 0h5m1 0h7M0 1.5h1m5 0h1m2 0h1m1 0h1m2 0h1m5 0h1M0 2.5h1m1 0h3m1 0h1m2 0h2m3 0h1m1 0h3m1 0h1M0 3.5h1m1 0h3m1 0h1m2 0h3m2 0h1m1 0h3m1 0h1M0 4.5h1m1 0h3m1 0h1m3 0h1m1 0h1m1 0h1m1 0h3m1 0h1M0 5.5h1m5 0h1m4 0h2m1 0h1m5 0h1M0 6.5h7m1 0h1m1 0h1m1 0h1m1 0h7M8 7.5h5M0 8.5h2m1 0h2m1 0h1m2 0h2m1 0h1m1 0h1m5 0h1M0 9.5h2m5 0h1m1 0h1m2 0h1m1 0h1m1 0h4M0 10.5h1m1 0h1m1 0h1m1 0h2m5 0h2m1 0h1m1 0h1M2 11.5h4m5 0h1m5 0h1m2 0h1M1 12.5h4m1 0h3m1 0h1m3 0h1m2 0h2m1 0h1M8 13.5h1m2 0h2m6 0h1M0 14.5h7m2 0h1m2 0h6m2 0h1M0 15.5h1m5 0h1m2 0h5m1 0h3M0 16.5h1m1 0h3m1 0h1m1 0h1m2 0h2m1 0h1m2 0h1m1 0h2M0 17.5h1m1 0h3m1 0h1m1 0h1m2 0h2m2 0h3M0 18.5h1m1 0h3m1 0h1m2 0h1m4 0h2m1 0h4M0 19.5h1m5 0h1m1 0h3m2 0h4m2 0h2M0 20.5h7m1 0h4"/>
    </svg>
  </div>

  <div v-if="qrType === 'text'">
    <div class="QR_text_font" v-if="textInfo.color && textInfo.size && textInfo.weight" :style='`background-color:${textInfo.background};`'>
      <div class="QR_text_font_text" :style="`line-height: ${textInfo.height}px;width:${textInfo.width}px;height:${textInfo.height}px;color: ${textInfo.color};font-size: ${textInfo.size}px;font-weight: ${textInfo.weight};text-align: center;`">
        {{textInfo.text}}
      </div>
    </div>
  </div>

</div>
</template>

<script lang="ts">

import Vue from 'vue'
import config from '~/config'
import uHelper from '~/app/@biz/uHelper'

const { oss2image } = uHelper

export default Vue.extend({
  props: [
    'color',
    'logoInfo',
    'textInfo',
    'qrType'
  ],


  data () {
    return {
      ossImg: config.assetBase,
    }
  },

  methods: {
    oss2image,
  },
})
</script>

<style scoped>
.QR_code {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
}

.qr-logo {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

.qr-logo img {
  width: 100%;
  height: 100%;
}

.QR_text_font {

}


.QR_text_font_text {
  word-break: break-word;
}


</style>
