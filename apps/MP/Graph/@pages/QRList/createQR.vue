<template>
<div class="create_QR">
  <div class="edit fl">
    <div class="create_QR_form">
      <el-form :model="QRForm" :rules="rules" label-position="top" label-width="80px" ref="QRForm" size="mini">
        <el-row>
          <el-col :span="12">

            <el-form-item :rules="{ required: true, message: '请输入模版名称', trigger: 'blur' }" label="模版名称" prop="name">
              <el-input placeholder="请输入模版名称" style="width: 200px" v-model="QRForm.name"></el-input>
            </el-form-item>

            <el-form-item :rules="{ required: true, message: '请选择所属企业', trigger: 'change' }" label="所属企业" prop="companyId">
              <el-select filterable placeholder="请选择所属客户" style="width: 200px;" v-model="QRForm.companyId">
                <el-option
                  :key="item.companyId"
                  :label="item.name"
                  :value="item.companyId"
                  v-for="item in companyList">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="二维码颜色" prop="color">
              <el-input style="width: 200px" v-model="QRForm.color"></el-input>
              <el-color-picker class="ranks_icon_Hex_picker" v-model="QRForm.color"></el-color-picker>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <!--              <el-form-item label="二维码数量" prop="count">-->
            <!--                <el-input-number :controls="false" :min="1" controls-position="right" size="mini" style="width: 180px" v-model="QRForm.count"></el-input-number>-->
            <!--              </el-form-item>-->

            <el-form-item label="所属类型" prop="ruleId">
              <el-select filterable placeholder="请选择所属类型" style="width: 180px;" v-model="QRForm.ruleId">
                <el-option
                  :key="item.ruleId"
                  :label="item.ruleId+' > '+item.name"
                  :value="item.ruleId"
                  v-for="item in ruleList">
                </el-option>
              </el-select>
              <!--          <el-button @click="dialogVisibleRule = !dialogVisibleRule" class="btn_type" size="mini" type="primary"><span>+</span></el-button>-->
              <!--          <p class="plus_title">列表里没有模板规则，点击“+”号添加</p>-->
            </el-form-item>
            <el-form-item label="所属学校" prop="schoolId">
              <el-select filterable placeholder="请选择所属客户" style="width: 200px;" v-model="QRForm.schoolId">
                <el-option
                  :key="item.schoolId"
                  :label="item.name"
                  :value="item.schoolId"
                  v-for="item in schoolList">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="logoImg" label="二维码logo">
              <el-row :gutter="24">
                <el-col :span="10" style="margin-bottom: 0">
                  <el-upload
                    :action="uploaderSign.host"
                    :before-upload="beforeAvatarUploadLogo"
                    :data="uploaderData"
                    :on-error="uploadErrorLogo"
                    :on-success="handleAvatarSuccessLogo"
                    :show-file-list="false"
                    class="upload-demo ">
                    <!--              <el-button style="width: 26px;height: 26px"  size="mini">+</el-button>   :class=" false   ? 'btn_type_upload_logo' : 'btn_type_upload' "-->
                    <el-button class="btn_type_upload" size="mini" type="primary"><span>+上传logo</span></el-button>
                    <p class="plus_title">注：jpg/png格式</p>
                  </el-upload>
                </el-col>

                <!--              <el-col :span="10" class="logo_ranks_icon_WH_width" v-if="QRForm.logo.file !== ''">-->
                <!--                <span class="logo_ranks_icon_WH">W/H</span>-->
                <!--                &lt;!&ndash;      v-if=" isShowLogoImg "          <el-input :disabled="qrs[qrActive][6] === 1 || isShowLogoImg " placeholder="" size="mini" v-model="qrs[qrActive][5]"></el-input>&ndash;&gt;-->
                <!--                <el-input-number :controls="false" :min="0.1" controls-position="right" size="mini" v-model="QRForm.logo.width"></el-input-number>-->
                <!--              </el-col>-->
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="createBtn">
      <el-button @click="createQR" size="small" type="primary">生成</el-button>
    </div>
  </div>

  <div class="show">
    <div class="show_QR">
      <q-r-code-create :color="QRForm.color" :logo-info="{path:QRForm.logo,width:logoWidth*100}" :qr-width="qrWidth*10" :style="`background-color: ${QRForm.background}`"></q-r-code-create>
    </div>
  </div>


</div>
</template>

<script lang="ts">

import uCgi from '~/app/@biz/uCgi'
import uHelper from '~/app/@biz/uHelper'
import { ElForm } from 'element-ui/types/form'
import { ElUpload } from 'element-ui/types/upload'
import Vue from 'vue'
import QRCodeCreate from '~/app/components/QRCodeCreate.vue'


const { oss2image } = uHelper

// 像素单位=(厘米*dpi)/25.4

function cm2px (cm:any, dpc = 500, digital = 2) {
  if (!cm || isNaN(parseFloat(cm))) return undefined
  return parseFloat(((cm * dpc) / 25.4).toFixed(digital))
  // return cm
}



