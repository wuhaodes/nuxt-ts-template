<template>
  <div class="graph-detail-ui clearfix">
    <div class="operation">
      <el-form :model="graphForm" label-position="top" label-width="80px" size="mini">
        <el-form-item :rules="{ required: true, message: '输入模版类型名称', trigger: 'blur' }" label="模板名称" prop="name">
          <el-input placeholder="请输入模板名称" v-model="graphForm.name"/>
        </el-form-item>
        <el-form-item :rules="{ required: true, message: '请选择所属类型', trigger: 'blur' }" label="二维码类型" prop="ruleId">
          <el-select filterable placeholder="请选择二维码类型" style="width: 200px;" v-model="graphForm.ruleId">
            <template v-for="item in ruleList">
              <el-option
                :label="`${item.name}(${item.ruleId})`"
                :value="item.ruleId">
              </el-option>
            </template>
          </el-select>

        </el-form-item>
        <el-form-item :rules="{ required: true, message: '请选择所属企业', trigger: 'blur' }" label="所属企业" prop="companyId">
          <el-select @change="changeCompanyHandle" filterable placeholder="请选择所属客户" style="width: 200px;" v-model="graphForm.companyId">
            <template v-for="item in companyList">
              <el-option
                :label="item.name"
                :value="item.companyId">
              </el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item :rules="{ required: true, message: '请选择所属学校', trigger: 'blur' }" label="所属学校" prop="schoolId">
          <el-select clearable filterable placeholder="请选择所属客户" style="width: 200px;" v-model="graphForm.schoolId">
            <template v-for="item in companySchoolList">
              <el-option
                :label="item.name"
                :value="item.schoolId">
              </el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input :autosize="{minRows: 1, maxRows: 4 }" placeholder="请填写备注" type="textarea" v-model="graphForm.remark"></el-input>
        </el-form-item>
        <div class="dpi-unit-wrapper">
          <el-form-item class="dpi-item" label="分辨率" prop="AiRate">
            <el-input disabled placeholder="请输入分辨率" v-model="graphForm.dpi"></el-input>
          </el-form-item>
          <div class="unit-wrapper">
            <div class="unit-label">单位</div>
            <el-select size="mini" class="label-value" v-model="viewUnit" placeholder="请选择">
              <template v-for="item in unitOptions">
                <el-option
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </template>
            </el-select>
          </div>
        </div>
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
            <el-slider :format-tooltip="formatTooltip" :step="0.01" :max="2" :min="minRate" :show-tooltip="false" v-model="rate"></el-slider>
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
    <!--    -->
    <div class="workflow-wrapper">
      <!--       -->
      <button class="workflow-view" id="workflow-view"
              @wheel="handleMouseWheel" @keyup.8.stop="deleteQr" @keyup.46.stop="deleteQr">
        <vue-drag-resize
          class="paper-wrapper"
          :style="`transform:scale(${rate}) translate(${paperOffsetX}px,${paperOffsetY}px);width:${box[0]}px;height:${box[1]}px;`"
          :resizable="false"
          :onDrag="onPaperDrag"
          :scale="rate"
          :x="paperOffsetX" wheel
          :y="paperOffsetY"
          :w="box[0]"
          :h="box[1]"
          :scale-ratio="rate"
          :draggable="paperDraggable"
          id="paper-wrapper">
          <img alt='背景图' id="graph-image" class="graph-image" :src="graphImg" v-if="graphImg"/>
          <template v-if="qrs.length>0">
            <vue-drag-resize
              class="vue-qrs-resize"
              v-for="(qr ,index) in qrs"
              :key="index"
              :lockAspectRatio="true"
              :active="qrActive===index"
              :resizable="!qr.disabled"
              :draggable="!qr.disabled"
              :parent="true"
              :snapToGrid="true"
              :data-scale="rate"
              :scale="rate"
              :scale-ratio="rate"
              :style="`width:${qr.w}px;height:${qr.h};transform:translate(${qr.x}px,${qr.y}px)`"
              :x="qr.x"
              :y="qr.y"
              :w="qr.w"
              :h="qr.w"
              :handles="['tl', 'tr', 'br',  'bl']"
              :min-width="20"
              :min-height="20"
              :onDrag="handleQrDrag"
              @resizing="handleQrResize"
              @activated="onQRActivated(index)"
              @deactivated="onQRDeactivated(index)"
              @dragstop="onQRDragStop"
              @resizestop="onQRResizeStop">
              <q-r-code :color="qr.color" :logo-info="{path:qr.logo,width:qr.lw*100/qr.w}"></q-r-code>
            </vue-drag-resize>
          </template>
        </vue-drag-resize>
      </button>
    </div>
    <div class="exhibition_QR">
      <div class="QR_one">
        <div v-if="qrs.length>=2">
          <p>二维码</p>
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
              <el-input-number @input="handleInput('w',$event)" :controls="false" :disabled="qrs[qrActive].disabled" :min="0.00001" :precision="5" size="mini" style="width: 100px;" v-model="unitQrs[qrActive].w"></el-input-number>
            </el-col>
            <el-col :span="10" class="ranks_icon_WH_width">
              <el-color-picker :disabled="qrs[qrActive].disabled" class="ranks_icon_Hex_picker" size="mini" v-model="qrs[qrActive].color"></el-color-picker>
              <el-input :disabled="qrs[qrActive].disabled" placeholder="" size="mini" v-model="qrs[qrActive].color"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10">
              <span class="ranks_icon_X">X</span>
              <el-input-number @input="handleInput('x',$event)" :controls="false" :disabled="qrs[qrActive].disabled" :min="0.00001" :precision="5" size="mini" style="width: 100px;" v-model="unitQrs[qrActive].x"></el-input-number>
            </el-col>
            <el-col :span="10">
              <span class="ranks_icon_Y">Y</span>
              <el-input-number @input="handleInput('y',$event)" :controls="false" :disabled="qrs[qrActive].disabled " :min="0.00001" :precision="5" size="mini" style="width: 100px;" v-model="unitQrs[qrActive].y"></el-input-number>
            </el-col>
          </el-row>
          <div class="graph_line"></div>
          <div v-if="qrs.length>0">
            <p style="margin: 6px 0">logo{{ qrActive + 1 }}</p>

            <el-row :gutter="24">
              <el-col :span="10" class="logo_ranks_icon_WH_width " v-if="qrs[qrActive].logo">
                <span class="logo_ranks_icon_WH">W/H</span>
                <el-input-number
                  @input="handleInput('lw',$event)"
                  :max="qrs[qrActive].w"
                  :controls="false"
                  :disabled="qrs[qrActive].disabled"
                  :min="0.00001"
                  controls-position="right"
                  size="mini"
                  v-model="unitQrs[qrActive].lw">
                </el-input-number>
              </el-col>

              <el-col :span="10" style="margin-bottom: 0">
                <el-upload
                  :action="uploaderSign.host"
                  :before-upload="beforeAvatarUploadLogo"
                  :data="uploaderData"
                  :disabled="authRole==='map.maker' || authRole==='map.maker.worker' || qrs[qrActive].disabled"
                  :on-error="uploadErrorLogo"
                  :on-success="handleAvatarSuccessLogo"
                  :show-file-list="false"
                  class="upload-demo ">
                  <!-- <el-button style="width: 26px;height: 26px"  size="mini">+</el-button>-->
                  <el-button :class="qrs[qrActive].logo ? 'btn_type_upload_logo' : 'btn_type_upload' " :disabled="authRole==='map.maker' || authRole==='map.maker.worker' || qrs[qrActive].disabled"
                             :style="qrs[qrActive].disabled ? 'background-color:#F5F7FA;color: #C0C4CC;border-color: #E4E7ED;' : '' " size="mini" type="primary">
                    <span v-if="qrs[qrActive].logo">+更换logo</span>
                    <span v-else>+上传logo</span>
                  </el-button>
                  <p class="plus_title">注：jpg/png格式</p>
                </el-upload>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>

      <div class="QR_list" v-if="qrs[qrActive]">
        <div :class="qrActive===index?'QR_title active':'QR_title'" @click="changeQRList(index)" ref="QRTitle" v-for="(item,index) in qrs">
          <div class="QR_img fl">
            <q-r-code-list :color="`${item.color}`" :logo-info="{path:qrs[index].logo,width:'10'}"></q-r-code-list>
          </div>
          <span class="title">二维码{{ index + 1 }}</span>
          <span class="title fr" v-if="item.disabled"><i class="el-icon-lock"></i></span>
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
            <img :src="oss2image(graphBg,'ci0')" alt="" style="width: 100%;position: relative">
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
        :before-close="handleClose"
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
import VueDragResize from 'vue-draggable-resizable-gorkys'
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css'
import uCgi from '~/app/@biz/uCgi'
import uHelper from '~/app/@biz/uHelper'
import uPassport from '~/app/@biz/uPassport'
import QRCode from '~/app/components/QRCode.vue'
import QRCodeList from '~/app/components/QRCodeList.vue'
import config from '~/config'
import { _ } from 'coa-nuxt'

