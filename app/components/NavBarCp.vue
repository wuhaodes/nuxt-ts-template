<template>
<div class="navigation">
  <div style="width: 1280px;margin: 0 auto">
    <div class="navigation_logo fl">
      <div class="logo_img fl">
        <img alt="" src="../assets/image/logo.png">
      </div>
      <span class="logo_title">
        铭码集团排版打印系统
        <span :class="runEnvName" v-if="runEnvName !== 'online'">{{runEnvNameUpperFirst}}</span>
        <span class="title_name">企业</span>
      </span>
      <!--      <span @click="toCenter" class="goBack" v-if="from === 'center'"><i class="el-icon-arrow-left"></i>返回管理中心</span>-->
    </div>

    <div class="navigation_bar ">
      <div class="user_name fr">
        <!--          trigger="click"-->
        <el-dropdown size="small">
          <div class="el-dropdown-link">
            <div class="CP_logo">
              <img :src="oss2image(avatarManager,'c3')" alt="" v-if="avatarManager">
              <img alt="" src="../assets/image/logo.png" v-else>
            </div>
            <!--            <div class="CP_name">{{managerName}}<i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i></div>-->
            <div class="CP_name">{{accountName}}<i class="el-icon-caret-bottom el-icon--right"></i></div>
          </div>
          <el-dropdown-menu placement="top" slot="dropdown">
            <div class="menu_manger">
              <div class="menu_company company_title_name" v-if="managerName">人员姓名：{{managerName}}</div>
              <div class="menu_company menu_company_name" style="margin: 10px 20px 20px">手机号：{{managerMobile}}</div>
            </div>

            <el-dropdown-item style="height: 63px;line-height: 62px;background-color: #F8F8F8;">
              <div @click="signOut" style="text-align: right;padding-left: 5px;">
                <span class="fl"><span style="vertical-align: middle;"></span>退出账户</span>
                <i class="el-icon-switch-button" style="font-size: 24px;vertical-align: middle;color: #999999;"></i>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="bar fr">
        <el-menu :default-active="activeRouter" @select="handleSelect" class="el-menu-demo" mode="horizontal">
          <el-menu-item index="/cp/home">
            <nuxt-link style="padding: 26px 20px;" to="/cp/home">
              控制台
            </nuxt-link>
          </el-menu-item>
          <el-menu-item index="/cp/graph">
            <nuxt-link style="padding: 26px 20px;" to="/cp/graph">
              模版管理
            </nuxt-link>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">

import { _ } from 'coa-nuxt'
import Vue from 'vue'
import uHelper from '~/app/@biz/uHelper'
import uPassport from '~/app/@biz/uPassport'

const { oss2image } = uHelper

