<template>
<div class="graph-create clearfix">

  <div class="operation">
    <el-form :model="graphForm" label-position="top" label-width="80px" ref="graphForm" size="mini">
      <el-form-item :rules="{ required: true, message: '输入模版类型名称', trigger: 'blur' }" label="模板名称" prop="name">
        <el-input placeholder="请输入模板名称" v-model="graphForm.name"></el-input>
      </el-form-item>
      <el-form-item :rules="{ required: true, message: '请选择所属类型', trigger: 'change' }" label="二维码类型" prop="ruleId">
        <el-select filterable placeholder="请选择二维码类型" style="width: 200px;" v-model="graphForm.ruleId">
          <!--            :label="item.firstClass + ' > '+item.secondClass"-->
          <el-option
            :key="item.ruleId"
            :label="item.name +'（'+ item.ruleId +'）'"
            :value="item.ruleId"
            v-for="item in ruleList">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :rules="{ required: true, message: '请选择所属企业', trigger: 'change' }" label="所属企业" prop="companyId">
        <el-select @change="changeCompanyHandle" filterable placeholder="请选择所属客户" style="width: 200px;" v-model="graphForm.companyId">
          <el-option
            :key="item.companyId"
            :label="item.name"
            :value="item.companyId"
            v-for="item in companyList">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :rules="{ required: true, message: '请选择所属学校', trigger: 'change' }" label="所属学校" prop="schoolId">
        <el-select clearable filterable placeholder="请选择所属客户" style="width: 200px;" v-model="graphForm.schoolId">
          <el-option
            :key="item.schoolId"
            :label="item.name"
            :value="item.schoolId"
            v-for="item in companySchoolList">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分辨率" prop="AiRate">
        <el-input placeholder="请输入分辨率" v-model="graphForm.dpi"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input :autosize="{minRows: 2, maxRows: 6 }" placeholder="请填写备注" type="textarea" v-model="graphForm.remark"></el-input>
      </el-form-item>

    </el-form>
    <div class="graph_line"></div>

  </div>


  <div class="exhibition uploadGroph">
    <el-upload
      :action="uploaderSign.host"
      :before-upload="beforeAvatarUpload"
      :data="uploaderData"
      :disabled="isUpload"
      :on-error="uploadError"
      :on-success="handleAvatarSuccess"
      class="upload-demo"
      drag
      element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="底图上传成功，跳转设计页面···"
      v-loading.fullscreen.lock="fullscreenLoading">
      <i class="el-icon-plus"></i>
      <div class="el-upload__text"><em>点击添加或直接拖拽底版文件到这里</em></div>
      <div class="el-upload__text"><em style="font-size: 12px;">（建议白色背景无刀刻线底图，PNG格式）</em></div>
    </el-upload>
  </div>


</div>
</template>


<script lang="ts">
import Vue from 'vue'
import {ElUpload} from 'element-ui/types/upload'
import {ElForm} from 'element-ui/types/form'
import uCgi from '~/app/@biz/uCgi'

export default Vue.extend({
  layout: 'default_detail',

  data () {
    return {
      loading: false,
      fullscreenLoading: false,
      isUpload: false,
      graphId: '',
      uploaderSig: false,
      imageUploadCount: 0,
      dialogVisibleRule: false,
      uploaderSign: { host: '' } as Dic<string>,
      uploaderData: {} as TUploaderData,
      graphType: '',

      typeForm: {
        tagNo: '',
        name: '',
        weight: 100,
        status: 1,
      },

      RuleForm: {
        value: '',
        name: '',
        description: '',
        weight: 100,
        status: 1,
      },

      key: '',
      graphForm: {
        type: 'normal',
        name: '',
        companyId: '',
        schoolId: '',
        ruleId: '',
        remark: '',
        dpi: 500,
        sourceOrigin: '',
        weight: 100,
        graphId: '',
        status: 1
      },
      companyList: [] as any[],
      schoolList: [] as any[],
      companySchoolList: [] as any[],
      ruleList: [] as any[],

      isQrPrint: false,
      dialogVisiblePrint: false,
      NumberSheets: '',

      isShowViewQrImg: false,
      dialogVisible: false,
      isShowHelp: false,
      graph: '',
      input: '',
      graphImg: '',
      isShowGraphImg: '',

      qrs: [[10, 10, 200, '#000']],
      qrActive: 0,
      qrsColor: '',
      box: [1200, 1200],
      rate: 100,

      points: [[0, 0], [10, 10], [20, 20]],

      w1: 912,
      h1: 853,

      rules: {
        name: [
          { required: true, message: '输入模版类型名称', trigger: 'blur' },
        ],
        tagNo: [
          { required: true, message: '输入类型编号', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9]+$/, message: '请填写正确的编号格式', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '输入权重', trigger: 'blur' }
        ],
      },
      rulesRule: {
        name: [
          { required: true, message: '输入模版规则名称', trigger: 'blur' },
        ],
        value: [
          { required: true, message: '请填写正确的规则', trigger: 'blur' },
          { pattern: /^(http:\/\/)|(https:\/\/)/, message: '请填写正确的HTTP链接格式', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '输入权重', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '输入规则描述', trigger: 'blur' }
        ]
      }

    }
  },

  //mounted，获取数据
  async asyncData () {
    // const resType = await uCgi.CategorySelect()
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
    async changeCompanyHandle (e: any) {
      const currentCompanyId = e
      this.companySchoolList = this.schoolList.filter((v: Dic<any>) => (v.companyId === currentCompanyId)) || []
      this.graphForm.schoolId = ''
    },
    //上传 文件
    async beforeAvatarUpload (e: any) {
      const type = e.name.split('.')[1]

      const fileType = ['png'].some(item => item === type)
      if (!fileType) {
        this.$message('格式错误！请重新选择')
        const elUpload = this.$refs['upload'] as ElUpload
        elUpload.abort(e)
        return false
      }

      const valid = await (this.$refs['graphForm'] as ElForm).validate().catch(e => false)
      if (!valid) {
        this.$message('模版信息不完善！')
        const elUpload = this.$refs['upload'] as ElUpload
        elUpload.abort(e)
        return false
      }

      const result = await uCgi.GraphToken()
      if (result.code === 200) {
        const uploaderSign = result.body || {}
        const type = e.name.split('.').pop().toLowerCase()
        let uploaderData = {
          OSSAccessKeyId: uploaderSign['accessid'],
          policy: uploaderSign['policy'],
          Signature: uploaderSign['signature'],
          key: uploaderSign['dir'] + '.' + type,
          success_action_status: 200
        }
        this.uploaderSign = uploaderSign
        this.uploaderData = uploaderData
        this.graphForm.sourceOrigin = this.uploaderSign['dir'] + '.' + type
      }

    },

    //上传图片成功,并赋值      companyId: '',schoolId: '',
    async handleAvatarSuccess () {

      this.graphForm.companyId = this.graphForm.companyId || this.companyList[0].companyId
      this.graphForm.ruleId = this.graphForm.ruleId || this.ruleList[0].ruleId
      this.graphForm.name = this.graphForm.name || '未命名'
      this.graphForm.dpi = +this.graphForm.dpi || 500
      this.fullscreenLoading = true

      const res = await uCgi.GraphPrepare(this.graphForm)
      // console.log('GraphPrepare', res)
      if (res.code === 200) {
        this.fullscreenLoading = false
        this.$router.replace({ path: '/mp/graph/detail/' + res.body.graphId })
        this.$notify({ title: '成功', message: '上传成功', type: 'success' })
      }
    },
    //上传图片失败
    uploadError () {
      // console.log('失败', response, file, fileList)
      this.$notify({ title: '请注意', message: '上传失败，请重试', type: 'warning' })
    },

  }
})

