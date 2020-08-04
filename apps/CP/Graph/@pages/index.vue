<template>
<div class="graph_index_cp">
  <div style="width: 1280px;margin: 0 auto">
    <div class="list_title clearfix">
      <div class="title fl " style="text-align: left">模版列表</div>
      <div class="list-operate fr ">
        <el-button @click="createQRList" type="primary"><i class="el-icon-edit"></i> 新增模版</el-button>
      </div>
    </div>

    <div class="page-content">
      <div class="list-table">
        <el-table
          :data="draftList"
          class="table-gary-bg"
          empty-text="暂无模版"
          style="width: 100%">
          <el-table-column
            label="序号"
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            label="模版名称"
            min-width="100">
            <template slot-scope="scope">
            <span @click="graphView(scope.row.graphId,scope.row.name)" class="click_name"
                  v-if="scope.row.process === 'previewed' || scope.row.process === 'printed' || scope.row.process === 'prepared'">{{scope.row.name}}</span>
            <span class="click_name" v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="纸张类型">
            <template slot-scope="scope">
            <span v-if="scope.row.paper && scope.row.paper.name">{{scope.row.paper.name}}</span>
            <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="纸张规格（mm）">
            <template slot-scope="scope">
            <span v-if="scope.row.paper && scope.row.paper.label">{{scope.row.paper.label}}</span>
            <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="所属客户"
            min-width="120">
            <template slot-scope="scope">
            <span v-if="scope.row.school && scope.row.school.name">{{scope.row.school.name}}</span>
            <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            min-width="140">
            <template slot-scope="scope">
            <span v-if="scope.row.remark">{{scope.row.remark}}</span>
            <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            align="right"
            label="操作"
            width="60">
            <template slot-scope="scope">
            <el-button @click="graphDetail(scope.row.draftId)" type="text">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="null_data">暂无模版</div>

      <div class="pagination_container" v-if="draftList && draftList.length>=20">
        <el-button :loading="true" v-if="loading">努力加载中</el-button>
        <el-button @click="handleLoadMore" v-else-if="draftPage.more">点击加载更多</el-button>
        <el-button disabled v-else>已加载全部</el-button>
      </div>
    </div>
  </div>

  <!--保存合成预览-->
  <div class="isShowImg_index">
    <el-dialog
      :before-close="handleCloseImg"
      :title="isShowGraphName"
      :visible.sync="dialogVisibleImg"
      width="60%">
      <div class="graph-table" ref="graphTable">
        <div class="graph-bg-dialog" ref="bg">
          <img :src="oss2image(isShowGraphImg,'ci0')" alt="" style="width: 100%;position: relative">
        </div>
      </div>
      <div class="dialog-footer" slot="footer">
        <el-button @click="uploadShowImg" size="small" type="primary">下载预览图</el-button>
      </div>
    </el-dialog>
  </div>

  <!--创建-->
  <div class="showCreateGraph">
    <el-dialog
      :close-on-click-modal="false"
      :before-close="handleCloseGraphCreate"
      :visible.sync="dialogVisibleGraphCreate"
      title="新增模板">
      <div class="graph-create">
        <el-form :model="graphForm" label-width="98px" ref="graphForm">
          <el-form-item :rules="{ required: true, message: '输入模版类型名称', trigger: 'blur' }" label="模板名称:" prop="name">
            <el-input placeholder="请输入模板名称" style="width: 300px;" v-model="graphForm.name"></el-input>
          </el-form-item>

          <el-form-item :rules="{ required: true, message: '请选择纸张类型', trigger: 'change' }" label="纸张类型:" prop="paperArray">
            <el-cascader
              :options="paperList"
              :props="{value:'paperId',  expandTrigger: 'hover' }"
              @change="handleChange"
              style="width: 300px;"
              v-model="graphForm.paperArray">
            </el-cascader>
          </el-form-item>

          <el-form-item :rules="{ required: false, message: '请选择所属客户', trigger: 'change' }" label="所属客户:" prop="schoolId">
            <el-select clearable filterable placeholder="请选择所属客户" style="width: 300px;" v-model="graphForm.schoolId">
              <el-option
                :key="item.schoolId"
                :label="item.name"
                :value="item.schoolId"
                v-for="item in companySchoolList">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :rules="{ required: true, message: '请选择所属类型', trigger: 'change' }" label="二维码类型:" prop="ruleId">
            <el-select filterable placeholder="请选择二维码类型" style="width: 300px;" v-model="graphForm.ruleId">
              <el-option
                :key="item.ruleId"
                :label="item.name +'（'+ item.ruleId +'）'"
                :value="item.ruleId"
                v-for="item in ruleList">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="备注:" prop="remark">
            <el-input :autosize="{minRows: 2, maxRows: 6 }" placeholder="请填写备注" style="width: 300px;" type="textarea" v-model="graphForm.remark"></el-input>
          </el-form-item>

        </el-form>
      </div>

      <div class="dialog-footer" slot="footer">
        <el-button :loading="true" type="primary" v-if="loading">确 定</el-button>
        <el-button @click="createGraph" type="primary" v-else>确 定</el-button>
      </div>
    </el-dialog>
  </div>