export default Vue.extend({
  layout: 'default_detail',

  components: { QRCodeCreate },

  //计算属性
  computed: {

    qrWidth ():any {
      return cm2px(this.width)
    },

  },

  data () {
    return {
      uploaderSign: { host: '' } as Dic<string>,
      uploaderData: {} as TUploaderData,
      path: 'qrLogo',
      ruleList: [],
      companyList: [],
      schoolList: [],
      loading: false,

      color: 'rgba(0, 0, 0, 1)',
      background: 'rgba(255, 255, 255, 0)',

      width: 1,
      logoWidth: 0.25,

      QRForm: {
        type: 'simple',
        sourceOrigin: '',
        dpi: '500',
        color: '#000000',
        background: '#ffffff00',
        ruleId: '',
        companyId: '',
        schoolId: '',
        width: '',
        count: 1,
        margin: '',
        logo: '',
        logoWidth: '',

        qrs: [[0, 0, 2, '', '', 0.5]]

      },
      dialogVisibleRule: false,
      isShowLogoImg: false,
      RuleForm: {
        value: '',
        name: '',
        description: '',
        weight: 100,
        status: 1,
      },

      rules: {
        color: [
          { required: true, message: '输入二维码颜色', trigger: 'blur' },
        ],
        tagNo: [
          { required: true, message: '二维码类型编号', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9]+$/, message: '填写正确的类型编号', trigger: 'blur' }
        ],
        background: [
          { required: true, message: '输入二维码背景色', trigger: 'blur' },
        ],
        desc: [
          { required: true, message: '输入二维码描述', trigger: 'blur' },
        ],
        width: [
          { required: true, message: '输入二维码数量', trigger: 'blur' },
        ],
        margin: [
          { required: true, message: '输入二维码静区宽度', trigger: 'blur' },
        ],
        count: [
          { required: true, message: '输入二维码数量', trigger: 'blur' },
        ],
        tagId: [
          { required: true, message: '请选择所属客户', trigger: 'change' }
        ],
        ruleId: [
          { required: true, message: '请选择二维码类型', trigger: 'change' }
        ],

      },
    }
  },

  //mounted，获取数据
  async asyncData () {

    const resRule = await uCgi.RuleSelect({ rows: 9999 })
    const ruleList = resRule.body || []

    const company = await uCgi.CoreCompanyWaList({ process: 'audited', rows: 9999 })
    const companyBody = company.body || {}
    const companyList = companyBody.list || []

    const school = await uCgi.CoreAccountSchoolWaList({ rows: 9999 })
    const schoolBody = school.body || {}
    const schoolList = schoolBody.list || []

    return {
      companyList,
      schoolList,
      ruleList
    }
  },

  methods: {
    oss2image,

    //生成二维码 .toLowerCase( )
    async createQR () {
      const valid = await (this.$refs['QRForm'] as ElForm).validate().catch(e => false)
      if (!valid) return
      this.QRForm.qrs[0][3] = this.QRForm.color
      this.QRForm.qrs[0][4] = this.QRForm.logo
      console.log('this.QRForm', this.QRForm)
      const result = await uCgi.GraphPrepare(this.QRForm)

      if (result.code === 200) {
        this.$notify({ title: '成功', message: '已新增二维码', type: 'success' })
        this.$router.replace({ path: '/mp/graph' })
      }
    },

    //添加logo 文件
    async beforeAvatarUploadLogo (file:any) {
      // this.fullscreenLoading1 = true
      const type = file.name.split('.').pop().toLowerCase()
      // console.log('type', type)
      const fileType = ['jpg', 'jpeg', 'png'].some(item => item === type)
      if (!fileType) {
        this.$message('格式错误！请重新选择')
        const elUpload = this.$refs['upload'] as ElUpload
        elUpload.abort(file)
        return
      }
      const result = await uCgi.StoreOssToken({ path: this.path })
      // console.log('StoreOssToken', result)
      if (result.code === 200) {
        const uploaderSign = result.body.token || {}
        const type = file.name.split('.').pop().toLowerCase()
        let uploaderData = {
          OSSAccessKeyId: uploaderSign['accessid'],
          policy: uploaderSign['policy'],
          Signature: uploaderSign['signature'],
          key: uploaderSign['dir'] + '.' + type,
          success_action_status: 200
        }
        // this.fullscreenLoading1 = false
        this.uploaderSign = uploaderSign
        this.uploaderData = uploaderData
        file.key = this.uploaderData.key
        // console.log('file.key', file.key)
      }

    },
    //添加logo--上传图片成功,并赋值
    handleAvatarSuccessLogo (response:any, file:any) {
      // console.log('成功', response, file, fileList)
      this.$notify({
        title: '成功',
        message: '上传成功',
        type: 'success'
      })
      this.QRForm.logo = file.raw.key
      this.isShowLogoImg = true
    },
    //添加logo--上传图片失败
    uploadErrorLogo () {
      // console.log('失败', response, file, fileList)
      this.$notify({
        title: '请注意',
        message: '上传失败，请重试',
        type: 'warning'
      })
    },
  }
})
</script>


