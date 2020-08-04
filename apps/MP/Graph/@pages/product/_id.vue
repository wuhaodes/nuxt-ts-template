<template>
  <div class="product_k">

    <div class="show_list" v-if="printList.length > 0">

      <div class="show_table">
        <div :key="item.graphPrintId" class="product_list" v-for="item in printList">
          <div class="product_info">
            <div class="info info_time">生成时间：{{ item.printAt | dateFormat }}</div>
            <div class="info info_name">生成者：<span v-if="item.printer">{{ item.printer.name }}</span></div>
            <div class="info info_group">生成版数：{{ item.pageCount }}版</div>
            <div class="info info_number">生成个数：{{ item.qrCount }}个</div>
            <div class="info info_btn">
              <!--              <el-button v-if="canUse.discard" @click="discard(item.graphPrintId)" type="text">废弃</el-button>-->
              <!--              <el-button v-else :disabled="true" type="text">废弃</el-button>-->
            </div>
          </div>
          <div class="print_list clearfix">
            <!--            <div class="print_times">{{item.rule.name}}/{{item.rule.ruleId}}-{{item.rule.name}}/{{item.tag.tagNo}}-{{item.tag.name}}/{{item.name}}</div>-->
            <div class="print_times">
              <span v-if="item.company">{{ item.company.name }} /</span>
              <span v-if="item.school">{{ item.school.name }} /</span>
              <span v-if="item.name">{{ item.name }}</span></div>

            <div class="print_file clearfix">
              <div :key="packs.graphPackId" class="print_zip" v-for="packs in item.graphPacks">
                <span v-if="canUse.product">
                  <el-button @click="downloadZip(packs)" type="text" v-if="!packs.exporting"><span style="font-size: 12px;">Zip文件 </span></el-button>
                  <el-button type="text" v-if="packs.exporting"><span style="font-size: 12px;"><i class="el-icon-loading"></i>下载中...</span></el-button>
                </span>
                <span v-else><el-button :disabled="true" type="text"><span style="font-size: 12px;">Zip文件 </span></el-button></span>
                <!--<el-button @click="downloadZip(scope.row)" class="addUser" size="small" type="text" v-if="!packs.exporting">下载</el-button>-->
                <!--<el-button class="addUser" disabled icon="el-icon-loading" size="small" type="text" v-if="packs.exporting">下载中...</el-button>-->
                <span v-if="packs.name">{{ packs.name }}</span> / {{ packs.download }} 次
              </div>
            </div>

            <div class="point_status">
              <div v-if="item.process==='prepared'">
                <el-progress :percentage="parseInt(item.rate * 100)" type="circle"></el-progress>
              </div>
              <div class="point_deleted" v-if="item.process==='deleted'"><i class="el-icon-delete"></i>已废弃</div>
              <div class="point_success" v-if="item.process==='printed'"><i class="el-icon-circle-check"></i></div>
              <div class="point_wrong" v-if="item.process==='suspend'">
                <el-popover
                  :content="item.reason"
                  placement="right-start"
                  title="错误信息"
                  trigger="hover"
                  width="300">
                  <div slot="reference" style="cursor: pointer;">服务器出错 <i class="el-icon-circle-close"></i></div>
                </el-popover>
              </div>
            </div>
          </div>

        </div>
        <!-- 表格-->
        <div class="table">
          <!--                    <el-table-->
          <!--                      :data="printList"-->
          <!--                      :default-expand-all="false"-->
          <!--                      :tree-props="{children: 'packList', hasChildren: 'hasChildren'}"-->
          <!--                      class="table-gary-bg"-->
          <!--                      ref="table"-->
          <!--                      row-key="graphPrintId">-->
          <!--                      <el-table-column-->
          <!--                        label=" 文件"-->
          <!--                        min-width="110"-->
          <!--                        prop="name">-->
          <!--                        <template slot-scope="scope">-->
          <!--                          <span>{{scope.row.name}} </span>-->
          <!--                        </template>-->
          <!--                      </el-table-column>-->
          <!--                      <el-table-column-->
          <!--                        prop="name"-->
          <!--                        width="60">-->
          <!--                        <template slot-scope="scope">-->
          <!--                          <span v-if="scope.row.packFile">{{scope.row.download}}次</span>-->
          <!--                        </template>-->
          <!--                      </el-table-column>-->
          <!--                      <el-table-column-->
          <!--                        label=""-->
          <!--                        min-width="120"-->
          <!--                        prop="created">-->
          <!--                        <template slot-scope="scope">-->
          <!--                          {{scope.row.created | dateFormat}}-->
          <!--                        </template>-->
          <!--                      </el-table-column>-->
          <!--                      <el-table-column-->
          <!--                        label=""-->
          <!--                        prop="createName">-->
          <!--                        <template slot-scope="scope">-->
          <!--                          <span v-if="scope.row.manager">{{scope.row.manager.name}}</span>-->
          <!--                        </template>-->
          <!--                      </el-table-column>-->
          <!--                      <el-table-column-->
          <!--                        label=""-->
          <!--                        prop="qrCounts"-->
          <!--                        width="90">-->
          <!--                        <template slot-scope="scope">-->
          <!--                          <span v-if="scope.row.qrCounts">{{scope.row.qrCounts}} 个</span>-->
          <!--                        </template>-->
          <!--                      </el-table-column>-->
          <!--                      <el-table-column-->
          <!--                        label=""-->
          <!--                        prop="count"-->
          <!--                        width="70">-->
          <!--                        <template slot-scope="scope">-->
          <!--                          <span v-if="scope.row.count">{{scope.row.count}} 版</span>-->
          <!--                        </template>-->
          <!--                      </el-table-column>-->
          <!--                      <el-table-column-->
          <!--                        label="状态"-->
          <!--                        prop="process">-->
          <!--                        <template slot-scope="scope">-->
          <!--                          <span v-if="scope.row.process === 'prepared'">-->
          <!--                              <el-progress :percentage="parseInt(scope.row.rate * 100)" type="circle"></el-progress>-->
          <!--                          </span>-->
          <!--                          <span v-if="scope.row.process === 'printed'">打印完成</span>-->
          <!--                        </template>-->
          <!--                      </el-table-column>-->
          <!--                      <el-table-column-->
          <!--                        align="center"-->
          <!--                        label="操作"-->
          <!--                        width="80">-->
          <!--                        <template slot-scope="scope">-->
          <!--                          <div v-if="!scope.row.packFile && scope.row.process === 'printed'">-->
          <!--                            <el-button @click="toogleExpand(scope.row)" type="text" v-if="!scope.row.icon"><i class="el-icon-arrow-right"></i></el-button>-->
          <!--                            <el-button @click="toogleExpandTwo(scope.row)" type="text" v-if="scope.row.icon"><i class="el-icon-arrow-down"></i></el-button>-->
          <!--                          </div>-->
          <!--                          <div style="margin-right: 10px" v-if="scope.row.packFile">-->
          <!--                            <el-button @click="downloadZip(scope.row)" class="addUser" size="small" type="text" v-if="!scope.row.exporting">下载</el-button>-->
          <!--                            <el-button class="addUser" disabled icon="el-icon-loading" size="small" type="text" v-if="scope.row.exporting">下载中...</el-button>-->
          <!--                          </div>-->
          <!--                        </template>-->
          <!--                      </el-table-column>-->
          <!--                    </el-table>-->
        </div>
      </div>

      <div class="show_table_img ">
        <div class="img_info" v-if=" graphType === 'normal'">{{ px2cm(ImgWidth, { digital: 2 }) }} x {{ px2cm(ImgHeight, { digital: 2 }) }} cm</div>
        <div class="showRecordImg"><img :src="isShowGraphImg" alt=""></div>
      </div>

    </div>

    <div class="show_img" v-if="printList.length  <= 0">
      <!--      <div class="show fr" v-if="printList.length  <= 0"  showRecord>-->
      <div class="show ">
        <div :class=" drawer ? 'showRecord' : 'showRecordDrawer' ">
          <div class="img_info" v-if="ImgWidth && ImgHeight">{{ px2cm(ImgWidth, { digital: 2 }) }} x {{ px2cm(ImgHeight, {digital:2}) }} cm</div>
          <div class="img_info" v-else>1000 x 1000 px</div>
          <img :src="isShowGraphImg" alt="">
        </div>
      </div>
    </div>

    <div class="product_print">
      <el-tooltip class="item item_dark" content="生成打印图操作模块" effect="dark" placement="left">
        <div @click="drawer = true" class="show-el-drawer" v-show="!drawer"><i class="el-icon-arrow-right"></i></div>
      </el-tooltip>
      <div @click="drawer = false" class="close-el-drawer" v-show="drawer"><i class="el-icon-arrow-left"></i></div>
      <el-drawer
        :modal="false"
        :show-close="false"
        :visible.sync="drawer"
        direction="ltr"
        size="20%"
        title="">
        <div class="edit">
          <div class="product_form">
            <el-form :model="QRForm" :rules="rules" label-position="top" label-width="80px" ref="QRForm" size="mini">
              <el-form-item label="生成标签版数" prop="count" style="margin-bottom: 0;">
                <el-input-number :controls="false" :min="1" style="width: 220px;" v-model="QRForm.count"></el-input-number>
              </el-form-item>
              <div class="product_popover">
                <div class="product_num">标签总数:
                  <span v-if="QRForm.count">{{ QRForm.count * NumberPerEdition }}
                    <el-popover
                      content="每板标签数量 * 板数"
                      placement="right"
                      trigger="hover"
                      width="200">
                    <i class="el-icon-warning-outline" slot="reference"></i>
                  </el-popover>
                  </span>
                  <span v-else>0
                    <el-popover
                      content="每板标签数量 * 板数"
                      placement="right"
                      trigger="hover"
                      width="200">
                <i class="el-icon-warning-outline" slot="reference"></i>
              </el-popover>
                  </span>
                </div>
              </div>
              <el-form-item label="模板名称 ">
                <p style="color:rgba(153,153,153,1);line-height:18px;">{{ name }}</p>
              </el-form-item>
              <el-form-item label="所属类型 ">
                <p style="color:rgba(153,153,153,1);line-height:18px;"><span v-if="QRForm.ruleId">{{ QRForm.ruleId }} /</span> <span v-if="rule.name">{{ rule.name }}</span></p>
              </el-form-item>
              <el-form-item label="所属企业 ">
                <!--                <p style="color:rgba(153,153,153,1);line-height:18px;">{{tag.tagNo}} / {{tag.name}}</p>-->
                <p style="color:rgba(153,153,153,1);line-height:18px;"><span v-if="company.companyNo"></span> {{ company.companyNo }} / <span v-if="company.name">{{ company.name }}</span></p>
              </el-form-item>
              <el-form-item label="所属学校 ">
                <p style="color:rgba(153,153,153,1);line-height:18px;"><span v-if="school.schoolNo">{{ school.schoolNo }} / </span> <span v-if="school.name">{{ school.name }}</span></p>
              </el-form-item>
              <el-form-item label="设计备注 :">
                <p class="product_disc" v-if="remark">{{ remark }}</p>
                <p class="product_disc" v-else>--</p>
              </el-form-item>
            </el-form>
          </div>
          <div class="createBtn">
            <el-row>
              <el-col :span="12">
                <!-- <el-button @click="downloadZipAi" size="small" type="primary" v-if="isDownloadZipAi">下载刀板图</el-button>-->
                <!-- <el-button class="addUser" disabled icon="el-icon-loading" size="small" type="primary" v-if="!isDownloadZipAi">下载中...</el-button>-->
              </el-col>
              <el-col :span="12">

                <el-button @click="createQrPrint" size="small" type="primary" v-if="canUse.product">生成</el-button>
                <el-button :disabled="true" size="small" type="primary" v-else>生成</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-drawer>
      <!--      <div @click="drawer = false" class="close-el-drawer"><i class="el-icon-arrow-left"></i></div>-->
    </div>
  </div>
