<template>
<div class="login">
  <div class="login_content">
    <div class="login_form fl">
      <el-card class="box-card login_box" shadow="never">
        <div class="log_tab_pane clearfix">
          <div :class="activeTab === 'sign' ? 'tab_name active' : 'tab_name'" @click="activeTab = 'sign'">验证码登录</div>
          <div :class="activeTab === 'sign' ? 'tab_name' : 'tab_name active'" @click="activeTab = 'sign2'">密码登录</div>
        </div>

        <!--验证码登陆-->
        <el-form :model="signForm" ref="signForm" v-if="activeTab === 'sign' ">
          <el-form-item class="login_input" prop="mobile">
            <el-input @input="inputClickCode()" @keyup.enter.native="handleCodeLogin" clearable maxlength="11"
                      placeholder="注册手机号"
                      prefix-icon="el-icon-mobile-phone" v-model="signForm.mobile"></el-input>
          </el-form-item>
          <el-form-item class="login_input note_input">
            <el-input @input="inputClickCode()" @keyup.enter.native="handleCodeLogin" maxlength="6"
                      placeholder="请填写短信验证码"
                      prefix-icon="el-icon-lock" v-model="signForm.code"></el-input>
            <div class="note_code">
              <div @click="sendCode" class="note_code_title" v-if="showNoteCode">获取验证码</div>
              <div class="note_code_time" v-if="!showNoteCode">{{times}}s</div>
            </div>

          </el-form-item>
          <div class="clearfix">
            <p class="login_error_message fl" v-if="signErrorMessage">{{noteError}}</p>
          </div>

          <el-form-item>
            <el-button @click="handleCodeLogin" style="width: 100%;margin-top: 25px;"
                       type="primary">登录
            </el-button>
          </el-form-item>

        </el-form>

        <!--登陆部分-->
        <el-form :model="loginForm" ref="loginForm" v-if="activeTab === 'sign2'">
          <el-form-item class="login_input" prop="mobile">
            <el-input @input="inputClickPass()" @keyup.enter.native="handleLogin" clearable maxlength="11"
                      placeholder="手机号"
                      prefix-icon="el-icon-mobile-phone" v-model="loginForm.mobile"></el-input>
          </el-form-item>
          <el-form-item class="login_input" prop="password">
            <el-input @input="inputClickPass()" @keyup.enter.native="handleLogin" clearable maxlength="16"
                      placeholder="密码"
                      prefix-icon="el-icon-lock" type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <div class="clearfix">
            <p class="login_error_message fl" v-if="loginErrorMessage">{{passwordError}}</p>
          </div>

          <el-form-item>
            <el-button @click="handleLogin" style="width: 100%;margin-top: 25px;"
                       type="primary">登录
            </el-button>
          </el-form-item>
        </el-form>


      </el-card>
    </div>
    <div class="login_img fr">
      <img alt="" src="../../../../app/assets/image/login_img.png">
    </div>
  </div>
</div>
</template>


<script lang="ts">
import Vue from 'vue'
import uCgi from '~/app/@biz/uCgi'
import { storage } from 'coa-nuxt'

