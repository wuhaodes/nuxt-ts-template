<template>
<div class="graph_index">
  <div style="width: 1280px;margin: 0 auto">
    <div class="list_title clearfix">
      <div class="title fl " style="text-align: left">模版列表</div>
      <div class="list-operate fr ">
<!--        <el-button @click="generationCheck" type="primary"><i class="el-icon-document-checked"></i> 生成校验</el-button>-->
        <el-button @click="toCreateQRList" type="primary"><i class="el-icon-edit"></i> 添加简洁模版</el-button>
        <el-button :disabled="!canUse.addGraph" @click="createGraph" type="primary"><i class="el-icon-edit"></i> 添加普通模版</el-button>
      </div>
      <el-input @keyup.enter.native="searchGraph" class="input-with-select fr" clearable placeholder="模版名称"
                size="medium" style="width: 400px;height: 26px;" v-model="search">
        <el-button @click="searchGraph" slot="append">搜索</el-button>
      </el-input>
    </div>
    <div class="page-content">
      <div class="list-table">
        <div class="search_company">
          <!--multiple       collapse-tags多选     @focus="optionType=true"      $storage.removeState('graphListTagId')-->
          <el-select
            @change="changeTypeSelect"
            @visible-change="changeVisibleCompany"
            clearable
            multiple
            placeholder="请选择企业"
            ref="showCheckCompany"
            v-model="checkCompanyList"
            v-show="isShowCheckCompany">
            <el-option
              :key="item.companyId"
              :label="item.name"
              :value="item.companyId"
              v-for="item in companyList">
            </el-option>
          </el-select>
        </div>
        <div class="search_school">
          <!--multiple       collapse-tags多选     @focus="optionType=true"      $storage.removeState('graphListTagId')-->
          <el-select
            @change="changeTypeSelect"
            @visible-change="changeVisibleSchool"
            clearable
            multiple
            placeholder="请选择学校"
            ref="showCheckType"
            v-model="checkSchoolList"
            v-show="isShowCheckSchool">
            <el-option
              :key="item.schoolId"
              :label="item.name"
              :value="item.schoolId"
              v-for="item in schoolList">
            </el-option>
          </el-select>
        </div>

        <div class="rule_type">
          <!--multiple       collapse-tags多选           $storage.removeState('graphListTagId')-->
          <el-select
            @change="changeTypeSelect"
            @visible-change="changeVisibleRule"
            clearable
            multiple
            placeholder="请选择二维码类型"
            ref="showCheckRule"
            v-model="checkRuleList"
            v-show="isShowCheckRuleBox">
            <el-option
              :key="item.ruleId"
              :label="item.name +'（'+ item.ruleId +'）'"
              :value="item.ruleId"
              v-for="item in ruleList">
            </el-option>
          </el-select>
        </div>

        <el-table
          :data="list"
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
            min-width="110"
            prop="name">
            <template slot-scope="scope">
            <span style="font-size: 14px;color: #606266;cursor: pointer;" @click="graphView(scope.row.graphId,scope.row.name)"  v-if="scope.row.process === 'previewed' || scope.row.process === 'printed' || scope.row.process === 'prepared'">{{scope.row.name}}</span>
            <span style="font-size: 14px;color: #606266;cursor: pointer;" v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :render-header="renderHeaderRule"
            label="二维码类型 "
            min-width="130">
            <template slot-scope="scope">
            <span v-if="scope.row.rule">{{scope.row.rule.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :render-header="renderHeaderCompany"
            label="所属企业 "
            min-width="130">
            <template slot-scope="scope">
            <span v-if="scope.row.company">{{scope.row.company.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :render-header="renderHeaderSchool"
            label="所属学校 "
            min-width="130">
            <template slot-scope="scope">
            <span v-if="scope.row.school">{{scope.row.school.name}}</span>
            <span v-else>暂无</span>
            </template>
          </el-table-column>
          <el-table-column
            :filter-method="filterTag"
            :filters="[{ text: '简洁版', value: 'simple' }, { text: '普通版', value: 'normal' }]"
            filter-placement="bottom-end"
            label="模版类型"
            prop="tag"
            width="90">
            <template slot-scope="scope">
            <el-tag
              :type="scope.row.type === 'normal' ? 'primary' : 'success'"
              disable-transitions>
              <span v-if="scope.row.type ==='simple' ">简洁版</span>
              <span v-if="scope.row.type ==='normal' ">普通版</span>
            </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="生产版数"
            prop="lastPage">
            <template slot-scope="scope">
            <span v-if="scope.row.lastPage">{{scope.row.lastPage}}</span>
            <span v-else>0</span>
            </template>
          </el-table-column>
          <el-table-column
            label="创建者"
            min-width="100">
            <template slot-scope="scope">
            <span v-if="scope.row.operator">{{scope.row.operator.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            min-width="134"
            prop="created"
            sortable>
            <template slot-scope="scope">
            {{scope.row.created | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column
            align="right"
            label="操作"
            min-width="100">
            <template slot-scope="scope">
            <el-button @click="graphProduct(scope.row.graphId)" type="text" v-if="scope.row.process === 'previewed' || scope.row.process === 'printed' || scope.row.type === 'simple'">生产</el-button>
            <el-button @click="graphDetail(scope.row.graphId)" type="text" v-if="scope.row.type === 'normal'">设计</el-button>
            <el-button @click="QRDetail(scope.row.graphId)" type="text" v-if="scope.row.type === 'simple'">设计</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--        分页-->
        <!--        <div class="pagination fr">-->
        <!--          <el-pagination-->
        <!--            :total="1000"-->
        <!--            @current-change="handleCurrentChange"-->
        <!--            layout="prev, pager, next,total">-->
        <!--          </el-pagination>-->
        <!--        </div>-->
      </div>
      <div class="null_data">暂无模版</div>
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

      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadShowImg" size="small" type="primary">下载预览图</el-button>
      </div>
    </el-dialog>
  </div>

</div>
</template>

<script lang="ts">

import uCgi from '~/app/@biz/uCgi'
import uHelper from '~/app/@biz/uHelper'
import uPassport from '~/app/@biz/uPassport'
import config from '~/config'
import { storage } from 'coa-nuxt'
import Vue from 'vue'

const { oss2image } = uHelper

export default Vue.extend({
  name: 'graph',
  layout: 'default',

  filters: {
    dateFormat: (value: number) => {
      return uHelper.dateFormat(value, 'YYYY-MM-DD HH:mm:ss')
    }
  },

  data () {
    return {
      canUse: {
        addGraph: uPassport.checkRole('map.master,map.hr,map.owner,map.market,map.market.design'),
      },
      isShowCheckCompany: false,
      isShowCheckSchool: false,
      companyList: [],
      schoolList: [],
      checkCompanyList: [],
      checkSchoolList: [],

      isShowCheckRuleBox: false,
      isShowCheckBox: false,
      checkRuleList: [],
      list: [],

      ruleList: [],
      ossImg: config.imageBase,
      search: '',
      dialogVisible: false,
      name: '',
      dialogVisibleImg: false,
      isShowGraphImg: '',
      isShowGraphName: '',
      box: ['', ''],
      rate: 100,
    }
  },

  //获取列表
  async asyncData () {
    const checkRule = storage.local.get('graphListRuleId')
    const checkRuleList = checkRule === undefined ? '' : checkRule
    const checkRuleIdList = checkRule === undefined ? '' : checkRule.join(',')
    const params = { ruleId: checkRuleIdList }
    if (!params.ruleId) delete params.ruleId
    const result = await uCgi.GraphSelect(params)
    const resRule = await uCgi.RuleSelect({ rows: 9999 })
    const company = await uCgi.CoreCompanyWaList({ process: 'audited', rows: 9999 })
    const school = await uCgi.CoreAccountSchoolWaList({ rows: 9999 })

    return {
      list: result.body ? result.body.list : { list: [] },
      companyList: company.body ? company.body.list : { list: [] },
      schoolList: school.body ? school.body.list : { list: [] },
      ruleList: resRule.body ? resRule.body : [],
      checkRuleList: checkRuleList ? checkRuleList : '',
      isShowCheckRuleBox: !!checkRuleList
    }
  },

  methods: {
    oss2image,

    filterTag (value: any, row: any) {
      return row.type === value
    },

    // 跳转编辑页面
    QRDetail (graphId: string) {

      console.log('graphId', graphId)
      this.$router.push({ path: '/mp/graph/detail_qr/' + graphId })
    },

    //多选type
    async changeTypeSelect () {
      storage.local.remove('graphListRuleId')
      const result = await uCgi.GraphSelect({ companyId: this.checkCompanyList.join(','), schoolId: this.checkSchoolList.join(','), ruleId: this.checkRuleList.join(',') })
      if (result.code === 200) {
        this.list = result.body ? result.body.list : { list: [] }
      }
    },

    //表头header加icon  所属企业
    renderHeaderCompany (h: any, { column }: Dic<any>) {
      return h(
        'div', {
          style: 'height: 30px;padding-left:0;'
        },
        [
          h('span', column.label),

          h('i', {
            class: 'el-icon-s-operation',
            style: 'color:#409eff;font-size:14px;cursor: pointer;',
            on: {
              click: () => {
                this.isShowCheckCompany = !this.isShowCheckCompany
                const elCheck = this.$refs['showCheckCompany'] as any
                elCheck.toggleMenu()
              }
            }
          })
        ]
      )
    },

    //企业
    changeVisibleCompany (e: any) {
      // console.log('changeVisible', e)
      if (e === false) {
        this.isShowCheckCompany = false
      }
    },

    //表头header加icon
    renderHeaderSchool (h: any, { column }: Dic<any>) {
      return h(
        'div', {
          style: 'height: 30px;padding-left:0;'
        },
        [
          h('span', column.label),

          h('i', {
            class: 'el-icon-s-operation',
            style: 'color:#409eff;font-size:14px;cursor: pointer;',
            on: {
              click: () => {
                this.isShowCheckSchool = !this.isShowCheckSchool
                const elCheck = this.$refs['showCheckType'] as any
                elCheck.toggleMenu()
              }
            }
          })
        ]
      )
    },

    //学校
    changeVisibleSchool (e: any) {
      // console.log('changeVisible', e)
      if (e === false) {
        this.isShowCheckSchool = false
      }
    },

    changeVisibleRule (e: any) {
      // console.log('changeVisible', e)
      if (e === false) {
        this.isShowCheckRuleBox = false
      }
    },

    //表头header加icon
    renderHeaderRule (h: any, { column }: Dic<any>) {
      return h(
        'div', {
          style: 'height: 30px;padding-left:0;'
        },
        [
          h('span', column.label),

          h('i', {
            class: 'el-icon-s-operation',
            style: 'color:#409eff;font-size:14px;cursor: pointer;',
            on: {
              click: () => {
                this.isShowCheckRuleBox = !this.isShowCheckRuleBox
                const elCheck = this.$refs['showCheckRule'] as any
                elCheck.toggleMenu()
              }
            }
          })
        ]
      )
    },

    //currentPage 改变时会触发
    handleCurrentChange (val: any) {
      console.log(`当前页: ${val}`)
    },

    //搜索模版
    async searchGraph () {
      // console.log('搜索模版')
      const result = await uCgi.GraphSelect({ search: this.search })
      if (result.code === 200) {
        this.list = result.body.list || []
      } else {
        this.$message({
          type: 'warning',
          message: result.message
        })
      }
    },

    //跳转普通模版页面
    toCreateQRList () {
      this.$router.push({ path: '/mp/graph/create_qR' })

    },

    //关闭预览
    handleCloseImg (done: () => {}) {
      done()
    },

    //生成二维码
    productQRList () {
      this.$router.push({ path: '/mp/graph/q_r_list' })
    },

    //生成校验
    generationCheck () {
      this.$router.push({ path: '/mp/graph/generation_check' })
    },

    //创建模版
    createGraph () {
      this.$router.push({
        path: '/mp/graph/create'
      })
    },

    //预览
    async graphView (graphId: string,name:string) {
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
    graphDetail (graphId: string) {
      storage.local.remove('graphListTagId')
      // console.log('graphId', graphId)
      this.$router.push({
        path: '/mp/graph/detail/' + graphId
      })
    },

    //跳转生产页面
    graphProduct (graphId: string) {
      storage.local.remove('graphListTagId')
      // console.log('graphId')
      this.$router.push({
        path: '/mp/graph/product/' + graphId
      })
    },
  }
})
</script>


<style lang="scss">

.graph_index {
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
    position: relative;

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

      .search_company {
        .el-select {
          width: 230px;
        }

        .el-input.el-input--suffix {
          width: 100%;
        }

        z-index: 100;
        position: absolute;
        top: 70px;
        left: 28%;

        .input-with-select {
          .el-input-group__append {
            border-radius: 0 2px 2px 0;
            border-color: #1890FF;
            background-color: #1890FF;
            color: #fff;

          }
        }

      }

      .search_school {
        .el-select {
          width: 230px;
        }

        .el-input.el-input--suffix {
          width: 100%;
        }

        z-index: 100;
        position: absolute;
        top: 70px;
        left: 40%;

        .input-with-select {
          .el-input-group__append {
            border-radius: 0 2px 2px 0;
            border-color: #1890FF;
            background-color: #1890FF;
            color: #fff;

          }
        }

      }

      .rule_type {
        .el-select {
          width: 230px;
        }

        .el-input.el-input--suffix {
          width: 100%;
        }

        z-index: 100;
        position: absolute;
        top: 70px;
        left: 15%;

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
        width: 560px!important;
        margin-top: 12vh!important;

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

.table-gary-bg{

  td.el-table_2_column_12{
    .cell{
      span{
        padding: 0!important;
      }
    }
  }
}

</style>

