<template>
  <div class="graph-detail-ui clearfix">

    <div class="operation">
      <el-form :model="graphForm" label-position="top" label-width="80px" size="mini">
        <el-form-item :rules="{ required: true, message: '输入模版类型名称', trigger: 'blur' }" label="模板名称" prop="name">
          <el-input placeholder="请输入模板名称" v-model="graphForm.name"/>
        </el-form-item>
        <el-form-item :rules="{ required: true, message: '请选择所属类型', trigger: 'blur' }" label="二维码类型" prop="ruleId">
          <el-select filterable placeholder="请选择二维码类型" style="width: 200px;" v-model="graphForm.ruleId">
            <el-option
              :key="item.ruleId"
              :label="item.name +'（'+ item.ruleId +'）'"
              :value="item.ruleId"
              v-for="item in ruleList">
            </el-option>
          </el-select>

        </el-form-item>

        <el-form-item :rules="{ required: true, message: '请选择所属企业', trigger: 'blur' }" label="所属企业" prop="companyId">
          <el-select @change="changeCompanyHandle" filterable placeholder="请选择所属客户" style="width: 200px;" v-model="graphForm.companyId">
            <el-option
              :key="item.companyId"
              :label="item.name"
              :value="item.companyId"
              v-for="item in companyList">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :rules="{ required: true, message: '请选择所属学校', trigger: 'blur' }" label="所属学校" prop="schoolId">
          <el-select clearable filterable placeholder="请选择所属客户" style="width: 200px;" v-model="graphForm.schoolId">
            <el-option
              :key="item.schoolId"
              :label="item.name"
              :value="item.schoolId"
              v-for="item in companySchoolList">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="备注" prop="desc">
          <el-input :autosize="{minRows: 1, maxRows: 4 }" placeholder="请填写备注" type="textarea" v-model="graphForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="分辨率" prop="AiRate">
          <el-input disabled placeholder="请输入分辨率" v-model="graphForm.dpi"></el-input>
        </el-form-item>
      </el-form>
      <div class="graph_line"></div>

      <div class="graph_line"></div>
      <div class="graph_operation">
        <el-row>
          <el-col :span="8">
            <div @click="dialogVisibleAi = true">
              <img alt="" class="icon_img" src="../../../../../app/assets/image/upload.png">
              <p class="graph_operation_name">上传底版图</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div @click="cancel">
              <img alt="" class="icon_img" src="../../../../../app/assets/image/back.png">
              <p class="graph_operation_name">撤销</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div @click="open">
              <img alt="" class="icon_img" src="../../../../../app/assets/image/right.png">
              <p class="graph_operation_name">恢复</p>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div @click="addQr">
              <img alt="" class="icon_img" src="../../../../../app/assets/image/QR.png">
              <p class="graph_operation_name">添加二维码</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div @click="open">
              <img alt="" class="icon_img" src="../../../../../app/assets/image/title.png">
              <p class="graph_operation_name">添加文字</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div @click="deleteQr">
              <img alt="" class="icon_img" src="../../../../../app/assets/image/delete.png">
              <p class="graph_operation_name">删除</p>
            </div>
          </el-col>
        </el-row>
        <div class="zoom">
          <div class="block">
            <el-slider :format-tooltip="formatTooltip" :max="2" :step="0.01" :min="minRate" :show-tooltip="false" v-model="rate"></el-slider>
            <span class="demonstration">缩放</span>
          </div>
        </div>
      </div>
      <div class="graph_view">
        <el-button @click="graphView" element-loading-background="rgba(0, 0, 0, 0.8)" element-loading-text="合成中···" size="small" type="primary" v-if="canUse.graphDesign" v-loading.fullscreen.lock="fullscreenLoading">保存并预览</el-button>
        <el-button :disabled="true" element-loading-background="rgba(0, 0, 0, 0.8)" element-loading-text="合成中···" size="small" type="primary" v-else v-loading.fullscreen.lock="fullscreenLoading">保存并预览</el-button>
        <el-button @click="graphDelete" class="graph_delete" type="text" v-if="canUse.delete">删除</el-button>
        <el-button :disabled="true" class="graph_delete" type="text" v-else>删除</el-button>
      </div>
    </div>

    <div class="exhibition QR_view" id="workflow-view">
      <div class="exhibition_img" ref="graphTable">
        <div :style="`width: ${_box[0]}px;height: ${_box[1]}px`" class="graph-bg " ref="bg">
          <img :src="graphImg" alt="" draggable="false" style="width: 100%;position: relative">
          <template v-for="(qr ,index) in qrs" v-if="qrs.length>0">
            <!--            :isResizable="isResizable"-->
            <!--        :is="isDiv?'div':'VueDragResize'"-->
            <div :aspectRatio="true" :gridX="20" :gridY="20" :h="_qrs[index][2]"
                 :is="isDiv?'div':'VueDragResize'" :isActive="qrActive===index" :isDraggable="isDraggable" :minh="1" :minw="1" :parentH="_box[1]" :parentLimitation="true" :parentW="_box[0]"
                 :preventActiveBehavior="false" :snapToGrid="true" :style="isDiv?`left:${_qrs[index][0]}px;top:${_qrs[index][1]}px;width:${_qrs[index][2]}px;height:${_qrs[index][2]}px;`:''" :w="_qrs[index][2]" :x="_qrs[index][0]" :y="_qrs[index][1]"
                 @activated="onActivated(index)"
                 @deactivated="onDeActivated(index)" @dragstop="dragStop(index,$event)" @resizestop="resizeStop(index,$event)" class="vue-qrs-resize">
              <q-r-code :color="qrs[index][3]" :logo-info="{path:qrs[index][4],width:qrs[index][5]/qrs[index][2]*100}"></q-r-code>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="exhibition_QR">
      <div class="QR_one">
        <p>二维码</p>
        <!--v-if="qrs.length === 2" -->
        <div>
          <div class="graph_line"></div>
          <div class="ranks">
            <el-row :gutter="24">
              <el-col :span="7">
                <span class="ranks_icon_C">C</span>
                <el-input-number :controls="false" :min="0" placeholder="" size="mini" style="width: 80px;" v-model="ranksForm.R"></el-input-number>
              </el-col>
              <el-col :span="7">
                <span class="ranks_icon_R">R</span>
                <el-input-number :controls="false" :min="0" placeholder="" size="mini" style="width: 80px;" v-model="ranksForm.C"></el-input-number>
              </el-col>
              <el-col :span="8">
                <el-button :disabled="ranksForm.R ==='' || ranksForm.C ==='' || qrs.length !== 2 " @click="typesetting" size="mini" type="primary">一键生成</el-button>
              </el-col>
            </el-row>
            <p class="plus_title">输入行列，点击按钮自动生成排版</p>
          </div>
          <div class="graph_line"></div>
        </div>
        <!-- logo-->
        <div class="QRTwo" v-if="qrs.length>0">
          <p>二维码{{ qrActive + 1 }}</p>
          <el-row :gutter="24">
            <el-col :span="10" class="ranks_icon_WH_width">
              <span class="ranks_icon_WH">W/H</span>
              <el-input-number  @input="handleInput(2,$event)"  :controls="false" :disabled="qrs[qrActive][6] === 1" :min="0.00001" :precision="5" size="mini" style="width: 100px;" v-model="cmQrs[qrActive][2]"></el-input-number>
            </el-col>
            <el-col :span="10" class="ranks_icon_WH_width">
              <el-color-picker :disabled="qrs[qrActive][6] === 1" class="ranks_icon_Hex_picker" size="mini" v-model="qrs[qrActive][3]"></el-color-picker>
              <el-input :disabled="qrs[qrActive][6] === 1" placeholder="" size="mini" v-model="qrs[qrActive][3]"></el-input>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="10">
              <span class="ranks_icon_X">X</span>
              <el-input-number  @input="handleInput(0,$event)"  :controls="false" :disabled="qrs[qrActive][6] === 1" :min="0.00001" :precision="5" size="mini" style="width: 100px;" v-model="cmQrs[qrActive][0]"></el-input-number>
            </el-col>
            <el-col :span="10">
              <span class="ranks_icon_Y">Y</span>
              <el-input-number  @input="handleInput(1,$event)"  :controls="false" :disabled="qrs[qrActive][6] === 1 " :min="0.00001" :precision="5" size="mini" style="width: 100px;" v-model="cmQrs[qrActive][1]"></el-input-number>
            </el-col>
          </el-row>
          <div class="graph_line"></div>
          <div v-if="qrs.length>0">
            <p style="margin: 6px 0">logo{{ qrActive + 1 }}</p>

            <el-row :gutter="24">
              <el-col :span="10" class="logo_ranks_icon_WH_width " v-if=" qrs[qrActive][4] !== ''">
                <!--  <el-col :span="10" class="logo_ranks_icon_WH_width " v-if=" qrs[qrActive][4] !=='' ">-->
                <span class="logo_ranks_icon_WH">W/H</span>
                <!--  :disabled="qrs[qrActive][6] === 1 "   :disabled="qrs[qrActive][4] !== '' "          <el-input :disabled="qrs[qrActive][6] === 1 " placeholder="" size="mini" v-model="qrs[qrActive][5]"></el-input>-->
                <el-input-number @input="handleInput(5,$event)" :controls="false" :disabled="qrs[qrActive][6] === 1" :min="0.00001" controls-position="right" size="mini" v-model="cmQrs[qrActive][5]"></el-input-number>
              </el-col>

              <el-col :span="10" style="margin-bottom: 0">
                <el-upload
                  :action="uploaderSign.host"
                  :before-upload="beforeAvatarUploadLogo"
                  :data="uploaderData"
                  :disabled=" authRole==='map.maker' || authRole==='map.maker.worker' || qrs[qrActive][6] === 1 "
                  :on-error="uploadErrorLogo"
                  :on-success="handleAvatarSuccessLogo"
                  :show-file-list="false"
                  class="upload-demo ">
                  <!-- <el-button style="width: 26px;height: 26px"  size="mini">+</el-button>-->
                  <el-button :class="qrs[qrActive][4] === '' ? 'btn_type_upload_logo' : 'btn_type_upload' " :disabled="authRole==='map.maker' || authRole==='map.maker.worker' || qrs[qrActive][6] === 1 "
                             :style="qrs[qrActive][6] === 1 ? 'background-color:#F5F7FA;color: #C0C4CC;border-color: #E4E7ED;' : '' " size="mini" type="primary"><span>+上传logo</span></el-button>
                  <p class="plus_title">注：jpg/png格式</p>
                </el-upload>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>

      <div class="QR_list" v-if="qrs[qrActive]">
        <div :class="isSelect===index?'QR_title active':'QR_title'" @click="changeQRList(index)" ref="QRTitle" v-for="(item,index) in qrs">
          <div class="QR_img fl">
            <q-r-code-list :color="`${item[3]}`" :logo-info="{path:qrs[index][4],width:'10'}"></q-r-code-list>
          </div>
          <span class="title">二维码{{ index + 1 }}</span>
          <span class="title fr" v-if="qrs[qrActive][6] === 1"><i class="el-icon-lock"></i></span>
        </div>
      </div>
    </div>
    <!--保存合成 -预览-->
    <div class="isShowImg">
      <el-dialog
        :before-close="handleClose"
        :visible.sync="dialogVisible"
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
    <!-- 重新上传-->

    <div class="list-dialog">
      <el-dialog
        :before-close="handleCloseAi"
        :visible.sync="dialogVisibleAi"
        center
        title="提示"
        width="24%">
        <div class="dialog_con">上传底版图将覆盖当前操作，是否继续上传？</div>
        <span class="dialog-footer" slot="footer">
           <div class="clearfix">
              <el-button @click="dialogVisibleAi = false" size="small" style="float: right;margin-right: 10%">取 消</el-button>
             <div style="float: left;margin-left: 10%">
                 <el-upload
                   :action="uploaderSign.host"
                   :before-upload="beforeAvatarUpload"
                   :data="uploaderData"
                   :disabled="authRole==='map.maker' || authRole==='map.maker.worker'"
                   :on-error="uploadError"
                   :on-success="handleAvatarSuccess"
                   :show-file-list="false"
                   class="upload-demo">
                <el-button :disabled="authRole==='map.maker' || authRole==='map.maker.worker'" element-loading-background="rgba(0, 0, 0, 0.8)" element-loading-text="底图更换中···" size="small" style="width: 110px;height: 32px;padding: 10px"
                           type="primary" v-loading.fullscreen.lock="fullscreenLoadingO">点击上传</el-button>
              </el-upload>
             </div>
          </div>
          </span>
      </el-dialog>
    </div>
    <!--logo弹框-->
  </div>