export default Vue.extend({
  layout: 'login',

  data () {
    return {
      activeTab: 'sign',
      signChecked: false,
      loginErrorMessage: false,
      passwordError: '',

      signErrorMessage: false,
      noteError: '',

      showNoteCode: true,

      times: 60,

      loginForm: {
        mobile: '',
        password: '',
        from: 'maker'
      },

      signForm: {
        mobile: '',
        code: '',
        from: 'maker'
      },
      imageAnimation: true

    }
  },
  watch: {
    times (val) {
      if (val === 0) {
        this.showNoteCode = true
      }
    },
  },

  async asyncData () {
    const activeTab = storage.local.get('singleLogOn') || 'sign'

    // console.log('activeTab',activeTab)
    return {
      activeTab: activeTab
    }
  },

  methods: {

    async afterLogin () {
      this.imageAnimation = false

      this.$router.replace('/')
    },

    //60s 倒计时
    countdown () {
      if (this.times === 0) {
        this.times = 60
        return false
      } else {
        this.times--
      }
      setTimeout(() => {
        this.countdown()
      }, 1000)
    },
    //账户登录触发焦点
    inputClickPass () {
      if (this.loginForm.mobile.length > 0) {
        this.loginErrorMessage = false
        return
      } else if (this.loginForm.password !== '') {
        this.loginErrorMessage = false
        return
      }
    },

    //密码登入
    async handleLogin () {
      if (this.loginForm.mobile.length === 0) {
        this.loginErrorMessage = true
        this.passwordError = '请输入手机号'
        return
      }
      if (/^1\d{10}$/.test(this.loginForm.mobile)) {
      } else {
        this.loginErrorMessage = true
        this.passwordError = '输入的手机号格式错误'
        return
      }
      if (this.loginForm.mobile.length < 11) {
        this.loginErrorMessage = true
        this.passwordError = '手机号输入错误'
        return
      }
      if (this.loginForm.password === '') {
        this.loginErrorMessage = true
        this.passwordError = '请输入密码'
        return
      }

      this.loginErrorMessage = false
      //进行登录操作
      const { code, message } = await uCgi.AuthAccountLogin(this.loginForm)

      if (code === 200) {
        this.loginErrorMessage = false
        this.afterLogin()
        storage.local.set('singleLogOn', this.activeTab)
      } else if (code === 400) {
        this.loginErrorMessage = true
        this.passwordError = message
      }
    },

    //验证码登录触发焦点
    inputClickCode () {
      if (this.signForm.mobile.length > 0) {
        this.signErrorMessage = false
        return
      } else if (this.signForm.code.length > 0) {
        this.signErrorMessage = false
        return
      }
    },
    //获取验证码
    async sendCode () {
      if (this.signForm.mobile.length === 0) {
        this.signErrorMessage = true
        this.noteError = '请输入手机号'
        return
      }
      if (/^1\d{10}$/.test(this.signForm.mobile)) {
      } else {
        this.signErrorMessage = true
        this.noteError = '输入的手机号格式错误'
        return
      }
      if (this.signForm.mobile.length < 11) {
        this.signErrorMessage = true
        this.noteError = '手机号输入错误'
        return
      }

      this.signErrorMessage = false
      //发送请求
      const { code } = await uCgi.AuthAccountSmsCodeManagerSend({ mobile: this.signForm.mobile })

      if (code === 200) {
        this.showNoteCode = false
        this.countdown()
      }
    },

    //验证码登入
    async handleCodeLogin () {
      if (this.signForm.mobile.length === 0) {
        this.signErrorMessage = true
        this.noteError = '请输入手机号'
        return
      }
      if (/^1\d{10}$/.test(this.signForm.mobile)) {
      } else {
        this.signErrorMessage = true
        this.noteError = '输入的手机号格式错误'
        return
      }
      if (this.signForm.mobile.length < 11) {
        this.signErrorMessage = true
        this.noteError = '手机号输入错误'
        return
      }
      if (this.signForm.code.length === 0) {
        this.signErrorMessage = true
        this.noteError = '请获取验证码或输入验证码'
        return
      }
      if (/^\d+$/.test(this.signForm.code)) {
      } else {
        this.signErrorMessage = true
        this.noteError = '验证码只能为数字'
        return
      }

      if (this.signForm.code.length < 6) {
        this.signErrorMessage = true
        this.noteError = '验证码错误'
        return
      }
      this.signErrorMessage = false
      const { code, message } = await uCgi.AuthAccountSmsLogin(this.signForm)
      if (code === 200) {
        this.signErrorMessage = false
        this.afterLogin()
        storage.local.set('singleLogOn', this.activeTab)
      } else if (code === 400) {
        this.signErrorMessage = true
        this.noteError = message
      }
    },

  }
})
</script>

<style lang="scss">

