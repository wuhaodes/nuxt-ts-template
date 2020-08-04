<template>
<div class="typeList">

  <div style="width: 1280px;margin: 0 auto">
    <div class="list_title clearfix">
      <div class="title fl " style="text-align: left">类型管理</div>
      <div class="list-operate fr ">
        <el-button :disabled="!canUse.qrType" @click="addrule" type="primary"><i class="el-icon-edit"></i> 添加类型</el-button>
      </div>
      <el-input @keyup.enter.native="searchruleType" class="input-with-select fr" clearable placeholder="模版类型"
                size="medium" style="width: 400px;height: 26px;" v-model="search">
        <el-button @click="searchruleType" slot="append">搜索</el-button>
      </el-input>
    </div>

    <div class="page-content">
      <div class="list-table">
        <el-table
          :data="list"
          class="table-gary-bg"
          empty-text="暂无类型"
          style="width: 100%">
          <el-table-column
            label="序号"
            type="index"
            width="150%">
          </el-table-column>
          <el-table-column
            label="类型编号"
            prop="ruleId">
          </el-table-column>
          <el-table-column
            label="类型名称"
            prop="name">
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="created">
            <template slot-scope="scope">
            {{scope.row.created | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            label="模版数量">
            <template slot-scope="scope">
            <div style="text-align: left">
              <span style="margin-right: 10px;" v-if="scope.row.graphCount">{{scope.row.graphCount}}</span>
              <span style="margin-right: 10px;" v-else>0</span>
              <el-button @click="graphMore(scope.row.ruleId)" type="text"> 查看</el-button>
            </div>
            </template>
          </el-table-column>
          <el-table-column
            align="right"
            label="操作">
            <template slot-scope="scope">
            <!-- (!canUse.qrType) && scope.row.graphCount !== 0-->
            <el-button @click="ruleDetail(scope.row.ruleId,scope.row.value,scope.row.name,scope.row.weight,scope.row.description)" type="text">编辑</el-button>
            <el-button @click="ruleDelete(scope.row.ruleId)" type="text" v-if="scope.row.graphCount === 0 && canUse.qrType">删除</el-button>
            <el-button :disabled="true" type="text" v-else>删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>

    </div>

    <!--新增模块类型-->
    <el-dialog
      :before-close="handleCloseT"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      title="新增类型"
      width="30%">
      <el-form :model="typeForm" :rules="rules" class="demo-typeForm" label-width="100px" ref="typeForm">
        <el-form-item label="类型编号：" prop="ruleId" style="margin-bottom: 16px">
          <el-input placeholder="请输入类型编号" v-model="typeForm.ruleId"/>
          <p class="frm_tip">例如:LA、LW、BS</p>
        </el-form-item>
        <el-form-item label="类型名称：" prop="name" style="margin-bottom: 16px">
          <el-input placeholder="请输入类型名称" v-model="typeForm.name"/>
          <p class="frm_tip">例如:人物码、公益码、校园码</p>
        </el-form-item>
        <el-form-item class="disable_value" label="链接规则：" style="margin-bottom: 16px">
          <el-input disabled placeholder="请输入内容" v-model="typeForm.value"/>
          <p class="frm_tip">例如:http://1mak.cn/{rule}/{tag}/{id}</p>
        </el-form-item>
        <el-form-item label="类型描述：">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入描述"
            type="textarea"
            v-model="typeForm.description">
          </el-input>
        </el-form-item>
        <!--        <el-form-item label="类型权重：" prop="weight">-->
        <!--          <el-input-number :min="1" label="类型权重" v-model="typeForm.weight"></el-input-number>-->
        <!--        </el-form-item>-->
      </el-form>
      <span class="dialog-footer" slot="footer">
              <el-button :loading="true" type="primary" v-if="loading">确 定</el-button>
              <el-button @click="typeIndustry" type="primary" v-else>确 定</el-button>
            </span>
    </el-dialog>

    <!--编辑类型描述-->
    <el-dialog
      :before-close="handleClose"
      :close-on-click-modal="false"
      :visible.sync="dialogVisibleDetail"
      title="编辑类型"
      width="30%">
      <el-form :model="typeDetailForm" :rules="rules" class="demo-typeForm" label-width="100px" ref="typeDetailForm">
        <el-form-item class="disable_value" label="类型编号：" prop="ruleId" style="margin-bottom: 16px">
          <el-input disabled placeholder="请输入类型编号" v-model="typeDetailForm.ruleId"/>
          <p class="frm_tip">例如:LA、LW、BS</p>
        </el-form-item>
        <el-form-item label="类型名称：" prop="name" style="margin-bottom: 16px">
          <el-input placeholder="请输入类型名称" v-model="typeDetailForm.name"/>
          <p class="frm_tip">例如:人物码、公益码、校园码</p>
        </el-form-item>
        <el-form-item class="disable_value" label="链接规则：" style="margin-bottom: 16px">
          <el-input disabled v-model="typeDetailForm.value"/>
          <p class="frm_tip">例如:http://1mak.cn/{rule}/{tag}/{id}</p>
        </el-form-item>
        <el-form-item label="类型描述：">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            type="textarea"
            v-model="typeDetailForm.description">
          </el-input>
        </el-form-item>
        <!--        <el-form-item label="类型权重：" prop="weight">-->
        <!--          <el-input-number :min="1" label="类型权重" v-model="typeDetailForm.weight"></el-input-number>-->
        <!--        </el-form-item>-->
      </el-form>
      <span class="dialog-footer" slot="footer">
              <el-button :loading="true" type="primary" v-if="loading">确 定</el-button>
              <el-button :disabled="!canUse.qrType" @click="typeDetail" type="primary" v-else>确 定</el-button>
            </span>
    </el-dialog>


  </div>

</div>
</template>

<script lang="ts">
import { ElForm } from 'element-ui/types/form'
import { storage } from 'coa-nuxt'
import Vue from 'vue'
import uCgi from '~/app/@biz/uCgi'
import uHelper from '~/app/@biz/uHelper'
import uPassport from '~/app/@biz/uPassport'

export default Vue.extend({
  name: 'typeList',
  layout: 'default',

  filters: {
    dateFormat: (value: number) => {
      return uHelper.dateFormat(value, 'YYYY-MM-DD HH:mm:ss')
    }
  },

  data () {
    return {
      canUse: {
        qrType: uPassport.checkRole('map.master,map.hr,map.owner'),
      },
      search: '',
      isShowCheckBox: false,
      list: [],
      dynamicTags: ['标签一', '标签二', '标签三'],
      dialogVisible: false,
      dialogVisibleDetail: false,
      loading: false,
      typeForm: {
        value: 'http://1mak.cn/{rule}/{tag}/{id}',
        ruleId: '',
        name: '',
        description: '',
        weight: 100,
        status: 1,
      },
      typeDetailForm: {
        ruleId: '',
        value: 'http://1mak.cn/{rule}/{tag}/{id}',
        name: '',
        description: '',
        weight: 100,
        status: 1,
      },
      isRuleValue: '',
      isRuleName: '',
      isRuleRuleNo: '',
      isRuleWeight: '',
      isRuleDescription: '',
      rules: {
        ruleId: [
          { required: true, message: '输入类型编号', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '输入类型名称', trigger: 'blur' },
        ],
        value: [
          { required: true, message: '请填写正确的类型', trigger: 'blur' },
          { pattern: /^(http:\/\/)|(https:\/\/)/, message: '请填写正确的HTTP链接格式', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '输入权重', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '输入类型描述', trigger: 'blur' }
        ]
      }
    }
  },

  async asyncData () {
    const result = await uCgi.RuleSelect()
    // console.log(result, 'result')
    return {
      list: result.body ? result.body : []
    }
  },

  methods: {

    //addrule
    addrule () {
      this.dialogVisible = true
    },

    //graphMore
    graphMore (ruleId: string) {
      console.log('ruleId', ruleId)
      storage.local.set('graphListRuleId', [ruleId])
      this.$router.push({
        path: '/mp/graph',
      })
    },

    //ruleDelete 删除
    ruleDelete (ruleId: string) {
      this.$confirm('此操作将永久删除模版类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await uCgi.RuleRemove({ ruleId: ruleId })
        if (result.code === 200) {
          const result = await uCgi.RuleSelect()
          this.list = result.body || []
          this.$notify({
            title: '成功',
            message: '已删除模版类型',
            type: 'success'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除模版类型'
        })
      })
    },

    //详情
    async ruleDetail (ruleId: string) {
      const res = await uCgi.RuleDetail({ ruleId: ruleId })
      if (res.code === 200) {
        this.typeDetailForm = res.body
        this.isRuleValue = res.body.value
        this.isRuleName = res.body.name
        this.isRuleRuleNo = res.body.ruleId
        this.isRuleDescription = res.body.description
        this.dialogVisibleDetail = true
      }

    },

    //搜索type
    async searchruleType () {
      // console.log('搜索', this.search)
      const result = await uCgi.RuleSelect({ search: this.search })
      // console.log(result, 'result')
      if (result.code === 200) {
        this.list = result.body || []
      }
    },

    //currentPage 改变时会触发
    handleCurrentChange (val: any) {
      console.log(`当前页: ${val}`)
    },

    //取消新增弹框
    handleCloseT (done: () => {}) {
      if (this.typeForm.name === '' && this.typeForm.ruleId === '' && this.typeForm.description === '') {
        this.dialogVisible = false
        const elForm = this.$refs['typeForm'] as ElForm
        elForm.resetFields()
      } else {
        this.$confirm('尚未保存，确定关闭？')
          .then(_ => {
            const elForm = this.$refs['typeForm'] as ElForm
            elForm.resetFields()
            done()
          })
          .catch(_ => {
          })
      }
    },

    //取消编辑弹框
    handleClose (done: () => {}) {
      if (this.typeDetailForm.ruleId === this.isRuleRuleNo && this.typeDetailForm.name === this.isRuleName && this.typeDetailForm.value === this.isRuleValue && this.typeDetailForm.description === this.isRuleDescription) {
        const elForm = this.$refs['typeDetailForm'] as ElForm
        elForm.resetFields()
        this.dialogVisibleDetail = false
      } else {
        this.$confirm('尚未保存，确定关闭？')
          .then(_ => {
            const elForm = this.$refs['typeDetailForm'] as ElForm
            elForm.resetFields()
            done()
          })
          .catch(_ => {
          })
      }
    },

    //添加
    async typeIndustry () {

      const valid = await (this.$refs['typeForm'] as ElForm).validate().catch(e => false)
      if (!valid) return
      // console.log('添加', this.typeForm)
      this.loading = true
      const result = await uCgi.RuleCreate(this.typeForm)
      this.loading = false
      if (result.code === 200) {
        this.$notify({ title: '成功', message: '已新增模版类型', type: 'success' })
        const result = await uCgi.RuleSelect()
        this.list = result.body || []
        const elForm = this.$refs['typeForm'] as ElForm
        elForm.resetFields()
        this.dialogVisible = false
      }
    },

    //编辑
    typeDetail () {
      (this.$refs['typeDetailForm'] as ElForm).validate(async (valid) => {
        if (valid) {
          // console.log('编辑', this.typeDetailForm)
          this.loading = true
          const result = await uCgi.RuleRevise(this.typeDetailForm)
          this.loading = false
          // console.log(result)
          if (result.code === 200) {
            const result = await uCgi.RuleSelect({ sort: 'weight' })
            // console.log('result----', result)
            this.list = result.body || []
            this.$notify({
              title: '成功',
              message: '已修改模版类型',
              type: 'success'
            })
            this.dialogVisibleDetail = false
          }
        } else {
          return false
        }
      })
    },
  },

})
</script>


<style lang="scss">

.typeList {
  padding: 18px 40px;

  .frm_tip {
    font-size: 12px;
    color: #8d8d8d;
    line-height: 18px;
  }

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
      width: 120px;
      margin-left: 16px;
    }

    .input-with-select {
      .el-input-group__append {
        border-radius: 0 2px 2px 0;
        border-color: #1890FF;
        background-color: #1890FF;
        color: #fff;
      }
    }
  }

  .page-content {
    background-color: #fff;

    .list-table {
      padding-top: 20px;
      position: relative;

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

      .pagination {
        margin-top: 36px;

        .el-pagination {
          .el-pager {
            li.active {
              min-width: 28px;
              line-height: 28px;
              color: #fff !important;
              background-color: #1890FF !important;
              border-radius: 36px;
            }

            .number {

            }
          }
        }
      }

      .search_type {
        padding: 12px 0 12px 12px;
        width: 296px;
        height: 236px;
        box-shadow: 0 2px 14px 0 rgba(153, 153, 153, 0.3);
        border-radius: 2px;
        background-color: #fff;
        border: 1px solid rgba(221, 221, 221, 1);
        z-index: 100;
        position: absolute;
        top: 70px;
        left: 21%;
        /*display: none;  */

        .input-with-select {
          .el-input-group__append {
            border-radius: 0 2px 2px 0;
            border-color: #1890FF;
            background-color: #1890FF;
            color: #fff;

          }
        }

      }

      .type_list {
        overflow: scroll;
        height: 180px;

        .el-checkbox-group {

          .el-checkbox {
            padding-top: 10px;
            margin-right: 0;
            width: 100%;

            .el-checkbox__label {
              /*background-color: paleturquoise;*/
              width: 100%;

              .el-icon-check {
                float: right;
                color: #fff;
              }

            }

            &.is-checked {
              .el-checkbox__label {
                padding-right: 10px;

                .el-icon-check {
                  color: #1890FF;
                }
              }
            }

          }

          .el-checkbox__input {
            float: right;

            .el-checkbox__inner {
              display: none;
            }

            &.is-checked {
              .el-checkbox__inner {
                display: none;

                .el-icon-check {
                  color: #1890FF;
                }
              }

            }
          }
        }

      }
    }
  }
}