</template>

<script lang="ts">

import { ElForm } from 'element-ui/types/form'
import { ElTable } from 'element-ui/types/table'
import Vue from 'vue'
import uCgi from '~/app/@biz/uCgi'
import uHelper from '~/app/@biz/uHelper'
import uPassport from '~/app/@biz/uPassport'
import config from '~/config'

const { oss2image, showTime } = uHelper

const Big = require('big.js')

//big算法 乘
function bigTimes (x: any, y: any) {
  return Number(new Big(x).times(y).toFixed(6))
}

//big算法 除
function bigDiv (x: any, y: any) {
  return Number(new Big(x).div(y).toFixed(5))
}

function px2cm (px: number, options: { digital?: number, dpi?: number } = { dpi: 500, digital: 5 }) {
  const { dpi = 500, digital = 5 } = options
  return Number(bigTimes(bigDiv(px, dpi), 2.54).toFixed(digital))
}

export default Vue.extend({
  layout: 'default_detail',

  data () {
    return {
      canUse: {
        product: uPassport.checkRole('map.master,map.hr,map.owner,map.market,map.market.design,map.maker,map.maker.worker'),
        discard: uPassport.checkRole('map.master,map.hr,map.owner,map.maker')
      },
      graphId: '',
      ImgHeight: '200',
      ImgWidth: '100',
      aiPath: '',
      isDownloadZipAi: true,
      drawer: true,
      graphType: '',
      //每版数量
      NumberPerEdition: '',
      setIntervalProcess: '',
      isShowGraphImg: '',
      OssImg: config.imageBase,
      isRecord: false,
      ruleList: [],
      QRForm: {
        count: '',
        ruleId: '',
      },
      name: '',
      remark: '',
      rule: {},
      company: {},
      school: {},

      printList: [],

      //所属规则
      options: [
        {
          label: '智能校服',
          value: 'Smart school uniform'
        },
        {
          label: 'ladySmile',
          value: 'ladySmile'
        }
      ],
      rules: {
        count: [
          { required: true, message: '请输入打印版数', trigger: 'blur' },
        ],
        QRRule: [
          { required: true, message: '请选择规则', trigger: 'change' }
        ]
      },
    }
  },

  async asyncData ({ params }) {
    const graphId = params.id || {}

    const result = await uCgi.GraphPrintSelect({ graphId: graphId })
    const resultBody = result.body || {}
    const printList = resultBody.list || []
    const drawer = printList.length <= 0

    return {
      graphId,
      printList,
      drawer
    }
  },
  filters: {
    dateFormat: (value: number) => {
      return uHelper.dateFormat(value, 'YYYY-MM-DD HH:mm:ss')
    }
  },
  //mounted，获取数据
  async mounted () {
    const result = await uCgi.GraphDetail({ graphId: this.graphId })
    // console.log('GraphDetail', result)

    const resultBody = result.body || ''
    await this.renderList()
    if (result.code === 200) {
      this.name = resultBody.name || ''
      this.remark = resultBody.remark || ''
      //客户和类型
      this.rule = resultBody.rule || {}

      this.company = resultBody.company || {}
      this.school = resultBody.school || {}

      this.graphType = resultBody.type || ''

      this.QRForm.ruleId = resultBody.ruleId
      this.isShowGraphImg = oss2image(resultBody.preview, 'ci0')
      this.NumberPerEdition = resultBody.qrs.length
      this.ImgHeight = resultBody.height
      this.ImgWidth = resultBody.width
      this.aiPath = resultBody.source
    }
  },

  methods: {
    showTime,
    oss2image,
    px2cm,

    //获取数据
    async renderList () {
      const printList = await uCgi.GraphPrintSelect({ graphId: this.graphId })
      this.printList = printList.body.list || []
      if (printList.body.printing) {
        setTimeout(() => this.renderList(), 3000)
      }
    },

    //确认打印+数量
    createQrPrint () {
      const data = {
        graphId: this.graphId,
        count: this.QRForm.count,
        ruleId: this.QRForm.ruleId,
      }
      const elForm = this.$refs['QRForm'] as ElForm
      elForm.validate(async (valid) => {
        if (valid) {
          this.drawer = false
          const result = await uCgi.GraphPrint(data)
          if (result.code === 200) {
            const printList = await uCgi.GraphPrintSelect({ graphId: this.graphId })
            if (printList.code === 200) {
              this.printList = printList.body.list || []
              // console.log('printList', printList)
              const time = result.body.print.timeRequire / 1000
              this.$message({
                type: 'success',
                message: `后台正在打印中，预估需要${this.showTime(time)}`
              })
              await this.renderList()
            }
          } else {
          }
        } else {
          return false
        }
      })

    },

    //downloadZip-下载
    downloadZip (packs: any) {
      this.$set(packs, 'exporting', true)
      window.location.href = `${this.OssImg}${packs.file}`

      setTimeout(async () => {
        const printDownload = await uCgi.GraphPackDownload({ graphPackId: packs.graphPackId })
        const printList = await uCgi.GraphPrintSelect({ graphId: this.graphId })
        this.printList = printList.body.list || []

        this.$set(packs, 'exporting', false)
      }, 3000)

    },

    //downloadZipAi-下载刀板图
    downloadZipAi () {
      this.isDownloadZipAi = false
      window.location.href = `${this.OssImg}${this.aiPath}`
      let timeOutId = setTimeout(() => {
        this.isDownloadZipAi = true
      }, 5000)
    },

    //废弃
    discard (graphPrintId: string) {
      console.log('废弃', graphPrintId)
    },
    toogleExpand (row: any) {
      this.$set(row, 'icon', true)
      // console.log(row, '---')
      let $table = this.$refs['table'] as ElTable
      $table.toggleRowExpansion(row)
      row.icon = true
    },
    toogleExpandTwo (row: any) {
      this.$set(row, 'icon', true)
      // console.log(row, '---')
      let $table = this.$refs['table'] as ElTable
      $table.toggleRowExpansion(row)
      row.icon = false
    }
  }
})
</script>