.login {
  min-width: 1280px;
  z-index: 999;
  background-color: #fff;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 60px;
  left: 0;
  bottom: 0;
  padding: 0 208px;

  .logo {
    width: 100%;
    height: 100px;
    background-color: papayawhip;

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

        .Alpha {
          margin-left: 8px;
          width: 44px;
          height: 16px;
          font-size: 14px;
          color: #F84F51;
          border: 1px solid #F84F51;
          border-radius: 2px;
          padding: 0 8px;

        }

        .Beta {
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

  .login_content {
    padding: 0 208px;
    width: 100%;
    height: 300px;
    /*background-color: paleturquoise;*/
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -60%);

    .login_form {
      width: 46%;
      height: 100%;

      .login_box {
        float: right;
        width: 400px;
        height: 300px;
        padding: 14px 14px;
        text-align: center;
        box-shadow: 0 1px 6px 0 rgba(153, 153, 153, 0.3);


      /*  ---*/

        .el-card__body {
          padding: 0;

          .log_tab_pane {
            .tab_name {
              float: left;
              margin-right: 20px;
              margin-bottom: 34px;
              height: 25px;
              font-size: 16px;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              line-height: 25px;
              cursor: pointer;

              &.active {
                height: 25px;
                font-size: 18px;
                font-weight: 500;
                color: rgba(51, 51, 51, 1);
                line-height: 25px;
                border-bottom: 2px solid #4369BB;
              }

            }
          }

        }

        .login_input {
          margin-bottom: 20px;

          &.note_input {
            .el-form-item__content {
              .el-input {
                .el-input__inner {
                  padding-right: 120px;
                }
              }
            }

            .note_code {
              position: absolute;
              right: 10px;
              top: 10px;

              .note_code_title {
                height: 22px;
                line-height: 22px;
                color: #6288D9;
                cursor: pointer;

                &:hover {
                  color: #6288D9;
                }

                &:active {
                  color: #2A50A0;
                }

                &:focus {
                  color: #6288D9;
                }
              }

              .note_code_time {
                color: #6288D9;
                height: 22px;
                line-height: 22px;
              }

            }
          }

        }

        .login_error_message {
          height: 17px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(245, 108, 108, 1);
          line-height: 17px;
        }

        .login_action {
          height: 17px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(67, 105, 187, 1);
          line-height: 17px;

          .sign_in {
            cursor: pointer;
            padding-right: 2px;

            &:hover {
              color: #6288D9;
            }

            &:active {
              color: #2A50A0;
            }

            &:focus {
              color: #6288D9;
            }

          }

          .forget {
            cursor: pointer;
            padding-left: 2px;

            &:hover {
              color: #6288D9;
            }

            &:active {
              color: #2A50A0;
            }

            &:focus {
              color: #6288D9;
            }
          }
        }

        .el-button.el-button--primary {
          height: 40px;
          padding: 10px;
        }

        .agreement {
          .el-checkbox {
            .el-checkbox__label {
              height: 17px;
              font-size: 12px;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              line-height: 17px;
            }
          }

          .el-checkbox.is-checked {

          }

          .agreement_msg {
            font-size: 12px;
            height: 22px;
            line-height: 22px;
            padding-left: 10px;

            .user_agreement {
              color: #6288D9;
              cursor: pointer;
              padding-right: 2px;

              &:hover {
                color: #6288D9;
              }

              &:active {
                color: #2A50A0;
              }

              &:focus {
                color: #6288D9;
              }

            }
          }
        }

        .tips {
          text-align: right;
          font-size: 13px;
          color: rgba(0, 0, 0, .65);
          cursor: pointer;
        }

        .el-icon-mobile-phone {
          font-size: 20px;
        }

        .el-icon-lock {
          font-size: 20px;
        }
      }
    }

    .login_img {
      width: 46%;
      height: 100%;
      padding: 5px 0;

      img {
        width: 420px;
        height: 290px;
      }
    }
  }

}
</style>