</template>

<script lang="ts">

import { ElUpload } from 'element-ui/types/upload'
import Vue from 'vue'
// @ts-ignore
import VueDragResize from 'vue-drag-resize'
import uCgi from '~/app/@biz/uCgi'
import uHelper from '~/app/@biz/uHelper'
import uPassport from '~/app/@biz/uPassport'
import QRCode from '~/app/components/QRCode.vue'
import QRCodeList from '~/app/components/QRCodeList.vue'
import config from '~/config'

const { oss2image } = uHelper

const Big = require('big.js')

//big算法 加
function bigPlus (x: any, y: any) {
  return Number(new Big(x).plus(y).toFixed(5))
}

//big算法 减
function bigMinus (x: any, y: any) {
  return Number(new Big(x).minus(y).toFixed(5))
}

//big算法 乘
function bigTimes (x: any, y: any, z?: boolean) {
  return Number(new Big(x).times(y).toFixed(5))
}

//big算法 除
function bigDiv (x: any, y: any) {
  return Number(new Big(x).div(y).toFixed(5))
}

//一键生成二维码
function getMoreQR (initPoint: any[], R: any, C: any, w1: any, h1: any) {
  const result = []
  // let lastPoint = initPoint
  for (let i = 0; i < C; i++) {
    for (let k = 0; k < R; k++) {
      const point = [bigPlus(initPoint[0], bigTimes(w1, k)), bigPlus(initPoint[1], bigTimes(h1, i)), initPoint[2], initPoint[3], initPoint[4], initPoint[5], 1]
      result.push(point)
    }
  }
  return result
  // while (true) {
  //   let point = [lastPoint[0] + w1, lastPoint[1], initPoint[2], initPoint[3], 1]
  //   if (point[0] > R * w1) point = [initPoint[0], lastPoint[1] + h1, initPoint[2], initPoint[3], 1]
  //   if (point[1] > C * h1) break
  //   result.push(point)
  //   lastPoint = point
  // }
}

