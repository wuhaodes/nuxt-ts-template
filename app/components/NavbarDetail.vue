<template>
<div class="navigation">
  <div>
    <div class="navigation_logo fl">
      <el-button @click="$router.back(-1)" class="returnPrev" icon="el-icon-arrow-left" type="text">返回</el-button>
    </div>
    <div class="navigation_bar ">
      <div class="user_name fr">
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
    </div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import uHelper from '~/app/@biz/uHelper'
import uPassport from '~/app/@biz/uPassport'

const { oss2image } = uHelper

export default Vue.extend({
  name: 'NavbarDetail',
  props: {
    msg: String
  },

  data () {
    const passportData = uPassport.getPassportInfo()
    const manager = passportData.manager || {}
    const account = passportData.account || {}
    return {
      accountName: account.name || '',
      avatarManager: manager.avatar || '',
      managerName: manager.name || '',
      managerMobile: manager.mobile || '',
    }
  },

  methods: {
    oss2image,
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
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

.navigation {
  min-width: 1100px;
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

    }

  }

  .navigation_bar {
    .user_name {
      font-size: 16px;
      line-height: 64px;

      .el-dropdown {
        padding: 0 10px;
      }

      .el-dropdown-link {
        line-height: 64px;
        padding: 0 4px 0 0;
        cursor: pointer;

        &:hover {
          color: #409eff;
        }
      }
    }

    .bar {
      margin-right: 30px;
      height: 64px;

      .el-menu-demo.el-menu--horizontal.el-menu {
        height: 64px;
      }

      .el-menu-item {
        height: 64px;
        color: #666666;

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
  width: 116px;
  /*left: 1214px!important;*/
  border-radius: 2px;
  /*border: 1px solid rgba(221, 221, 221, 1);*/

  .el-dropdown-menu__item {
    text-align: center;
    color: #666666;

    &:hover {
      background-color: #1890FF;
      color: #fff;
    }
  }
}


</style>