<style lang="scss">

.product_k {
  border-color: #F0F2F5;
  position: relative;

  .product_print {
    .el-dialog__wrapper {
      z-index: 2039 !important;
    }

    .show-el-drawer {
      position: absolute;
      top: 300px;
      left: -1px;
      width: 26px;
      height: 90px;
      background: #409eff;
      box-shadow: 8px 0 18px 0 rgba(153, 153, 153, 0.3);
      border-radius: 0 8px 8px 0;
      transform: perspective(100px) rotateY(30deg);

      .el-icon-arrow-right {
        color: rgba(250, 250, 250, 1);
        padding-left: 6px;
        text-align: center;
        line-height: 90px;
      }
    }

    @keyframes closeIcon {
      0% {
        left: 0;
      }
      100% {
        left: 299px;
      }
    }

    .close-el-drawer {
      position: absolute;
      top: 300px;
      left: 0;
      width: 26px;
      height: 90px;
      background: rgba(250, 250, 250, 1);
      box-shadow: 8px 0 18px 0 rgba(153, 153, 153, 0.3);
      border-radius: 0 8px 8px 0;
      z-index: 999999;
      transform: perspective(100px) rotateY(30deg);
      animation: closeIcon 225ms cubic-bezier(0, 0, .2, 1) 0s forwards;

      .el-icon-arrow-left {
        color: #409eff;
        padding-left: 6px;
        text-align: center;
        line-height: 90px;
      }
    }

  }

  .show_img {

    .show {
      width: 100%;
      height: calc(100vh - 64px);;
      min-height: 800px;
      background: rgba(240, 242, 245, 1);
      position: relative;
      min-width: 1200px;
      padding-top: 50px;
      padding-left: 300px;

      .showRecord {
        position: absolute;
        left: 50%;
        transform: translateX(-30%);

        .img_info {
          padding: 0 10px;
          /*width: 124px;*/
          height: 32px;
          background: rgba(24, 144, 255, .1);
          border-radius: 2px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(24, 144, 255, 1);
          text-align: center;
          line-height: 32px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: -40px;
          white-space: nowrap;
        }

        img {
          height: calc(100vh - 160px);
          min-height: 500px;

        }
      }

      .showRecordDrawer {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);

        .img_info {

          padding: 0 10px;
          height: 32px;
          background: rgba(24, 144, 255, .1);
          border-radius: 2px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(24, 144, 255, 1);
          text-align: center;
          line-height: 32px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: -40px;
          white-space: nowrap;
        }

        img {
          height: calc(100vh - 150px);
          min-height: 500px;

        }
      }

      .showImg {
        /*width: 426px;*/
        /*height: 426px;*/
        /*background-color: papayawhip;*/
        margin-top: 30px;
        position: absolute;
        left: 50%;
        transform: translateX(-20%);

        img {
          height: calc(100vh - 450px);
          min-height: 300px;
          /*height: calc(100vh - 400px);*/

        }
      }

    }
  }

  .show_list {
    background-color: #F0F2F5;

    .show_table {
      width: 60%;
      min-height: 860px;
      background-color: #FFF;
      padding: 16px;

      .product_list {
        margin-bottom: 16px;

        .product_info {
          width: 100%;
          height: 40px;
          background: rgba(248, 248, 248, 1);
          border: 1px solid rgba(242, 242, 242, 1);
          padding: 0 16px;

          .info {
            float: left;
            line-height: 40px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);

            &.info_time {
              width: 32%;
            }

            &.info_name {
              width: 22%;
            }

            &.info_group {
              width: 16%;

            }

            &.info_number {
              width: 16%;

            }

            &.info_btn {
              float: right;

              .el-button.el-button--text {
                font-size: 12px;
                font-weight: 400;
                color: rgba(243, 187, 69, 1);

                &.is-disabled {
                  color: #C0C4CC;
                }
              }
            }

          }

        }

        .print_list {
          width: 100%;
          height: 100%;
          border: 1px solid rgba(242, 242, 242, 1);
          border-top: none;
          padding: 16px;
          position: relative;

          .print_times {
            width: 70%;
            font-size: 14px;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 16px;
            margin-bottom: 16px;
          }

          .print_file {
            width: 75%;

            .print_zip {
              height: 24px;
              font-size: 12px;
              font-weight: 400;
              color: rgba(102, 102, 102, 1);
              line-height: 24px;
              padding: 0 10px;
              float: left;

              span {
                color: rgba(24, 144, 255, 1);
                /*cursor: pointer;*/
              }
            }

          }

          .point_status {
            padding: 16px;
            width: 20%;
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;

            .el-progress.el-progress--circle {
              float: right;
              width: 34px;
              height: 34px;
              vertical-align: middle;

              .el-progress-circle {
                width: 34px !important;
                height: 34px !important;
              }

              .el-progress__text {
                font-size: 12px !important;
              }
            }

            .point_success {
              text-align: right;

              .el-icon-circle-check {
                font-size: 18px;
                color: #6DD401;
              }
            }

            .point_deleted {
              text-align: right;
              color: #E6A23C;

              .el-icon-delete {
                font-size: 18px;
                color: #E6A23C;
              }
            }

            .point_wrong {
              font-size: 14px;
              color: #F84F51;
              text-align: right;

              .el-icon-circle-close {
                font-size: 18px;
                vertical-align: text-bottom;
                color: #F84F51;
              }
            }

          }

        }
      }

      .table {

        /*.el-table.table-gary-bg.el-table--fit.el-table--fluid-height.el-table--enable-row-hover.el-table--enable-row-transition {*/
        /*  */
        /*  max-height: 800px!important;*/
        /*}*/

        .el-table, .el-table__expanded-cell {
          background-color: #FAFBFC;
        }

        .el-table .cell, .el-table th div {
          padding-left: 24px;
          padding-right: 4px;
        }

        .el-table [class*=el-table__row--level] .el-table__expand-icon {
          display: none;
        }

        .el-table [class*=el-table__row--level] .el-table__expand-icon {
          margin-left: 20px;
        }

        .table-gary-bg {

          th {
            font-size: 12px;
            background-color: #fafafa;
            height: 48px;
          }

          .tr {

          }
        }
      }

    }

    .show_table_img {
      position: absolute;
      right: 5%;
      top: 80px;
      width: 30%;

      .img_info {
        padding: 0 10px;
        height: 32px;
        background: rgba(24, 144, 255, .1);
        border-radius: 2px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(24, 144, 255, 1);
        text-align: center;
        line-height: 32px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: -50px;
        white-space: nowrap;
      }

      .showRecordImg {

        img {
          width: 100%;
          /*height: calc(100vh - 150px);*/
        }
      }

    }
  }

}