export default Vue.extend({
  name: 'Navbar',
  props: {
    msg: String
  },
  data () {
    const passportData = uPassport.getPassportInfo()
    const manager = passportData.manager || {}
    const account = passportData.account || {}
    const option = passportData.option || {}
    const from = passportData.from || ''
    const runEnvNameUpperFirst = _.upperFirst(option.runEnvName) || ''
    return {
      activeRouter: '' as any,
      runEnvNameUpperFirst,
      from,
      runEnvName: option.runEnvName || '',

      accountType: account.type,
      accountName: account.name || '',
      avatarManager: manager.avatar || '',
      managerName: manager.name || '',
      managerMobile: manager.mobile || '',
    }
  },

  //监听路由
  watch: {
    $route (to) {

      this.activeRouter = to.path
    }
  },

  mounted () {
    this.activeRouter = this.$route.path
  },

  methods: {

    oss2image,
    //返回信息平台
    async toCenter () {
      const passportData = await uPassport.checkPassportInfo()
      const centerHost = passportData.option.hosts.center
      location.replace(centerHost + '/center/home?time=' + Date.now())
    },

    //退出登入
    async signOut () {
      // 弹出确认模态框
      this.$confirm('是否确定退出?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        uPassport.clearAllPassport()
        this.$router.push({ path: '/auth/login' })
      }).catch(() => {})
    },

    //导航栏跳转
    handleSelect (key: any) {
      this.activeRouter = key
    }

  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "app/assets/style/index";

.navigation {
  min-width: 1280px;
  width: 100%;
  height: 64px;
  background-color: #fff;
  position: fixed;
  padding: 0 40px;
  z-index: 2040;
  box-shadow: 0 1px 4px 0 rgba(153, 153, 153, 0.2);

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

      .title_name {
        vertical-align: top;
        margin-left: 6px;
        padding: 6px 8px;
        font-size: 12px;
        height: 24px;
        background: rgba(24, 144, 255, .2);
        border-radius: 2px;
        color: #1890ff;
      }
    }

    .goBack {
      margin-left: 20px;
      cursor: pointer;
      font-size: 13px;
      width: 100px;
      height: 30px;
      line-height: 30px;
      padding: 8px 12px;
      color: #333333;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 3px 8px 0 rgba(153, 153, 153, .3);
      border-radius: 17px;

      &:hover {
        color: #1890FF;
      }
    }

  }

  .navigation_bar {
    .user_name {
      font-size: 16px;
      line-height: 64px;

      .goBack {
        margin-right: 60px;
        cursor: pointer;
        font-size: 14px;
        width: 100px;
        height: 30px;
        padding: 8px 12px;
        color: #333333;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 3px 8px 0 rgba(153, 153, 153, .3);
        border-radius: 17px;
      }

      .el-dropdown-link {
        line-height: 64px;
        cursor: pointer;
        color: #666666;

        .CP_logo {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          position: absolute;
          left: -26px;
          top: 9px;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .CP_name {
          font-size: 14px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }

        .el-icon-caret-bottom {
          color: #D8D8D8;
          font-size: 16px;
        }

        &:hover {
          color: #1890FF;

          .el-icon-caret-bottom {
            color: #1890FF;
          }
        }
      }
    }

    .bar {
      margin-right: 60px;
      height: 64px;

      .el-menu-demo.el-menu--horizontal.el-menu {
        height: 64px;
      }

      .el-menu-item {
        height: 64px;
        color: #666666;
        padding: 0;

        &:hover {
          color: #1890FF !important;
          background-color: #fff !important;
        }

        div {
          line-height: 66px;
        }
      }

      .el-submenu__title {
        color: #666666;
        height: 64px;
        line-height: 66px;
      }

      .el-menu.el-menu--horizontal {
        border: none;
      }

      .el-submenu {
        &:focus {
          .el-submenu__title {
            color: #909399;
          }
        }

        &:hover {
          .el-submenu__title {
            color: #1890FF;
          }
        }
      }

      .el-submenu__title {
        &:hover {
          color: #1890FF;

          .el-submenu__icon-arrow.el-icon-arrow-down {
            color: #1890FF;
          }
        }
      }

      .el-submenu.is-active {
        .el-submenu__title {
          color: #1890FF;

          .el-submenu__icon-arrow.el-icon-arrow-down {
            color: #1890FF;
          }
        }
      }

      .el-menu-item.is-active {
        border-bottom: 2px solid #1890FF;
        color: #1890FF;
      }

      .router-link-exact-active {
        &.router-link-active {
          color: #1890FF;
        }
      }

      .router-link-exact-active.router-link-active {
        width: 100%;
        height: 100%;
      }

    }
  }
}

.el-menu--horizontal {

  .el-menu.el-menu--popup.el-menu--popup-bottom-start {
    border-radius: 2px;
    border: 1px solid rgba(221, 221, 221, 1);
  }

  .el-menu--collapse .el-menu .el-submenu, .el-menu--popup {
    min-width: 116px !important;
  }
}

.el-menu-item {
  color: #666666;
  text-align: center;

  &:hover {
    background-color: #1890FF !important;
    color: #fff !important;
  }
}

.el-dropdown-menu.el-popper.el-dropdown-menu--small {
  width: 256px !important;
  border-radius: 2px;
  padding: 0;

  .menu_manger {
    font-size: 14px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    border-bottom: 1px solid #F2F2F2;

    .menu_company {
      text-align: left;
      margin: 10px 20px 0 20px;
      border-bottom: none;
      height: 30px;
      line-height: 40px;

      &.company_title_name {
        line-height: 28px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &.menu_company_name {
        margin-top: 0;

      }
    }

    .accountBtn {
      font-size: 12px;
      width: 54px;
      height: 24px;
      text-align: center;
      line-height: 24px;
      background-color: rgba(243, 187, 69, .13);
      color: #F3BB45;
      margin-top: 3px;
      cursor: pointer;
      margin-left: 20px;
      margin-bottom: 20px;
    }

    .accountBtnOperate {
      font-size: 12px;
      width: 54px;
      height: 24px;
      text-align: center;
      line-height: 24px;
      background: rgba(67, 105, 187, .13);
      color: #1890FF;
      margin-top: 3px;
      cursor: pointer;
      margin-left: 20px;
      margin-bottom: 20px;
    }

    .el-button {
      padding: 0;
      width: 54px;
      height: 24px;
      margin: 10px 0 20px 20px;

    }
  }

  .el-dropdown-menu__item {
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #333333;

    &:hover {
      background-color: #ecf0f8 !important;
      color: #1890FF;

      .el-icon-switch-button {
        color: #1890FF !important;
      }

      span {
        color: #1890FF !important;
      }
    }
  }
}


</style>