const { oss2image } = uHelper

const Big = require('big.js')

//big算法 加
function bigPlus (x: any, y: any) {
  return Number(new Big(x).plus(y).toFixed(6))
}

//big算法 减
function bigMinus (x: any, y: any) {
  return Number(new Big(x).minus(y).toFixed(6))
}

//big算法 乘
function bigTimes (x: any, y: any) {
  return Number(new Big(x).times(y).toFixed(6))
}

//big算法 除
function bigDiv (x: any, y: any) {
  return Number(new Big(x).div(y).toFixed(6))
}

//一键生成二维码
function getMoreQR (initPoint: any[], R: any, C: any, w1: any, h1: any) {
  const result = []
  for (let i = 0; i < C; i++) {
    for (let k = 0; k < R; k++) {
      const point = [bigPlus(initPoint[0], bigTimes(w1, k)), bigPlus(initPoint[1], bigTimes(h1, i)), initPoint[2], initPoint[3], initPoint[4], initPoint[5], 1]
      result.push(point)
    }
  }
  return qrsPolyfill(result, true)
}

function px2cm (px: number, options: { digital?: number, dpi?: number } = { dpi: 500, digital: 5 }) {
  const { dpi = 500, digital = 5 } = options
  console.log(bigTimes(bigDiv(px, dpi), 2.54).toFixed(digital))
  return Number(bigTimes(bigDiv(px, dpi), 2.54).toFixed(digital))
}