function cm2px (cm: number, options: { digital?: number, dpc?: number } = { dpc: 500, digital: 5 }) {
  const { dpc = 500, digital = 5 } = options
  return parseFloat((cm * dpc).toFixed(digital))
}

function px2cm (px: number, options: { digital?: number, dpc?: number } = { dpc: 500, digital: 5 }) {
  const { dpc = 500, digital = 5 } = options
  return parseFloat((px / dpc).toFixed(digital))
}

//VueDragResize,
export default Vue.extend({
  layout: 'default_detail',
  components: {
    QRCode, QRCodeList, VueDragResize
  },

  data () {
    const passportData = uPassport.getPassportInfo()
    return {
      canUse: {
        graphDesign: uPassport.checkRole('map.master,map.hr,map.owner,map.market,map.market.design'),
        delete: uPassport.checkRole('map.master,map.hr,map.owner,map.market')
      },
      uploaderSign: { host: '' } as Dic<string>,
      uploaderData: {} as TUploaderData,
      authRole: passportData.role || 'none',
      saveQrs: [] as any[],
      isDraggable: true,
      isDiv: true,
      path: 'codeLogo',
      loading: false,
      graphId: '',
      isSelect: 0,
      ossImg: config.imageBase,
      dialogVisibleAi: false,
      fullscreenLoadingO: false,
      fullscreenLoading1: false,
      graphForm: {
        type: 'normal',
        name: '',
        graphId: '',
        companyId: '',
        schoolId: '',
        ruleId: '',
        remark: '',
        dpi: 500,
        sourceOrigin: '',
        weight: 100,
        status: 1,
      } as any,
      ruleList: [] as any[],

      ranksForm: {
        R: '',
        C: '',
      },

      qrLogo: {
        path: '',
        width: ''
      },

      QRTwoForm: {
        X: '',
        Y: '',
        WH: '',
        Hex: ''
      },

      companyList: [] as any[],
      schoolList: [] as any[],
      companySchoolList: [] as any[],

      dialogVisible: false,
      fullscreenLoading: false,
      graphImg: '',
      isShowGraphImg: '',
      qrs: [] as any[],
      qrActive: 0,
      box: [1200, 1200],
      rate: 100,
      points: [[0, 0], [10, 10], [20, 20]],
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
          { required: false, message: '请填写正确的规则', trigger: 'blur' },
          { pattern: /^(http:\/\/)|(https:\/\/)/, message: '请填写正确的HTTP链接格式', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '输入权重', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '输入规则描述', trigger: 'blur' }
        ]
      },
      minRate: 0
    }
  },

  async asyncData (query) {
    const graphId = query.params.id || ''

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
      ruleList,
      graphId
    }
  },

  //mounted，获取数据
  async mounted () {
    const graphId = this.graphId || ''
    const result = await uCgi.GraphDetail({ graphId: graphId })
    if (result.code === 200) {
      if (result.body.source !== '') {

        this.graphForm = {
          name: result.body.name,
          companyId: result.body.companyId,
          schoolId: result.body.schoolId,
          ruleId: result.body.ruleId,
          remark: result.body.remark,
          dpi: result.body.dpi,
          // source: result.body.source,
          weight: result.body.weight,
          graphId: this.graphId,
        }
        const currentCompanyId = result.body.companyId
        this.companySchoolList = this.schoolList.filter((v: any) => (v.companyId === currentCompanyId)) || []
        this.box[0] = result.body.width
        this.box[1] = result.body.height
        this.isShowGraphImg = result.body.source
        // this.graphImg = this.ossImg + result.body.source
        this.graphImg = this.oss2image(result.body.source, 'ci0')
        // console.log('this.graphImg', this.graphImg)

        await this.$nextTick()
        // this.rate = (this.$refs.graphTable.clientWidth) / this.box[0]

        this.initRate()
        this.minRate = this.rate / 2

        this.qrs = result.body.qrs.length > 0 ? result.body.qrs : []

        if (this.qrs[0] && this.qrs[0][6] && this.qrs[0][6] === 1) {
          this.isDraggable = false
        }

      }
    }

    // key('backspace,del,delete', () => {
    //   this.deleteQr()
    // })
  },

  //计算属性
  computed: {
    _qrs (): any {
      this.isDiv = true
      this.$nextTick(() => {this.isDiv = false})
      const r = this.rate || 0
      // console.log(this.qrs)
      return this.qrs.map(v => [
        bigTimes(v[0] || 0, r),
        bigTimes(v[1] || 0, r),
        bigTimes(v[2] || 0, r),
        v[3],
        v[4],
        bigTimes(v[5] || 0, r),
        v[6]
      ])
    },

    cmQrs (): any {
      this.isDiv = true
      this.$nextTick(() => {this.isDiv = false})
      return this.qrs.map(v => [
        px2cm(v[0] || 0),
        px2cm(v[1] || 0),
        px2cm(v[2] || 0),
        v[3],
        v[4],
        px2cm(v[5] || 0),
        v[6]
      ])
    },

    _box (): any {
      this.isDiv = true
      this.$nextTick(() => {this.isDiv = false})
      const r = this.rate || 0
      // console.log('this.r  box', r, this.box)
      return this.box.map(v => bigTimes(v, r, true))
    }
  },

  methods: {
    oss2image,

    initRate () {

      const element = document.getElementById('workflow-view') as HTMLElement
      const elementStyle = getComputedStyle(element) as any

      const keys = ['width', 'height', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']
      const [width, height, paddingTop, paddingRight, paddingBottom, paddingLeft] = keys.map(key => parseInt(elementStyle[key]))

      const realWidth = width - paddingLeft - paddingRight
      const realHeight = height - paddingTop - paddingBottom

      const boxWidth = this.box[0]
      const boxHeight = this.box[1]

      const rate1 = bigDiv(realWidth - 40, boxWidth || 1)
      const rate2 = bigDiv(realHeight - 40, boxHeight || 1)

      const rate = rate1 * boxWidth < realWidth && rate1 * boxHeight < realHeight ? rate1 : rate2

      this.rate = rate > 2 ? 2 : parseFloat(rate.toFixed(5))
    },

    async changeCompanyHandle (e: any) {
      const currentCompanyId = e
      this.companySchoolList = this.schoolList.filter((v: Dic<any>) => (v.companyId === currentCompanyId)) || []
      this.graphForm.schoolId = ''
    },

    //下载预览图
    uploadShowImg () {
      window.open(this.ossImg + this.isShowGraphImg + '/ci0')
    },

    //更换底图 文件
    async beforeAvatarUpload (file: any) {
      // console.log('file', file)
      const type = file.name.split('.')[1]
      // console.log('types', type)
      const fileType = ['png'].some(item => item === type)
      if (!fileType) {
        this.$message('格式错误！请重新选择')
        const elUpload = this.$refs['upload'] as ElUpload
        elUpload.abort(file)
        return
      }
      this.fullscreenLoadingO = true
      this.dialogVisibleAi = false

      const result = await uCgi.GraphToken()
      // console.log(result, 'GraphToken')
      if (result.code === 200) {
        const uploaderSign = result.body || {}
        const type = file.name.split('.').pop().toLowerCase()
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
    //上传图片成功,并赋值
    async handleAvatarSuccess () {
      // console.log('成功', response, file, fileList)companyId: '',schoolId: '',
      this.$notify({ title: '成功', message: '上传成功', type: 'success' })
      this.graphForm.companyId = this.graphForm.companyId || this.companyList[0].companyId
      this.graphForm.ruleId = this.graphForm.ruleId || this.ruleList[0].ruleId
      this.graphForm.name = this.graphForm.name || '未命名'
      this.graphForm.type = 'normal'
      this.graphForm.dpi = +this.graphForm.dpi || 500
      this.graphForm.status = 1
      const res = await uCgi.GraphPrepare(this.graphForm)
      // console.log('res', res)
      if (res.code === 200) {
        window.location.reload()
      }

    },
    //上传图片失败
    uploadError () {
      // console.log('失败', response, file, fileList)
      this.$notify({ title: '请注意', message: '上传失败，请重试', type: 'warning' })
    },
    //关闭重新上传弹框
    handleCloseAi (done: () => {}) {
      done()
    },

    //保存并预览  companyId: '',schoolId: '',
    async graphView () {
      this.fullscreenLoading = true
      const data = {
        graphId: this.graphId,
        name: this.graphForm.name,
        companyId: this.graphForm.companyId,
        schoolId: this.graphForm.schoolId,
        ruleId: this.graphForm.ruleId,
        dpi: this.graphForm.dpi,
        remark: this.graphForm.remark,
        weight: this.graphForm.weight,
        qrs: this.qrs,
      }
      const result = await uCgi.GraphPreview(data)
      if (result.code === 200) {
        this.isShowGraphImg = result.body.source
        this.fullscreenLoading = false
        this.dialogVisible = true
      } else {
        this.$message({ type: 'warning', message: result.message })
      }
    },
    //关闭 -保存合成 -预览
    handleClose (done: () => {}) {
      done()
    },

    //删除模版
    graphDelete () {
      this.$confirm('此操作将永久删除模版, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await uCgi.GraphRemove({ graphId: this.graphId })
        // console.log('result', result)
        if (result.code === 200) {
          this.$router.push(`/graph`)
          this.$notify({ title: '成功', message: '已删除模版', type: 'success' })
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })

    },

    //添加二维码
    addQr () {
      if (this.qrs.length > 0) {
        const index = this.qrs.length - 1
        // console.log('index', index)
        this.qrs.push([1, 1, this.qrs[index][2], this.qrs[index][3], this.qrs[index][4], this.qrs[index][5], 0])

        this.qrActive = index + 1
        this.isSelect = index + 1
      } else {
        // console.log(this.box[0])
        this.qrs.push([1, 1, bigTimes(0.1, this.box[0]), '#000000', '', 0, 0])
      }
    },
    //一键排版
    typesetting () {
      this.saveQrs = this.qrs
      const R = +this.ranksForm.R
      const C = +this.ranksForm.C

      const w1 = Math.abs(this.qrs[0][0] - this.qrs[1][0])
      const h1 = Math.abs(this.qrs[0][1] - this.qrs[1][1])
      const W = this.qrs[0][2]
      const X = Number(this.qrs[0][0]) > Number(this.qrs[1][0]) ? Number(this.qrs[1][0]) : Number(this.qrs[0][0])
      const Y = Number(this.qrs[0][1]) > Number(this.qrs[1][1]) ? Number(this.qrs[1][1]) : Number(this.qrs[0][1])
      const QrColor = this.qrs[0][3].toLowerCase()
      const path = this.qrs[0][4]
      const width = this.qrs[0][5]
      const initPoint = [X, Y, W, QrColor, path, width, 1]

      // console.log(+R, +C, w1, W, h1, W)

      if ((+R >= 2 || +C >= 2) && (w1 > W && h1 > W)) {
        this.qrs = getMoreQR(initPoint, R, C, w1, h1)
      } else {
        this.$message({ type: 'info', message: '排版行列不符合排版' })
      }

      if (this.qrs[0][6] === 1) {
        this.isDraggable = false
      }
    },

    //放大或缩小--rate
    formatTooltip (val: any) {
      if (val) this.rate = val
    },

    //计算二维码数据
    toQrFormat (index: number, e: Dic<any>) {
      const r = this.rate
      const item = this.qrs[index]
      const p = bigDiv(item[5], item[2])
      // const p = item[5] / item[2]
      e.left && this.$set(item, 0, bigDiv(e.left, r))
      e.top && this.$set(item, 1, bigDiv(e.top, r))
      e.width && this.$set(item, 2, bigDiv(e.width, r))
      e.width && this.$set(item, 5, bigTimes(item[2], p))
    },

    //移动转换计算
    dragStop (index: number, e: any) {
      this.toQrFormat(index, e)
    },

    //二维码移动计算
    resizeStop (index: number, e: any) {
      this.toQrFormat(index, e)
    },

    //获取点击index
    onActivated (index: number) {
      // console.log(index, 'this.saveQrs', this.saveQrs)
      this.qrActive = index
      this.isSelect = index
    },

    //选中QR列表
    changeQRList (index: number) {
      // console.log(index, 'this.saveQrs', this.saveQrs)
      this.qrActive = index
      this.isSelect = index
    },

    onDeActivated () {
      // if (this.qrActive === index) this.qrActive = -1
    },

    //删除二维码
    deleteQr () {
      // console.log(this.qrActive, '删除qr-index')
      if (this.qrs.length === 0 || this.qrs[this.qrActive][6] === 1) {
        return
      }
      this.$confirm(`是否删除${this.qrActive + 1}号二维码?`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        // console.log(this.qrActive, '删除qr-index')
        // console.log(this.qrs, '11111')
        this.qrs.splice(this.qrActive, 1)
        this.qrActive--
        if (this.qrActive === -1) {
          this.qrActive = 0
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })

    },
    //撤销
    cancel () {
      if (this.qrs.length < 1) {
        // console.log('this.qrs.length', this.qrs.length)
        return
      }
      this.qrActive = 0
      this.qrs = this.saveQrs
      this.isDraggable = true
    },
    //敬请期待
    open () {
      this.$alert('功能尚未完成，敬请期待', '提示', { confirmButtonText: '确定' })
    },

    //添加logo 文件
    async beforeAvatarUploadLogo (file: any) {
      const type = file.name.split('.').pop().toLowerCase()
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
      }

    },
    //添加logo--上传图片成功,并赋值
    handleAvatarSuccessLogo (response: any, file: any) {
      const qr = this.qrs[this.qrActive] as Dic<any>[]
      this.$set(qr, 4, file.raw.key)

      // this.qrs[this.qrActive][4] = file.raw.key
      // this.$set(this.qrs[this.qrActive])
      // e.left && this.$set(item, 0, bigDiv(e.left, r))
      // console.log('file.raw.key', file.raw.key)
      this.$notify({ title: '成功', message: '上传成功', type: 'success' })
    },
    //添加logo--上传图片失败
    uploadErrorLogo () {
      this.$notify({ title: '请注意', message: '上传失败，请重试', type: 'warning' })
    },

    handleInput (key: number | string, value: number) {

      const qrs = this.qrs
      const qrActive = this.qrActive || 0
      const qrActiveItem = qrs[qrActive] || []
      this.$set(qrActiveItem, key, cm2px(value))

    },

  }
})