.el-drawer__wrapper {
  z-index: 2038 !important;

  .el-drawer__container.el-drawer__open {
    .el-drawer {
      box-shadow: 0 2px 28px 2px rgba(0, 0, 0, .12);
    }

    .el-drawer.ltr {
      position: relative;
      width: 300px !important;

      .el-drawer__header {
        padding: 0;
        margin-bottom: 0;
        background: rgba(250, 250, 250, 1);
      }

      .el-drawer__body {
        .edit {
          height: 100%;
          background: rgba(250, 250, 250, 1);

          .product_form {
            padding: 80px 40px 0 40px;

            .el-input__inner {
              text-align: left;
            }

            .el-form-item__error {
              padding-top: 4px;
            }

            .el-form-item.el-form-item--mini {
              margin-bottom: 26px;
            }

            .el-form-item__label {
              padding: 0;
              line-height: 30px;
            }

            .el-form-item__content {
              width: 80%;

              .el-input {
                .el-input__inner {
                  border-radius: 2px;
                }
              }
            }

            .product_popover {

              .product_num {
                margin-top: 4px;
                font-weight: 400;
                font-size: 14px;
                color: #333;
                line-height: 40px;
                padding: 0 12px 0 0;

                span {
                  position: relative;

                  .el-icon-warning-outline.el-popover__reference {
                    color: #ff4500;
                    position: absolute;
                    top: 2px;
                    left: 6px;
                  }
                }
              }
            }

            .product_disc {
              width: 220px;
              height: 72px;
              font-size: 13px;
              /*text-indent: 26px;*/
              font-weight: 400;
              color: rgba(102, 102, 102, 1);
              line-height: 18px;
            }

          }

          .createBtn {
            position: absolute;
            text-align: center;
            width: 300px;

            bottom: 30px;

            .el-button.el-button--primary.el-button--small {
              width: 100px;
              height: 32px;
              border-radius: 2px;
            }
          }

          .download_zip {
            padding: 0 10px 0 20px;

            .zip {
              font-size: 10px;
              cursor: pointer;

              &:hover {
                color: #1890FF;
              }
            }

          }

        }

      }

      .close-el-drawer {
        z-index: 2100;
        position: absolute;
        right: -10px;
        top: 230px;
        width: 22px;
        height: 90px;
        background: rgba(250, 250, 250, 1);
        box-shadow: 8px 0 16px 0 rgba(153, 153, 153, 0.2);
        border-radius: 0 8px 8px 0;

        .el-icon-arrow-left {
          color: #409eff;
          padding-left: 4px;
          text-align: center;
          line-height: 90px;
        }

      }

    }

  }
}

@keyframes tooltipDark {
  50% {
    left: 20px;
  }
  100% {
    left: 30px;
  }
}

.el-tooltip__popper.is-dark {
  margin-left: 20px;
  width: 164px;
  height: 52px;
  text-align: center;
  font-size: 14px;
  line-height: 30px;
  background: #1890FF;
  box-shadow: 0 2px 14px 0 rgba(153, 153, 153, 0.3);

  animation-name: tooltipDark; /*动画的名称*/
  animation-duration: 1.2s; /*动画时间*/
  animation-fill-mode: both; /*播放后的状态*/
  animation-iteration-count: infinite; /*动作循环的次数：infinite 无限循环*/

  .popper__arrow {
    border-right-color: #1890FF !important;
  }
}

.el-tooltip__popper[x-placement^=right] .popper__arrow::after {
  border-right-color: #1890FF !important;
}


</style>
