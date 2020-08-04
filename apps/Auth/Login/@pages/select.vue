<template>
<div class="select">
  <div class="login_content">
    <div class="login_form fl">
      <el-card class="box-card login_box" shadow="never">
        <div class="log_tab_pane_select">选择登录企业</div>
        <div class="log_tab_pane_tips">当前账户已关联{{roleListMine.length}}家企业，请选择登录企业</div>
        <!--登陆部分-->
        <el-form :model="loginForm" ref="loginForm">
          <el-form-item :rules="{ required: true, message: '请选择登录企业', trigger: 'change' }" class="login_input"
                        prop="accountId">
            <el-select filterable placeholder="请选择登录企业" v-model="loginForm.accountId">
              <el-option
                :key="item.accountId"
                :label="`${item.account.name}(${(members[item.role]||{name:'异常权限'}).name})`"
                :value="item.accountId"
                :disabled="item.process === 'disabled'"
                v-for="item in roleListMine">
                <span style="float: left">{{ item.account.name }}</span>
                <span>({{(members[item.role]||{name:'异常权限'}).name}})</span>
              </el-option>
            </el-select>
            <div class="error_tip" v-if="errorMessage">{{errorMessage}}</div>
            <div><i class="el-icon-office-building"></i></div>
          </el-form-item>
          <el-form-item style="margin-bottom: 4px;">
            <el-button disabled v-if="loginForm.accountId === ''" style="width: 100%;" type="info">进 入</el-button>
            <el-button v-else @click="handleLogin" style="width: 100%;" type="primary">进 入</el-button>
          </el-form-item>
          <div class="change_account" @click="changeAccount">切换账号</div>
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
import { ElForm } from 'element-ui/types/form'
import Vue from 'vue'
import uPassport from '~/app/@biz/uPassport'
import uCgi from '~/app/@biz/uCgi'
import cMemberPermission from '~/app/@biz/cMemberPermission'

export default Vue.extend({
  layout: 'login',

  data () {
    const members = cMemberPermission.members || {}
    return {
      members,
      errorMessage: '',
      loginForm: {
        accountId: ''
      },
      imageAnimation: true
    }
  },

  async asyncData ({ redirect }) {

    const passData = await uPassport.checkPassportData()

    const manager = passData.manager || {}
    if (!manager.managerId) {
      return redirect('/auth/login')
    }

    const { body } = await uCgi.AuthPassportRoleListMine()
    const roleListMine = body || []

    return {
      roleListMine
    }
  },

  methods: {
    //密码登入
    async handleLogin () {
      const valid = await (this.$refs['loginForm'] as ElForm).validate().catch(e => false)
      if (!valid) return

      const accountId = this.loginForm?.accountId || ''
      const { code, message } = await uCgi.AuthAccountSignInToastError({ accountId })
      if (code === 200) {
        location.replace('/maker')
      } else {
        this.errorMessage = message
      }
    },

    // 切换账号
    changeAccount () {
      this.imageAnimation = false
      this.$router.replace('/auth/login')
    }

  }
})
</script>

<style lang="scss">

.select {
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
    height: 407px;
    /*background-color: paleturquoise;*/
    position: absolute;
    top: 44%;
    left: 50%;
    transform: translate(-50%, -60%);

    .login_form {
      width: 46%;
      height: 100%;

      .login_box {
        width: 400px;
        height: 407px;
        padding: 40px;
        box-shadow: 0 1px 6px 0 rgba(153, 153, 153, 0.3);

        .el-card__body {
          padding: 0;

          .log_tab_pane_select {
            height: 25px;
            font-size: 18px;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
            line-height: 25px;
          }

          .log_tab_pane_tips {
            height: 17px;
            font-size: 12px;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            line-height: 17px;
            margin: 10px 0 60px;
          }
        }

        .login_input {
          margin-bottom: 20px;

          position: relative;

          .error_tip {
            color: #F56C6C;
            font-size: 12px;
            height: 20px;

            position: absolute;
            left: 4px;
            bottom: 0;
            transform: translateY(50%);

          }

          .el-form-item__content {
            .el-select {
              width: 318px;

              .el-input {
                .el-input__inner {
                  padding-left: 30px;
                }
              }
            }
          }

          .el-icon-office-building {
            color: rgba(204, 204, 204, 1);
            font-size: 18px;
            position: absolute;
            left: 6px;
            top: 11px;
          }
        }

        .el-button.el-button--primary {
          height: 36px;
          padding: 10px;
        }

        .change_account {
          margin-top: 100px;
          width: 48px;
          height: 17px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(67, 105, 187, 1);
          line-height: 17px;
          cursor: pointer;
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