<style lang="scss">
.create_QR {

  min-width: 1200px;

  .edit {
    position: relative;
    width: 50%;
    height: 100vh;
    min-height: 800px;
    background: rgba(250, 250, 250, 1);

    .create_QR_form {
      padding: 24px 40px 0 40px;

      .el-input.is-disabled .el-input__inner {
        background-color: #ffffff;
        border-color: #E4E7ED;
        color: #606266;
        cursor: not-allowed;
      }

      .el-form-item.el-form-item--mini {
        margin-bottom: 24px !important;
      }

      .btn_type {
        margin-top: 1px;
        position: absolute;
        margin-left: 4px;
        padding: 1px 6px;
        border-radius: 2px;
        background-color: #fff;

        &:hover {
          background-color: rgb(217, 236, 255);

          span {
            color: #1890FF;

          }
        }

        span {
          color: #1890FF;
          font-size: 22px;
          line-height: 22px;
          font-weight: 400;
          vertical-align: text-top;
        }

      }

      .plus_title {
        margin-top: 4px;
        width: 210px;
        height: 17px;
        font-size: 10px;
        color: rgba(153, 153, 153, 1);
        line-height: 17px;
      }

      .el-form-item.el-form-item--mini {
        margin-bottom: 40px;
      }

      .el-form-item__label {
        padding: 0;
        line-height: 30px;
      }

      .el-form-item__content {
        width: 80%;

        .el-input {
          .el-input__inner {
            text-align: left;
            border-radius: 2px;
          }
        }
      }

      .ranks_icon_Hex_picker {
        font-size: 12px;
        color: rgba(153, 153, 153, 1);
        z-index: 999;
        position: absolute;
        left: 172px;
        top: 0;
        border-radius: 2px;

        .el-color-picker__trigger {
          padding: 2px;

          /*border: none;*/
          border-radius: 2px;
        }
      }

      .logoImg {

        .logo_ranks_icon_WH_width {
          .el-input__inner {
            width: 180px;
            padding-left: 6px;
            padding-right: 28px;
            text-align: left;
          }
        }

        .logo_ranks_icon_WH {
          font-size: 12px;
          color: rgba(153, 153, 153, 1);
          z-index: 999;
          position: absolute;
          left: 356px;
          top: 2px;
        }

        .el-upload.el-upload--text {
          text-align: left;

          .btn_type_upload {
            width: 180px;
            padding: 1px 6px;
            border-radius: 2px;
            background-color: #fff;

            span {
              color: #1890FF;
              font-size: 12px;
              line-height: 23px;
              font-weight: 400;
              /*vertical-align: text-top;*/
            }

            .el-button--primary.el-button--mini {
              color: #1890FF;
              background-color: #fff;
              font-size: 12px;
            }

            &:hover {
              background-color: rgb(217, 236, 255);

              span {
                color: #1890FF;
                font-size: 12px;
              }
            }

          }

          .btn_type_upload_logo {
            width: 224px;
            margin-left: 4px;
            margin-top: -1px;
            padding: 1px 6px;
            border-radius: 2px;
            background-color: #fff;

            span {
              color: #1890FF;
              font-size: 12px;
              line-height: 23px;
              font-weight: 400;
              /*vertical-align: text-top;*/
            }

            .el-button--primary.el-button--mini {
              color: #1890FF;
              background-color: #fff;
              font-size: 12px;

            }

            &:hover {
              background-color: rgb(217, 236, 255);

              span {
                color: #1890FF;
                font-size: 12px;

              }
            }

          }

          .plus_title {
            margin-top: 4px;
            margin-bottom: 0;
            font-size: 10px;
            padding-left: 4px;
            text-align: left;
            color: rgba(153, 153, 153, 1);
          }
        }

        .plus_title {
          margin-top: 4px;
          width: 210px;
          height: 17px;
          font-size: 10px;
          color: rgba(153, 153, 153, 1);
          line-height: 17px;
        }

      }

    }

    .createBtn {
      position: fixed;
      width: 50%;
      padding: 20px 40px;
      bottom: 0;
      background-color: #fff;

      .el-button.el-button--primary.el-button--small {
        width: 160px;
        height: 32px;
        border-radius: 2px;
      }
    }

  }

  .show {
    width: 50%;
    height: 100vh;
    min-height: 800px;
    background: rgba(240, 242, 245, 1);
    padding: 160px 266px;
    float: right;

    .show_QR {
      /*width: 268px;*/
      /*height: 268px;*/
      margin: 0 auto;
    }

    .QR_title {
      min-width: 268px;
      text-align: center;
      padding: 20px 0 10px 0;
    }

    /*.createBtn {*/
    /*  min-width: 268px;*/
    /*  padding: 10px 0;*/
    /*  text-align: center;*/

    /*  .el-button.el-button--primary.el-button--small {*/
    /*    width: 180px;*/
    /*    height: 32px;*/
    /*    border-radius: 2px;*/
    /*  }*/
    /*}*/

  }

  .el-form-item--mini .el-form-item__error {
    padding-top: 4px;
  }
}

.el-select-dropdown__item {
  height: 26px;
  line-height: 26px;

  &.selected {
    /*background-color: #1890FF;*/
    /*color: #fff;*/
  }

  &:hover {
    /*color: #fff;*/
    /*background-color: #1890FF;*/
  }
}


</style>