</script>

<style lang="scss">

.graph-detail-ui {
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

      .icon_img {
        width: 30px;
        height: 30px;

      }

      .graph_operation_name {
        margin-top: -4px;
      }

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

    .zoom {
      .block {
        padding: 0 24px 0 10px;
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

      .graph_delete {
        margin-left: 16px;
        height: 17px;
        line-height: 17px;

        &.el-button.el-button--text {
          font-size: 12px;
          font-weight: 400;
          color: rgba(248, 79, 81, 1);

          &.is-disabled {
            color: #C0C4CC;
          }
        }
      }
    }
  }

  .exhibition {
    width: 100%;
    height: 100%;
    background-color: #F0F2F5;
    /*padding-left: 280px;*/
    position: fixed;
    min-width: 1280px;
    top: 64px;

    .el-upload-dragger {
      background-color: transparent;
      border: 2px dashed #1890FF;
      border-radius: 2px;
    }

    .upload-demo {
      padding-top: 240px;
      text-align: center;

      .el-icon-plus {
        font-size: 67px;
        color: #1890FF;
        margin: 40px 0 16px;
        line-height: 50px;
      }
    }

    &.QR_view {
      padding: 30px 300px 0 300px;
      margin-right: 300px;
      /*background-color: peru;*/

      .exhibition_img {
        width: 100%;
        height: calc(100vh - 120px);
        /*height: 560px;*/
        background-color: #F0F2F5;
        overflow: scroll;
        position: relative;

        .vue-qrs-resize {
          position: absolute;
        }

        .img-qr {
          width: 100%;
        }
      }
    }

  }

  .exhibition_QR {
    width: 280px;
    height: 100%;
    min-height: 800px;
    background-color: #FAFAFA;
    position: fixed;
    right: 0;
    top: 64px;
    padding-top: 16px;

    .QR_one {
      padding-left: 24px;

      p {
        height: 28px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(102, 102, 102, 1);
        line-height: 28px;
        margin-bottom: 14px;
      }

      .graph_line {
        width: 100%;
        height: 1px;
        background-color: #EEEEEE;
      }

      .ranks {
        margin-top: 14px;
        position: relative;

        .el-button.el-button--primary.el-button--mini {
          border-radius: 2px;
          width: 64px;
          padding: 7px;
        }

        .plus_title {
          margin-top: 4px;
          width: 210px;
          height: 17px;
          font-size: 10px;
          color: rgba(153, 153, 153, 1);
          line-height: 17px;
          font-weight: 400;
        }

        .ranks_icon_R {
          font-size: 12px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          z-index: 999;
          position: absolute;
          left: 152px;
          top: 6px;
        }

        .ranks_icon_C {
          font-size: 12px;
          color: rgba(153, 153, 153, 1);
          z-index: 999;
          position: absolute;
          left: 70px;
          top: 6px;
        }

        .el-input.el-input--mini {

          width: 70px;

          .el-input__inner {
            padding: 0 12px 0 4px;
            text-align: left;
          }
        }

      }

      .QRTwo {
        margin-top: 14px;

        .el-button.el-button--default.el-button--mini.is-plain {
          width: 170px;
          border-radius: 2px;
        }

        .el-col {
          margin-right: 6px;
          margin-bottom: 12px;
        }

        .el-input__inner {
          width: 106px;
          padding-left: 6px;
          padding-right: 16px;
          text-align: left;
        }

        .ranks_icon_WH_width {
          .el-input__inner {
            width: 106px;
            padding-left: 6px;
            padding-right: 28px;
            text-align: left;
          }
        }

        .logo_ranks_icon_WH_width {
          .el-input__inner {
            width: 106px;
            padding-left: 6px;
            padding-right: 28px;
            text-align: left;
          }
        }

        .ranks_icon_X {
          font-size: 12px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          z-index: 999;
          position: absolute;
          left: 104px;
          top: 5px;
        }

        .ranks_icon_Y {
          font-size: 12px;
          color: rgba(153, 153, 153, 1);
          z-index: 999;
          position: absolute;
          left: 228px;
          top: 5px;
        }

        .ranks_icon_WH {
          font-size: 12px;
          color: rgba(153, 153, 153, 1);
          z-index: 999;
          position: absolute;
          left: 90px;
          top: 5px;
          /*background-color: #fff;*/
        }

        .logo_ranks_icon_WH {
          font-size: 12px;
          color: rgba(153, 153, 153, 1);
          z-index: 999;
          position: absolute;
          left: 90px;
          top: 5px;
        }

        .ranks_icon_Hex {
          font-size: 12px;
          color: rgba(153, 153, 153, 1);
          z-index: 999;
          position: absolute;
          left: 146px;
          top: 5px;
        }

        .ranks_icon_Hex_picker {
          font-size: 12px;
          color: rgba(153, 153, 153, 1);
          z-index: 999;
          position: absolute;
          left: 213px;
          top: 0;
          border-radius: 2px;

          .el-color-picker__trigger {
            /*border: none;*/
            border-radius: 2px;
          }
        }

        p {
          height: 16px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 16px;
        }

        .upload-demo {
          margin-top: 2px;
        }

        .el-upload.el-upload--text {
          .btn_type_upload {
            width: 106px;
            margin-left: 4px;
            margin-top: -1px;
            padding: 1px 6px;
            border-radius: 2px;
            background-color: #fff;
            color: #1890FF;

            span {
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
              color: #1890FF;

              span {
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
            color: #1890FF;

            span {
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
              /*background-color: rgb(217, 236, 255);*/

              span {
                /*color: #1890FF;*/
                font-size: 12px;

              }
            }

          }

          .plus_title {
            margin-top: 4px;
            margin-bottom: 0;
            font-size: 10px;
            padding-left: 6px;
            text-align: left;
            color: rgba(153, 153, 153, 1);
          }
        }

      }

      .el-form {
        .el-form--label-top {
          padding: 16px 40px 0 40px;
        }

        .el-form-item__label {
          padding: 0;
        }
      }
    }

    .QR_list {
      margin-top: 16px;
      overflow: scroll;

      /*height:56%;*/
      height: calc(100vh - 420px);

      .QR_title {
        width: 280px;
        height: 42px;
        border-bottom: 1px solid #ddd;
        padding: 10px 24px;
        cursor: pointer;

        &.active {
          background: rgba(24, 144, 255, 1);

          .title {
            color: #fff;
          }
        }

        &:hover {
          background: rgba(24, 144, 255, 1);

          .title {
            color: #fff;
          }
        }

        .title {
          margin-left: 12px;
          color: #333333;
          height: 20px;
          font-size: 14px;
          line-height: 20px;
        }

        .QR_img {
          width: 22px;
          height: 22px;
          background-color: #ffffff;

          .QR_code {
            width: 22px;
            height: 22px;
          }
        }
      }
    }
  }

  .el-form-item.el-form-item--mini {
    margin-bottom: 14px;
  }

  .list-dialog {
    .el-button {
      width: 110px;
    }

    .el-dialog__body {
      padding: 0 25px 10px;
    }

    .el-dialog__footer {
      margin-left: 0 !important;
    }

    .el-dialog__title {
      width: 36px;
      height: 26px;
      font-size: 18px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 26px;
    }

    .dialog_con {
      margin: 20px auto 0;

      text-align: center;
      width: 200px;
      height: 40px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;
      letter-spacing: 1px;
    }

    .el-dialog.el-dialog--center {
      min-width: 338px !important;
    }

  }

  .isShowImg {
    .el-dialog__wrapper {

      .el-dialog {
        width: 600px !important;
        margin-top: 12vh !important;

        .el-dialog__header {
          background: #fafafa;
          padding: 16px;

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


</style>