function px2mm (px: number, options: { digital?: number, dpi?: number } = { dpi: 500, digital: 5 }) {
  const { dpi = 500, digital = 5 } = options
  return Number(bigTimes(bigDiv(px, dpi), 25.4).toFixed(digital))
}

function cm2px (cm: number, options: { digital?: number, dpi?: number } = { dpi: 500, digital: 5 }) {
  const { dpi = 500, digital = 5 } = options
  console.log(bigTimes(bigDiv(cm, 2.54), dpi).toFixed(digital))
  return Number(bigTimes(bigDiv(cm, 2.54), dpi).toFixed(digital))
}

function mm2px (mm: number, options: { digital?: number, dpi?: number } = { dpi: 500, digital: 5 }) {
  const { dpi = 500, digital = 5 } = options
  return Number(bigTimes(bigDiv(mm, 25.4), dpi).toFixed(digital))
}

// qrs二维数组转数组对象
function qrsPolyfill (qrs: any[], disabled: boolean) {
  return qrs.map(qr =>
    ({
      x: qr[0] || 0,
      y: qr[1] || 0,
      w: qr[2] || 0,
      color: qr[3] || '#000',
      logo: qr[4] || '',
      lw: qr[5] || 0,
      disabled
    })
  )
}

// qrs数组对象转二维数组
function qrRePolyfill (qrs: any[]) {
  qrs = uHelper.clone(qrs)
  return qrs.map(qr => {
    return [qr.x, qr.y, qr.w, qr.color, qr.logo, qr.lw]
  })
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
      graphBg: '',

      qrs: [] as any[],
      qrActive: 0,

      box: [1200, 1200],

      rate: 2,
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

      paperDraggable: true,
      paperOffsetX: 0,
      paperOffsetY: 0,

      viewUnit: 'cm',
      unitOptions: [
        {
          label: 'mm',
          value: 'mm'
        },
        {
          label: 'cm',
          value: 'cm'
        }
      ],
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

    const code = result.code || 0

    if (code != 200)
      return

    const body = result.body || {}
    const source = body.source || ''

    if (!source)
      return

    const { name, companyId, schoolId, ruleId, remark, dpi, weight, width, height, process } = body

    this.graphForm = { graphId, companyId, schoolId, ruleId, name, remark, dpi, weight }

    this.companySchoolList = this.schoolList.filter((v: any) => (v.companyId === companyId)) || []
    this.box[0] = width
    this.box[1] = height
    this.graphBg = source
    this.graphImg = oss2image(source, 'ci0')

    await this.$nextTick()

    this.initRate()

    this.minRate = this.rate / 2

    this.qrs = qrsPolyfill(body.qrs || [], true)

    if (this.qrs.length) {
      this.qrActive = 0
      this.paperDraggable = process !== 'printed'
    }

    // 当window大小调整时重新计算rate
    window.addEventListener('resize', this.initRate)
    const documentBody = document.body
    documentBody.style.cssText = `overflow: hidden;`
  },

  // 删除监听器
  beforeDestroy () {
    window.removeEventListener('resize', this.initRate)
    const documentBody = document.body
    documentBody.style.cssText = `overflow: auto;`
  },

  computed: {
    unitQrs (): Dic<any>[] {
      return this.qrs.map(({ x, y, w, lw, ...others }: any) => {
        const viewUnit = this.viewUnit

        const graphForm = this.graphForm || {}
        const dpi = graphForm.dpi || 500

        if (viewUnit === 'cm')
          return { x: px2cm(x, { dpi }), y: px2cm(y, { dpi }), w: px2cm(w, { dpi }), lw: px2cm(lw, { dpi }), ...others }
        else
          return { x: px2mm(x, { dpi }), y: px2mm(y, { dpi }), w: px2mm(w, { dpi }), lw: px2mm(lw, { dpi }), ...others }
      })

    }
  },

  methods: {

    oss2image,

    unitFix (value: number, viewUnit: string) {
      const graphForm = this.graphForm || {}
      const dpi = graphForm.dpi || 500
      return viewUnit === 'cm' ? px2cm(value, { dpi }) : px2mm(value, { dpi })
    },

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

    handleMouseWheel ($event: any) {

      const deltaY = $event.deltaY

      if (!deltaY)
        return

      let rate = _.clone(this.rate)

      deltaY < 0 ? rate -= -0.01 : rate += -0.01
      rate > this.minRate || (rate = this.minRate)
      rate < 2 || (rate = 2)

      this.rate = rate

    },

    async changeCompanyHandle (e: any) {
      const currentCompanyId = e
      this.companySchoolList = this.schoolList.filter((v: Dic<any>) => (v.companyId === currentCompanyId)) || []
      this.graphForm.schoolId = ''
    },

    //下载预览图
    uploadShowImg () {
      window.open(this.ossImg + this.graphBg + '/ci0')
    },

    //更换底图 文件
    async beforeAvatarUpload (file: any) {

      const fileName = file.name || ''
      const fileNameArr = fileName.split('.')
      const fileExt = fileNameArr.pop().toLowerCase() || ''

      const isAllowFileExt = ['png'].some(item => item === fileExt)

      if (!isAllowFileExt) {
        this.$message('格式错误！请重新选择')
        const elUpload = this.$refs['upload'] as ElUpload
        elUpload.abort(file)
        return
      }

      this.fullscreenLoadingO = true
      this.dialogVisibleAi = false

      const result = await uCgi.GraphToken()
      const code = result.code || 0

      if (code != 200)
        return

      const uploaderSign = result.body || {}
      const { accessid: OSSAccessKeyId, policy, signature: Signature, dir } = uploaderSign
      const fileOssPath = dir + '.' + fileExt
      const uploaderData = { OSSAccessKeyId, policy, Signature, key: fileOssPath, success_action_status: code }
      this.uploaderSign = uploaderSign
      this.uploaderData = uploaderData
      this.graphForm.sourceOrigin = fileOssPath

    },

    //上传图片成功,并赋值
    async handleAvatarSuccess () {

      this.$notify({ title: '成功', message: '上传成功', type: 'success' })
      this.graphForm.companyId = this.graphForm.companyId || this.companyList[0].companyId
      this.graphForm.ruleId = this.graphForm.ruleId || this.ruleList[0].ruleId
      this.graphForm.name = this.graphForm.name || '未命名'
      this.graphForm.type = 'normal'
      this.graphForm.dpi = +this.graphForm.dpi || 500
      this.graphForm.status = 1

      const res = await uCgi.GraphPrepare(this.graphForm)
      if (res.code != 200)
        return

      window.location.reload()

    },

    //上传图片失败
    uploadError () {
      this.$notify({ title: '请注意', message: '上传失败，请重试', type: 'warning' })
    },

    //保存并预览  companyId: '',schoolId: '',
    async graphView () {

      this.fullscreenLoading = true

      const graphId = this.graphId || ''
      const qrs = qrRePolyfill(this.qrs || [])

      const { companyId, schoolId, name, ruleId, dpi, remark, weight } = this.graphForm || {}

      const data = { graphId, companyId, schoolId, ruleId, name, remark, dpi, qrs, weight }

      const result = await uCgi.GraphPreview(data)
      if (result.code != 200)
        return this.$message({ type: 'warning', message: result.message })

      const body = result.body || {}

      this.graphBg = body.source
      this.fullscreenLoading = false
      this.dialogVisible = true

    },

    //删除模版
    async graphDelete () {

      const confirmResult = await this.$confirm('此操作将永久删除模版, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
      if (!confirmResult)
        return this.$message({ type: 'info', message: '已取消删除' })

      const removeResult = await uCgi.GraphRemove({ graphId: this.graphId })
      if (removeResult.code != 200)
        return

      this.$router.push(`/graph`)
      this.$notify({ title: '成功', message: '已删除模版', type: 'success' })

    },

    //添加二维码
    addQr () {

      const qrs = this.qrs || []
      const qrLen = qrs.length || 0

      const boxWidth = this.box[0]
      if (!qrLen) {

        this.qrs.push({ x: boxWidth / 10, y: boxWidth / 10, w: boxWidth / 10, color: '#000000', lw: 0, logo: '', disabled: false })
        this.qrActive = qrLen
        this.handleQrListChange()
        this.paperDraggable = false
        return
      }

      const qrList = uHelper.clone(this.qrs)
      const lastQr = qrList.shift()
      lastQr.x = boxWidth / 10 + lastQr.x
      lastQr.y = boxWidth / 10 + lastQr.y
      lastQr.disabled = false

      this.qrs.push(lastQr)
      this.qrActive = qrLen
      this.paperDraggable = false
      this.handleQrListChange()

    },

    //一键排版
    typesetting () {

      const qrs = uHelper.clone(this.qrs) || []
      const ranksForm = uHelper.clone(this.ranksForm) || {}

      this.saveQrs = uHelper.clone(qrs)

      const R = +ranksForm.R
      const C = +ranksForm.C

      const qrFirst = this.qrs[0] || []
      const qrSecond = this.qrs[1] || []

      const w1 = Math.abs(qrFirst.x - qrSecond.x)
      const h1 = Math.abs(qrFirst.y - qrSecond.y)
      const W = qrFirst.w
      const X = Number(qrFirst.x) > Number(qrSecond.x) ? Number(qrSecond.x) : Number(qrFirst.x)
      const Y = Number(qrFirst.y) > Number(qrSecond.y) ? Number(qrSecond.y) : Number(qrFirst.y)
      const QrColor = qrFirst.color.toLowerCase()
      const path = qrFirst.logo
      const width = qrFirst.lw
      const initPoint = [X, Y, W, QrColor, path, width, 1]

      if ((+R >= 2 || +C >= 2) && (w1 > W && h1 > W))
        this.qrs = getMoreQR(initPoint, R, C, w1, h1)
      else
        this.$message({ type: 'info', message: '排版行列不符合排版' })

      this.isDraggable = !this.qrs[0].disabled
    },

    //放大或缩小--rate
    formatTooltip (val: any) {
      val && (this.rate = parseFloat(val.toFixed(5)))
    },

    handleClose (done: () => {}) {
      done()
    },

    //删除二维码
    async deleteQr () {

      const qrs = this.qrs || []
      let qrActive = this.qrActive || 0
      const activeQr = qrs[qrActive] || []

      if (qrs.length === 0 || activeQr.disabled)
        return

      const confirmResult = await this.$confirm(`是否删除${qrActive + 1}号二维码?`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).catch(e => {
        this.$message({ type: 'info', message: '已取消删除' })
      })

      if (!confirmResult)
        return

      qrs.splice(qrActive, 1)
      qrActive--

      if (qrActive < 0)
        qrActive = 0

      this.qrActive = qrActive

    },

    //撤销
    cancel () {

      if (!this.qrs.length)
        return

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

      const fileName = file.name || ''

      const fileNameArr = fileName.split('.')
      const fileExt = fileNameArr.pop().toLowerCase()

      const isCorrectFileExt = ['jpg', 'jpeg', 'png'].some(item => item === fileExt)

      if (!isCorrectFileExt) {
        this.$message('格式错误！请重新选择')
        const elUpload = this.$refs['upload'] as ElUpload
        elUpload.abort(file)
        return
      }

      const result = await uCgi.StoreOssToken({ path: this.path })

      const code = result.code || 0

      if (code != 200)
        return

      const body = result.body || {}
      const uploaderSign = body.token || {}
      const { accessid: OSSAccessKeyId, policy, signature: Signature, dir } = uploaderSign

      const key = dir + '.' + fileExt

      this.uploaderSign = uploaderSign
      this.uploaderData = { OSSAccessKeyId, policy, Signature, key, success_action_status: code }
      file.key = key

    },

    //添加logo--上传图片成功,并赋值
    handleAvatarSuccessLogo (response: any, file: any) {

      const qr = this.qrs[this.qrActive]

      this.$set(qr, 'logo', file.raw.key)
      this.$set(qr, 'lw', bigDiv(qr.w, 4))
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
      const graphForm = this.graphForm || {}
      const dpi = graphForm.dpi

      const unitFixValue = this.viewUnit === 'cm' ? cm2px(value, { dpi }) : mm2px(value, { dpi })

      this.$set(qrActiveItem, key, unitFixValue)

    },

    //获取点击index
    onQRActivated (index: number) {
      this.qrActive = index
      this.paperDraggable = false
    },

    onQRDeactivated (index: number) {
      if (index !== this.qrActive)
        return
      this.paperDraggable = true
    },

    //选中QR列表
    changeQRList (index: number) {
      this.qrActive = index
    },

    // qr 拖拽
    handleQrDrag (x: number, y: number) {
      this.$set(this.qrs[this.qrActive], 'x', x)
      this.$set(this.qrs[this.qrActive], 'y', y)
    },

    // qr 改变大小
    handleQrResize (x: number, y: number, w: number) {

      const qrActive = this.qrActive || 0
      const qrs = this.qrs || []
      const qr = qrs[qrActive] || {}
      const lw = bigTimes(bigDiv(qr.lw, qr.w), w)

      this.$set(this.qrs[this.qrActive], 'w', w)
      this.$set(this.qrs[this.qrActive], 'lw', lw)
    },

    // qr 拖动停止
    onQRDragStop () {
      this.handleQrListChange()
    },

    // qr 改变大小结束
    onQRResizeStop () {
      this.handleQrListChange()
    },

    // qr 颜色改变
    handleQrColorChange () {
      this.handleQrListChange()
    },

    handleQrListChange () {
      //  记录qr改变
      // this.$store.commit('graph/set_qrs', uHelper.clone(this.qrs))
    },

    onPaperDrag (x: number, y: number) {
      this.paperOffsetX = x
      this.paperOffsetY = y
    }
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

    .dpi-unit-wrapper {
      display: flex;
      align-items: center;

      .dpi-item {
        flex: 1;
      }

      .unit-wrapper {
        margin-left: 18px;
        flex: 1;
        margin-bottom: 14px;

        .unit-label {
          font-size: 14px;
          line-height: 28px;
          color: #333333;
          margin-bottom: 2px;
        }
      }

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

    .el-icon-plus {
      margin-left: 4px;
      top: 1px;
      position: absolute;
      border: 1px solid #1890FF;
      font-size: 24px;
      color: #1890FF;
      cursor: pointer;
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
      z-index: 1003;

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

  .workflow-wrapper {
    width: 100%;
    height: 100%;
    background-color: #F0F2F5;
    position: fixed;
    min-width: 1280px;
    padding: 20px 300px;
    overflow: hidden;

    .workflow-view {
      outline: none;
      cursor: auto;
      width: 100% !important;
      height: calc(100% - 60px) !important;
      box-sizing: border-box;
      border: 1px dotted rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      position: relative !important;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 0;
      background-color: transparent;
      //background: linear-gradient(-90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px) 0% 0% / 20px 20px, linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px) 0% 0% / 20px 20px;
      overflow: hidden;

      .paper-wrapper {
        background-color: transparent;
        z-index: 100;
        flex: none;
        border: 1px solid rgba(0, 0, 0, 0.5);
        opacity: 1;

        .graph-image {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          user-select: none;
          pointer-events: none;
        }
      }

      .vue-qrs-resize {
        position: absolute;
        border: none !important;

        &.resizable {

          .handle {
            transform-origin: left top;
            width: 4% !important;
            height: 4% !important;
            min-width: 20px !important;
            min-height: 20px !important;
            background-color: #EEE;
          }

          .handle-tr {
            transform-origin: left bottom;
            transform: translate(115%, -115%);
            right: 0 !important;
            top: 0 !important;
          }

          .handle-tl {
            transform-origin: right bottom;
            transform: translate(-115%, -115%);
            top: 0 !important;
            left: 0 !important;
          }

          .handle-br {
            transform-origin: left top;
            transform: translate(115%, 115%);
            right: 0 !important;
            bottom: 0 !important;
          }

          .handle-bl {
            transform-origin: right top;
            transform: translate(-115%, 115%);
            left: 0 !important;
            bottom: 0 !important;
          }

        }
      }

      .img-qr {
        width: 100%;
      }

      //&::-webkit-scrollbar {
      //  display: none;
      //  color: transparent;
      //  font-size: 0;
      //  width: 0;
      //  height: 0;
      //}
    }

    &::-webkit-scrollbar {
      display: none;
      font-size: 0;
      width: 0;
      height: 0;
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
            min-width: 100px;
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
            min-width: 100px;
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

      &::-webkit-scrollbar {
        display: none;
        background-color: transparent;
        color: transparent;
        width: 0;
        height: 0;
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