</div>
</template>

<script lang="ts">

import { ElForm } from 'element-ui/types/form'
import Vue from 'vue'
import uCgi from '~/app/@biz/uCgi'
import uHelper from '~/app/@biz/uHelper'
import uPassport from '~/app/@biz/uPassport'
import config from '~/config'

const { oss2image } = uHelper

// 获取paper，+存储
async function PaperList () {
  return uHelper.warpCache('PaperList', async () => {
    const { body, code } = await uCgi.MarkDraftPaperMaList()
    if (code === 200) {
      return body || null
    } else
      return null
  })
}

export default Vue.extend({
  name: 'graph',
  layout: 'default_cp',

  filters: {
    dateFormat: (value: number) => {
      return uHelper.dateFormat(value, 'YYYY-MM-DD HH:mm:ss')
    }
  },

  data () {
    return {
      graphList: [],
      ossImg: config.imageBase,
      name: '',
      dialogVisibleImg: false,
      isShowGraphImg: '',
      isShowGraphName: '',

      graphForm: {
        companyId: '',
        dpi:500,
        name: '',
        ruleId: '',
        paperId: '',
        schoolId: '',
        remark: '',
        paperArray: []
      },
      dialogVisibleGraphCreate: false,

      loading: false,

      // ----
      companyId: '',
      companySchoolList: [],
      ruleList: [],

      paperList: [],

      draftList: [],
      draftPage: {} as any,

      params: {
        status: '',
        last: '',
        rows: ''
      },
    }
  },

  //获取列表
  async asyncData () {

    const { body } = await uCgi.MarkDraftMaList()

    const draftList = body?.list || []
    const draftPage = body?.page || {}

    return {

      draftList,
      draftPage
    }
  },

  methods: {
    oss2image,

    handleChange (value: any) {
      this.graphForm.paperId = value[1] || ''
    },

    //加载更多
    async handleLoadMore () {
      const sc = document.body.scrollTop || document.documentElement.scrollTop
      this.loading = true
      this.params.last = this.draftPage.last
      let result = await uCgi.MarkDraftMaList(this.params) || {}
      this.draftList = this.draftList.concat(result.body?.list)
      this.draftPage = result.body?.page
      this.loading = false
      this.$nextTick(() => {
        document.body.scrollTop = document.documentElement.scrollTop = sc
      })
    },

    //添加模版弹框模版页面
    async createQRList () {
      const passportData = uPassport.getPassportInfo()
      const companyId = passportData?.company?.companyId || ''

      this.companyId = companyId

      const school = await uCgi.CoreAccountSchoolWaList({ rows: 9999 })
      const schoolList = school?.body?.list || []

      this.companySchoolList = schoolList.filter((v: Dic<any>) => (v.companyId === companyId)) || []

      const { code, body } = await uCgi.MarkRuleMaList({ rows: 9999 })
      this.ruleList = body || []

      const result = await PaperList() || {}
      this.paperList = result || []

      if (code === 200 && school?.code === 200) {
        this.dialogVisibleGraphCreate = true
      }
    },

    //关闭添加
    handleCloseGraphCreate (done: () => {}) {
      const ElForm = this.$refs['graphForm'] as ElForm
      ElForm.resetFields()
      done()
    },

    //关闭预览
    handleCloseImg (done: () => {}) {
      done()
    },

    //创建
    async createGraph () {
      const valid = await (this.$refs['graphForm'] as ElForm).validate().catch(e => false)
      if (!valid) {return false}

      this.loading = true
      this.graphForm.companyId = this.companyId || ''

      const { code } = await uCgi.MarkDraftBasicMaPost(this.graphForm)
      if (code === 200) {
        const { body } = await uCgi.MarkDraftMaList()
        this.draftList = body?.list || []
        this.draftPage = body?.page || {}
        const ElForm = this.$refs['graphForm'] as ElForm
        ElForm.resetFields()
        this.$notify({ title: '成功', message: '成功新增模版', type: 'success' })
        this.dialogVisibleGraphCreate = false
      }

      setTimeout(() => {this.loading = false}, 3000)
    },

    //预览
    async graphView (graphId: string, name: string) {
      this.isShowGraphImg = ''
      this.isShowGraphName = name
      const result = await uCgi.GraphDetail({ graphId: graphId })
      if (result.body.preview === '') {
        return
      }
      if (result.code === 200) {
        this.isShowGraphImg = result.body.preview
        this.dialogVisibleImg = true
      } else {
        this.$message({
          type: 'warning',
          message: result.message
        })
      }
    },

    //下载预览图
    uploadShowImg () {
      window.open(this.ossImg + this.isShowGraphImg + '/ci0')
    },

    //跳转设计页面
    graphDetail (draftId: string) {
      this.$router.push({ path: `/cp/graph/detail/${draftId}` })
    },
  }
})
</script>


