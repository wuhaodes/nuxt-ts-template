<template>
<div class="body_login">
  <div class="logo">
    <div class="navigation_logo fl">
      <div class="logo_img fl">
        <img alt="" src="../assets/image/logo.png">
      </div>
      <span class="logo_title">铭码集团排版打印系统<span :class="runEnvName" v-if="runEnvName !== 'online'">{{runEnvNameUpperFirst}}</span></span>
    </div>
  </div>
  <nuxt/>
</div>
</template>

<script lang="ts">

import { _ } from 'coa-nuxt'
import Vue from 'vue'
import uPassport from '~/app/@biz/uPassport'

export default Vue.extend({
  name: 'login',
  middleware: 'login',
  head: {
    title: '铭码集团排版打印系统',
    link: [
      { rel: 'stylesheet', href: '//at.alicdn.com/t/font_1008441_wd725jbivt.css' },
    ]
  },
  data () {
    const passportData = uPassport.getPassportInfo()
    const option = passportData.option || {}
    const runEnvNameUpperFirst = _.upperFirst(option.runEnvName) || ''
    return {

      runEnvNameUpperFirst,
      runEnvName: option.runEnvName || '',
    }
  },
})
</script>

<style lang="scss">
@import "app/assets/style/index";

.body_login {
  .logo {
    width: 100%;
    height: 100px;
    padding: 0 208px;

    .navigation_logo {

      .el-icon-arrow-left {
        font-size: 14px;
      }

      .returnPrev {
        line-height: 40px;

        span {
          margin-left: 0;
        }
      }

      .logo_img {
        margin-top: 21px;

        img {
          width: 50px;
          height: 22px;
        }
      }

      .logo_title {
        margin-left: 10px;
        line-height: 64px;
        display: inline-block;
        font-size: 16px;
        color: #666;

        .alpha {
          margin-left: 8px;
          width: 44px;
          height: 16px;
          font-size: 14px;
          color: #F84F51;
          border: 1px solid #F84F51;
          border-radius: 2px;
          padding: 0 8px;

        }

        .beta {
          margin-left: 8px;
          width: 44px;
          height: 16px;
          font-size: 14px;
          color: #1890FF;
          border: 1px solid #1890FF;
          border-radius: 2px;
          padding: 0 10px;
        }

      }

    }

  }

}

</style>