</script>


<style lang="scss">


.graph-create {
  background-color: #F0F2F5;

  .frm_tip {
    font-size: 12px;
    color: #8d8d8d;
    line-height: 18px;
  }

  .operation {
    width: 280px;
    height: 100%;
    background-color: #FAFAFA;
    z-index: 99;
    position: fixed;
    top: 64px;

    .el-form-item__error {
      padding-top: 4px;
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

    .add_type {
      position: absolute;
      top: 34px;
      z-index: 99;
      background-color: #fff;
      border-radius: 2px;
      border: 1px solid #ccc;
      padding: 10px;
      width: 200px;
      height: 90px;
    }

    .el-form.el-form--label-top {
      padding: 16px 40px 0 40px;

    }

    .el-form-item__label {
      padding: 0;
    }

    .el-input--medium .el-input__inner {
      height: 30px;
      line-height: 30px;
    }

    .el-input-number--medium {
      line-height: 28px;
    }

    .uploadGroph {
      .el-icon-plus {
        margin-left: 4px;
        top: 1px;
        position: absolute;
        border: 1px solid #1890FF;
        font-size: 24px;
        color: #1890FF;
        cursor: pointer;
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

    .graph_line {
      width: 100%;
      height: 1px;
      background-color: #EEEEEE;
    }

    .graph_operation {
      padding: 20px 20px 0 20px;
      text-align: center;

      .el-row {
        margin-bottom: 20px;
      }

      .el-col {
        cursor: pointer;

        &:hover {
          .graph_operation_name {
            color: #1890FF;
          }
        }

        .el-icon-upload2 {
          font-size: 30px;
          color: #FDAD02;
        }

        .el-icon-back {
          font-size: 30px;
          color: #FDAD02;
        }

        .el-icon-right {
          font-size: 30px;
          color: #FDAD02;
        }

        .el-icon-full-screen {
          font-size: 30px;
          color: #6DD401;
        }

        .el-icon-edit-outline {
          font-size: 30px;
          color: #6DD401;
        }

        .el-icon-delete {
          font-size: 30px;
          color: #F84F51;
        }

        .graph_operation_name {
          font-size: 12px;
          color: #666;
        }
      }

    }

    .graph_view {
      width: 280px;
      position: fixed;
      bottom: 0;
      padding: 14px;
      background-color: #fff;
      text-align: center;

      .el-button.el-button--primary.el-button--small {
        width: 160px;

      }
    }
  }

  .exhibition {
    width: 100%;
    height: 100%;
    background-color: #F0F2F5;
    /*padding-left: 280px;*/
    position: fixed;
    margin-left: 280px;
    /*min-width:1280px;*/
    top: 64px;

    .el-upload-dragger {
      background-color: transparent;
      border: 2px dashed #1890FF;
      border-radius: 2px;
    }

    .upload-demo {
      padding-top: 240px;
      text-align: center;
      margin-left: -240px;

      .el-icon-plus {
        font-size: 67px;
        color: #1890FF;
        margin: 40px 0 16px;
        line-height: 50px;
      }
    }

  }

}

.add_type {
  .el-input__inner {
    border-radius: 2px;
  }

  .el-button.el-button--primary.el-button--mini {
    margin-top: 10px;
    width: 174px;
  }

}

.el-input__inner {
  border-radius: 2px;
}

.el-textarea__inner {
  border-radius: 2px;
}

/*.el-popover.el-popper {*/
/*  width: 200px !important;*/

/*}*/

/*.el-button {*/
/*  padding: 11px 20px;*/
/*  border-radius: 2px;*/
/*  height: 36px;*/
/*}*/

</style>