<style lang="scss">

.graph_index_cp {
  padding: 18px 40px;

  .list_title {
    .title {
      font-size: 16px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 36px;
    }

    .list-operate {
      text-align: right;
    }

    .el-button--primary {
      padding: 10px 20px;
      border-radius: 2px;
      height: 36px;
      margin-left: 16px;
    }

  }

  .page-content {
    background-color: #fff;
    position: relative;

    .list-table {
      padding-top: 20px;
      position: relative;

      .click_name {
        font-size: 14px;
        color: #606266;
        cursor: pointer;
        padding: 6px;
      }

      .el-table.table-gary-bg.el-table--fit.el-table--enable-row-hover.el-table--enable-row-transition {
        /*color: rgba(51, 51, 51, 1);*/
      }

      .el-table__header-wrapper {
        .el-table__header {
          .has-gutter {
            th {
              padding: 0;
              font-size: 12px;
              background-color: #fafafa;
              height: 48px;
            }
          }
        }
      }
    }

    .null_data {
      width: 1280px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      color: #909399;
      border-bottom: 1px solid #EBEEF5;
      background-color: #FFFFFF;
      z-index: -100;

      position: absolute;
      top: 68px;
    }

  }

  .isShowImg_index {
    .el-dialog__wrapper {
      .el-dialog {
        width: 560px !important;
        margin-top: 12vh !important;

        .el-dialog__header {
          background: #fafafa;
          padding: 8px;
          color: #bbbbbb;
          text-align: center;

          .el-dialog__headerbtn {
            top: 6px;
            right: 10px;

            .el-dialog__close.el-icon.el-icon-close {
              font-size: 22px;
            }
          }
        }

        .el-dialog__body {
          padding: 0;

          .graph-table {
            text-align: center;
            max-height: 600px;
            overflow: scroll;

            .graph-bg-dialog {
              margin-bottom: 16px;

              img {
                width: auto;
                height: auto;

              }
            }

          }

        }

        .el-dialog__footer {
          padding: 10px 0 20px 0;
          text-align: center;
          margin-left: 0;

          .el-button.el-button--primary.el-button--small {
            width: 120px;
            height: 36px;
            border-radius: 2px;
          }
        }

      }
    }
  }

  .showCreateGraph {

    .el-dialog {
      width: 464px;

      .el-dialog__header {
        background: rgba(250, 250, 250, 1);
        padding: 14px 30px;

        .el-dialog__title {
          font-size: 14px;
          color: rgba(153, 153, 153, 1);
        }

        .el-dialog__headerbtn {
          top: 14px;
          right: 14px;

          .el-icon-close {
            font-size: 24px;
            font-weight: 500;
          }
        }
      }

      .el-dialog__body {
        padding: 40px 30px 16px;
      }

      .el-dialog__footer {
        padding-top: 0;
        padding-bottom: 40px;
      }
    }

    .graph-create {
      .el-input {
        height: 36px;

        .el-input__inner {
          height: 36px;
        }
      }
    }

    .dialog-footer {
      text-align: center;

      .el-button.el-button--primary {
        width: 142px;
        height: 40px;
        background: rgba(24, 144, 255, 1);
        border-radius: 2px;
      }

    }

  }

  //分页
  .pagination_container {
    text-align: center;
    margin-top: 30px;

    .el-button.el-button--default {
      &:hover {
        background-color: #ffffff;
      }
    }
  }
}

.el-button.el-button--primary {
  border-radius: 2px !important;
}

.el-button.el-button--default {
  border-radius: 2px !important;
}

.el-input__inner {
  border-radius: 2px 0 0 2px !important;
}

.el-popper.el-cascader__dropdown {
  z-index: 2042 !important;

}

</style>