.el-dialog__header {
  padding: 8px 20px 8px;
  background-color: #FAFAFA;

  .el-dialog__headerbtn {
    top: 10px;
  }

  .el-dialog__title {
    font-size: 14px;
  }
}

.el-dialog__wrapper {

  .el-button.el-button--default {
    padding: 10px 20px;
    border-radius: 2px;
    height: 36px;
    width: 80px;
    margin-left: 16px;
  }

  .el-button--primary {
    padding: 10px 20px;
    border-radius: 2px;
    height: 36px;
    width: 80px;
    /*margin-left: 16px;*/
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

.el-dialog {
  margin-top: 24vh;
  min-width: 522px;
}

.el-dialog__header {
  background-color: #FAFAFA;
  padding: 8px 20px 8px;

  .el-dialog__title {
    font-size: 14px !important;
  }

  .el-dialog__headerbtn {
    top: 12px;
  }
}

.el-dialog__body {
  padding-bottom: 0;

  .disable_value {
    .el-input.is-disabled .el-input__inner {
      background-color: #fff;
      border-color: #E4E7ED;
      color: #606266;
      cursor: not-allowed;
    }
  }

  .el-form-item {
    margin-bottom: 24px;
  }

  .el-form-item__label {
    height: 36px;
    line-height: 36px;
  }

  .el-input__inner {
    height: 36px;
    line-height: 36px;
  }

  .el-input-number {
    line-height: 34px;
  }

  .el-input-number__decrease {
    border-radius: 2px 0 0 2px;
  }

  .el-input-number__increase {
    border-radius: 0 2px 2px 0;
  }
}

.el-dialog__footer {
  text-align: left;
  margin-left: 100px;
  padding-top: 8px;

  .el-button.el-button--primary {
    width: 160px;
    height: 40px;
    background-color: #1890FF;
  }
}

</style>

