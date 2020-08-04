<template>
<div class="graph-detail-cp-detail">
  <div class="graph-detail-cp-top">
    <div class="navigation_logo_cp-top">
      <el-button @click="$router.back(-1)" class="returnPrev" icon="el-icon-arrow-left" type="text">返回</el-button>
    </div>
    <div @click="getGraphDetail" class="graph_name">{{draftForm.name}}</div>
    <div class="navigation_bar_cp-top">
      <div class="exhibition_cp_btn">
        <el-button @click="graphCpSave" plain size="small" type="primary">保存</el-button>
        <el-button @click="graphCpPreview" plain size="small" type="primary">预览</el-button>
        <el-button @click="graphCpPrint" plain size="small" type="primary">打印</el-button>
      </div>
    </div>
  </div>

  <div class="operation">
    <el-form class="graph_form_info" label-position="top" label-width="88px" size="mini">
      <el-form-item label="模板名称:">
        <p class="graph_form_info_text">{{draftForm.name}}</p>
      </el-form-item>

      <el-form-item label="纸张类型:">
        <p class="graph_form_info_text">
          <span v-if="draftForm.paper && draftForm.paper.name">{{draftForm.paper.name}}</span>
        </p>
      </el-form-item>

      <el-form-item label="纸张规格(mm):">
        <p class="graph_form_info_text">
          <span v-if="draftForm.paper && draftForm.paper.label">{{draftForm.paper.label}}</span>
        </p>
      </el-form-item>
      <el-form-item label="所属客户:">
        <p class="graph_form_info_text">
          <span v-if="draftForm.school && draftForm.school.name">{{draftForm.school.name}}</span>
        </p>
      </el-form-item>
      <el-form-item label="备注:">
        <p class="graph_form_info_text">
          <span v-if="draftForm.remark">{{draftForm.remark}}</span>
        </p>
      </el-form-item>

    </el-form>
    <div class="graph_operation_cp">
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
            <div @click="addText">
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
            <el-slider :format-tooltip="formatTooltip" :max="200" :min="1" :show-tooltip="false" v-model="rate"></el-slider>
            <span class="demonstration">缩放</span>
          </div>
        </div>
      </div>
    </div>

  </div>

  <div class="exhibition QR_view">
    <div class="paper_wh">{{draftForm.width}} * {{draftForm.height}}mm</div>
    <div :style="`width: ${_box[0]+2}px;height: ${_box[1]+2}px;background-color: #F0F2F5;`" class="exhibition_img" ref="graphTable">
      <div :style="`width: ${_box[0]}px;height: ${_box[1]}px;background-color: #ffffff;`" class="graph-bg" ref="bg">
        <img :src="graphImg" alt="" draggable="false" style="width: 100%;position: relative;">
        <template v-for="(qr ,index) in qrs" v-if="qrs.length>0">
        <div :aspectRatio="qrs[qrActive].type === 'qr'"
             :gridX="0"
             :gridY="0"
             :h="_qrs[index].h"
             :is="isDiv?'div':'VueDragResize'"
             :isActive="qrActive===index"
             :isDraggable="isDraggable"
             :isResizable="qrs[qrActive].type === 'qr'"
             :minh=" qrs[qrActive].type === 'qr' && available.length > 0 ? available[0]*rate || 1 : 0.01"
             :minw="qrs[qrActive].type === 'qr' && available.length > 0 ? available[0]*rate || 1 :0.01"
             :parentH="_box[1]"
             :parentLimitation="true"
             :parentW="_box[0]"
             :preventActiveBehavior="false"
             :snapToGrid="true"
             :style="isDiv?`left:${_qrs[index].x}px;top:${_qrs[index].y}px;width:${_qrs[index].w}px;height:${_qrs[index].h}px;`:''"
             :w="_qrs[index].w"
             :x="_qrs[index].x"
             :y="_qrs[index].y"
             @activated="onActivated(index)"
             @deactivated="onDeActivated(index)" @dragstop="dragStop(index,$event)" @resizestop="resizeStop(index,$event)" class="vue-qrs-resize">
          <q-r-code-c-p :color="qrs[index].c"
                        :logo-info="{path:qrs[index].l,width:qrs[index].lw/qrs[index].w * 100}"
                        :qr-type="qrs[index].type"
                        :text-info="{weight:_qrs[index].w,height:_qrs[index].h,text:qrs[index].v,color:qrs[index].c,size:_qrs[index].px,weight:qrs[index].b,background:qrs[index].bc}"></q-r-code-c-p>
        </div>
        </template>
      </div>
    </div>
  </div>

  <div class="exhibition_QR">

    <div class="QR_one ">
      <p v-if="qrs.length>0">位置</p>
      <div class="QRTwo" v-if="qrs.length>0">
        <el-row :gutter="24">
          <el-col :span="10">
            <span class="ranks_icon_X">X</span>
            <el-input-number :controls="false" :min="0.00001" :precision="5" size="mini" style="width: 100px;" v-model="qrs[qrActive].x"></el-input-number>
          </el-col>
          <el-col :span="10">
            <span class="ranks_icon_Y">Y</span>
            <el-input-number :controls="false" :min="0.00001" :precision="5" size="mini" style="width: 100px;" v-model="qrs[qrActive].y"></el-input-number>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="10" class="ranks_icon_WH_width">
            <span class="ranks_icon_WH">W</span>
            <el-input-number :controls="false" :max="available[available.length-1] || draftForm.width" :min="available[0] || 1" :precision="5" @blur="changeQrW" size="mini" style="width: 100px;" v-if="qrs[qrActive].type === 'qr'"
                             v-model="qrs[qrActive].w"></el-input-number>
            <el-input-number :controls="false" :disabled="qrs[qrActive].type === 'text'" :max="draftForm.width" :min="1" :precision="5" size="mini" style="width: 100px;" v-else v-model="qrs[qrActive].w"></el-input-number>
          </el-col>
          <el-col :span="10" class="ranks_icon_WH_width">
            <span class="ranks_icon_WH_H">H</span>
            <el-input-number :controls="false" :disabled="qrs[qrActive].type === 'qr'" :max="available[available.length-1] || draftForm.width" :min="available[0] || 1" :precision="5" size="mini" style="width: 100px;"
                             v-if="qrs[qrActive].type === 'qr'"
                             v-model="qrs[qrActive].h"></el-input-number>
            <el-input-number :controls="false" :disabled="qrs[qrActive].type === 'text'" :max="draftForm.width" :min="1" :precision="5" size="mini" style="width: 100px;" v-else v-model="qrs[qrActive].h"></el-input-number>
          </el-col>
        </el-row>
      </div>
      <div class="graph_line"></div>

      <p v-if="qrs.length>0">二维码</p>

      <div class="QRTwo" v-if="qrs.length>0">
        <el-row :gutter="24">
          <el-col :span="10" class="ranks_icon_WH_width_color">
            <el-color-picker :disabled="qrs[qrActive].type === 'text'" class="ranks_icon_Hex_picker" size="mini" v-model="qrs[qrActive].c"></el-color-picker>
            <el-input class="disabled_input" disabled placeholder="" size="mini" v-model="qrs[qrActive].c"></el-input>
          </el-col>
        </el-row>
        <div v-if="qrs.length>0">
          <el-row :gutter="24">
            <el-col :span="10" class="logo_ranks_icon_WH_width " v-if=" qrs[qrActive].l !== ''">
              <span class="logo_ranks_icon_WH">W/H</span>
              <el-input-number :controls="false" :disabled="qrs[qrActive].type === 'text'" :min="0.00001" controls-position="right" size="mini" v-model="qrs[qrActive].lw"></el-input-number>
            </el-col>
            <el-col :span="10" style="margin-bottom: 0">
              <el-upload
                :action="uploaderSignLogo.host"
                :before-upload="beforeAvatarUploadLogo"
                :data="uploaderDataLogo"
                :disabled="qrs[qrActive].type === 'text'"
                :on-error="uploadErrorLogo"
                :on-success="handleAvatarSuccessLogo"
                :show-file-list="false"
                class="upload-demo ">
                <el-button :class="qrs[qrActive].l === '' ? 'btn_type_upload_logo' : 'btn_type_upload' " :disabled="qrs[qrActive].type === 'text'"
                           :style="qrs[qrActive].type === 'text' ? 'background-color:#F5F7FA;color: #C0C4CC;border-color: #E4E7ED;' : '' "
                           size="mini" type="primary"><span>+上传logo</span></el-button>
                <p class="plus_title">注：jpg/png格式</p>
              </el-upload>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div style="min-height: 192px">
      <div class="QR_one QR_text">
        <div class="graph_line" style="margin-top: 6px;"></div>
        <p v-if="qrs.length>0">文字</p>
        <div class="QRTwo" v-if="qrs.length>0">
          <!--          <p><span v-if="qrs[qrActive].type==='text'">文字{{qrActive + 1}}</span></p>-->
          <el-row :gutter="24">
            <el-col :span="10" class="ranks_icon_WH_width">
              <span class="ranks_icon_WH">W</span>
              <el-input-number :controls="false" :disabled="qrs[qrActive].type === 'qr'" :min="0.00001" :precision="5" size="mini" style="width: 100px;" v-model="qrs[qrActive].w"></el-input-number>
            </el-col>
            <el-col :span="10" class="ranks_icon_WH_width">
              <span class="ranks_icon_WH_H">H</span>
              <el-input-number :controls="false" :disabled="qrs[qrActive].type === 'qr'" :min="0.00001" :precision="5" size="mini" style="width: 100px;" v-model="qrs[qrActive].h"></el-input-number>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="10" class="ranks_icon_WH_width">
              <span class="ranks_icon_text">S</span>
              <el-select :disabled="qrs[qrActive].type === 'qr'" @change="changeText" class="text-size" placeholder="请选择字号" v-model="qrs[qrActive].s">
                <el-option
                  :key="i"
                  :label="item.label"
                  :value="item.width"
                  size="mini"
                  v-for="(item,i) in textSize">
                </el-option>
              </el-select>
              <!--              <el-input-number :disabled="qrs[qrActive].type === 'qr'" :min="12" :precision="0" class="text_s" size="mini" style="width: 106px;" v-model="qrs[qrActive].s"></el-input-number>-->
            </el-col>
            <el-col :span="10">
              <span class="ranks_icon_text">B</span>
              <el-input-number :disabled="qrs[qrActive].type === 'qr'" :max="700" :min="400" :precision="0" :step="100" size="mini" style="width: 106px;" v-model="qrs[qrActive].b"></el-input-number>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="10" class="ranks_icon_WH_width_color_text ">
              <span class="ranks_icon_text ">C</span>
              <el-color-picker :disabled="qrs[qrActive].type === 'qr'" class="ranks_icon_Hex_picker C" size="mini" v-model="qrs[qrActive].c"></el-color-picker>
              <el-input :disabled="qrs[qrActive].type === 'qr'" placeholder="" size="mini" v-model="qrs[qrActive].c"></el-input>
            </el-col>
            <el-col :span="10" class="ranks_icon_WH_width_color_text BC">
              <span class="ranks_icon_text ">BC</span>
              <el-color-picker :disabled="qrs[qrActive].type === 'qr'" class="ranks_icon_Hex_picker BC" size="mini" v-model="qrs[qrActive].bc"></el-color-picker>
              <el-input :disabled="qrs[qrActive].type === 'qr'" placeholder="" size="mini" v-model="qrs[qrActive].bc"></el-input>
            </el-col>
          </el-row>
          <div v-if="qrs.length>0">
            <el-row :gutter="24">
              <el-col :span="22" class="logo_ranks_icon_WH_width_text ">
                <el-input :autosize="{ minRows: 2, maxRows: 2}" :disabled="qrs[qrActive].type === 'qr'" @input="changeInput" size="mini" style="width: 230px;" type="textarea" v-model="qrs[qrActive].v"></el-input>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>

    <div class="graph_line" style="margin-top: 6px;"></div>
    <div class="QR_list" v-if="qrs[qrActive]">
      <div :class="isSelect===index?'QR_title active':'QR_title'" @click="changeQRList(index)" ref="QRTitle" v-for="(item,index) in qrs">
        <div v-if="item.type === 'qr'">
          <div class="QR_img fl">
            <q-r-code-list :color="`${item.c}`" :logo-info="{path:qrs[index].l,width:'10'}"></q-r-code-list>
          </div>
          <span class="title">二维码{{index+1}}</span>
        </div>

        <div v-if="item.type === 'text'">
          <div class="QR_img fl">
            <span :style='`font-size: 12px;padding: 4px;color:${qrs[index].c};`'>{{qrs[index].v.substr(0, 1)}}</span>
          </div>
          <span class="title">文字{{index+1}}</span>
        </div>
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
          <img :src="oss2image(isShowGraphImg.url,'ci0')" alt="" style="width: 100%;position: relative">
        </div>
      </div>

      <div class="dialog-footer" slot="footer">
        <el-button @click="uploadShowImg" size="small" type="primary">下载预览图</el-button>
      </div>

    </el-dialog>
  </div>
  <!-- 重新上传-->
  <div class="list-dialog">
    <el-dialog
      :before-close="handleCloseAi"
      :close-on-click-modal="false"
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
                   :on-error="uploadError"
                   :on-success="handleAvatarSuccess"
                   :show-file-list="false"
                   class="upload-demo">
                <el-button element-loading-background="rgba(0, 0, 0, 0.8)" element-loading-text="底图更换中···" size="small" style="width: 110px;height: 32px;padding: 10px"
                           type="primary" v-loading.fullscreen.lock="fullscreenLoadingO">点击上传</el-button>
              </el-upload>
             </div>
          </div>
          </span>
    </el-dialog>
  </div>
  <!--logo弹框-->

  <!--创建-->
  <div class="showCreateGraph">
    <el-dialog
      :before-close="handleCloseGraphCreate"
      :close-on-click-modal="false"
      :visible.sync="dialogVisibleGraphCreate"
      title="编辑模板">
      <div class="graph-create">
        <el-form :model="draftDetailForm" label-width="98px" ref="draftDetailForm">
          <el-form-item :rules="{ required: true, message: '输入模版类型名称', trigger: 'blur' }" label="模板名称:" prop="name">
            <el-input placeholder="请输入模板名称" style="width: 300px;" v-model="draftDetailForm.name"></el-input>
          </el-form-item>

          <el-form-item :rules="{ required: true, message: '请选择纸张类型', trigger: 'change' }" label="纸张类型:" prop="paperArray">
            <el-cascader
              :options="paperList"
              :props="{value:'paperId',expandTrigger: 'hover' }"
              @change="handleChangePaper"
              style="width: 300px;"
              v-model="draftDetailForm.paperArray">
            </el-cascader>
          </el-form-item>

          <el-form-item :rules="{ required: false, message: '请选择所属客户', trigger: 'change' }" label="所属客户:" prop="schoolId">
            <el-select clearable filterable placeholder="请选择所属客户" style="width: 300px;" v-model="draftDetailForm.schoolId">
              <el-option
                :key="item.schoolId"
                :label="item.name"
                :value="item.schoolId"
                v-for="item in companySchoolList">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :rules="{ required: true, message: '请选择所属类型', trigger: 'change' }" label="二维码类型:" prop="ruleId">
            <el-select filterable placeholder="请选择二维码类型" style="width: 300px;" v-model="draftDetailForm.ruleId">
              <el-option
                :key="item.ruleId"
                :label="item.name +'（'+ item.ruleId +'）'"
                :value="item.ruleId"
                v-for="item in ruleList">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="备注:" prop="remark">
            <el-input :autosize="{minRows: 2, maxRows: 6 }" placeholder="请填写备注" style="width: 300px;" type="textarea" v-model="draftDetailForm.remark"></el-input>
          </el-form-item>

        </el-form>

      </div>

      <div class="dialog-footer" slot="footer">
        <el-button :loading="true" type="primary" v-if="detailLoading">确 定</el-button>
        <el-button @click="reviseGraph" type="primary" v-else>确 定</el-button>
      </div>
    </el-dialog>
  </div>


  <!--打印设备-->
  <div class="showCreateGraph">
    <el-dialog
      :before-close="handleClosePrinter"
      :close-on-click-modal="false"
      :visible.sync="dialogVisiblePrinter"
      title="选择打印机">
      <div class="graph-create print">
        <el-form :model="draftPrintForm" label-width="98px" ref="draftPrintForm">

          <el-form-item :rules="{ required: false, message: '请选择打印机', trigger: 'change' }" label="选择打印机:" prop="iotDeviceId">
            <el-select clearable placeholder="请选择" style="width: 300px;" v-model="draftPrintForm.iotDeviceId">
              <el-option-group
                :key="group.type"
                :label="group.type"
                v-for="group in rfidOptions">
                <el-option
                  :disabled="item.process === 'offline' || item.process === 'working' || !item.deviceId"
                  :key="index + item.deviceId"
                  :label="(group.type + '-' + item.deviceId) || '未知' "
                  :value="(group.type + '-' + item.deviceId) || '未知'"
                  v-for="(item, index) in group.list">
                    <span class="select-content">
                      <span class="select-label">{{item.deviceId}}</span>
                      <span class="select-status">
                        <span class="select-sign" v-if="item.process === 'offline'"></span>
                        <span :style="{'background': item.process === 'online' ? '#67C23A' : '#F3BB45'}" class="select-sign"
                              v-else></span>
                        <span class="status" v-if="item.process === 'offline'">离线</span>
                        <span class="status" v-else-if="item.process === 'online'">在线</span>
                        <span class="status" v-else>工作中</span>
                      </span>
                    </span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="dialog-footer" slot="footer">
        <el-button :loading="true" type="primary" v-if="detailLoading">确 定</el-button>
        <el-button @click="createPrint" type="primary" v-else>确 定</el-button>
      </div>
    </el-dialog>
  </div>

</div>
</template>

<script lang="ts">

import { ElForm } from 'element-ui/types/form'
import { ElUpload } from 'element-ui/types/upload'
import * as _ from 'lodash'
import Vue from 'vue'
// @ts-ignore
import VueDragResize from 'vue-drag-resize'
import uCgi from '~/app/@biz/uCgi'
import uHelper from '~/app/@biz/uHelper'
import uPassport from '~/app/@biz/uPassport'
import QRCodeCP from '~/app/components/QRCodeCP.vue'
import QRCodeList from '~/app/components/QRCodeList.vue'
import config from '~/config'

const { oss2image } = uHelper

const Big = require('big.js')

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

function cm2px (cm: number, dpi: number) {
  return _.toNumber((cm / 2.54 * dpi).toFixed(5))
}

function mm2px (mm: number, dpi: number) {
  const v = mm / 10
  return cm2px(v, dpi)
}

// [1, 1, bigTimes(0.1, this.box[0]), '#000000', '', 0, 0]
//   标识 1:qr  2:text
// [[X, Y, W, H, color, path, W/H(logo),      '标识',       '文字内容', '文字颜色', '文字大小', '文字粗细', '背景颜色']]

// "qrs": [{ "x": 15, "y": 15, "w": 80, "h": 0, "l": "", "lw": 0, "c": "#b4a5ff"}]
// "texts": [{ "x": 15, "y": 15, "s": 24, "b": 400, "f": "", "c": "#000000", "bc": "", "v": "文本1" }]

// <!--  this.qrs = [-->
// <!--  { x: 0, y: 0, w: 15, h: 15, c: '#b4a5ff', l: '', lw: 0, type: 'qr' },-->
// <!--  { x: 5, y: 40, w: 20, h: 14, v: '111111111111111111111', c: '#000000', s: 24, b: 400, bc: '', f: '', type: 'text' }-->
// <!-- // [[X, Y, W, H, color, path, W/H(logo),      '标识',       '文字内容', '文字颜色', '文字大小', '文字粗细', '背景颜色']]
//           0  1  2  3   4       5     6               7              8         9         10         11         12-->

//VueDragResize,
export default Vue.extend({
  layout: 'default_cp_detail',
  components: {
    QRCodeCP, QRCodeList, VueDragResize
  },

  data () {
    return {
      uploaderSign: { host: '' } as Dic<string>,
      uploaderData: {} as TUploaderData,

      uploaderSignLogo: { host: '' } as Dic<string>,
      uploaderDataLogo: {} as TUploaderData,
      saveQrs: [] as any[],
      isDraggable: true,
      isDiv: true,
      path: 'codeLogo',
      loading: false,
      isSelect: 0,
      ossImg: config.imageBase,
      dialogVisibleAi: false,
      fullscreenLoadingO: false,
      fullscreenLoading1: false,

      aaa: [],

      schoolList: [] as any[],

      dialogVisible: false,
      fullscreenLoading: false,
      graphImg: '',
      isShowGraphImg: {
        url: ''
      },
      qrs: [] as any[],
      qrActive: 0,
      box: [1200, 1200],
      rate: 100,

      // ====
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

      //-----
      draftId: '',

      draftForm: {
        companyId: '',
        name: '',
        ruleId: '',
        width: '',
        height: '',
        paperId: '',
        schoolId: '',
        remark: '',
        paperArray: [] as any,

        draftNo: '',
        background: '',
        qrs: [],
        texts: [],
        qrCount: 0,

      } as any,

      draftDetailForm: {
        companyId: '',
        name: '',
        ruleId: '',
        width: '',
        height: '',
        paperId: '',
        schoolId: '',
        remark: '',
        paperArray: [] as any

      } as any,

      companyId: '',
      companySchoolList: [] as any[],
      ruleList: [] as any[],
      paperList: [],

      dialogVisibleGraphCreate: false,

      detailLoading: false,

      dialogVisiblePrinter: false,
      draftPrintForm: {
        iotDeviceId: ''
      },

      rfidOptions: [] as { type: string, list: {}[] }[],

      available: [] as any,

      textSize: [],

    }
  },

  async asyncData (query) {
    const draftId = query.params.id || ''

    return {
      draftId
    }
  },

  //mounted，获取数据
  async mounted () {
    const draftId = this.draftId || ''
    const { body, code } = await uCgi.MarkDraftMaGet({ draftId: draftId })
    const textResult = await uCgi.MarkDraftTextSizeOptionMaGet({ paperId: body.paperId })
    const textSize = textResult?.body?.available || []
    this.textSize = textSize
    const qrSizeResult = await uCgi.MarkDraftQrSizeOptionMaGet({ paperId: body.paperId })
    this.available = qrSizeResult?.body?.available || []

    if (code === 200) {
      this.draftForm = body || {}
      this.box[0] = body?.width || 100
      this.box[1] = body?.height || 100
      if (body.background) {this.graphImg = this.oss2image(body.background, 'ci0')}
      await this.$nextTick()
      const rate = bigDiv((this.$refs['graphTable'] as Element).clientWidth, this.box[0])
      this.rate = rate
      const bodyQrs = body?.qrs || []
      const bodyTexts = body?.texts || []
      _.forEach(bodyQrs, (item) => {item.type = 'qr'})
      _.forEach(bodyTexts, (item) => {
        item.type = 'text'
        const textPx = _.filter(textSize, { 'width': item.s }) as Dic<any>
        item.px = bigTimes(textPx[0].width || 0, rate)
        item.w = bigTimes(textPx[0].width, item.v.length) + 0.5
        item.h = textPx[0].width + 0.5
      })
      this.qrs = _.concat(bodyQrs, bodyTexts)
    }
  },

  //计算属性
  //      [[X, Y, W, H, color, path, W/H(logo),      '标识',       '文字内容', '文字颜色', '文字大小', '文字粗细', '背景颜色']]
  // <!--  this.qrs = [-->
  // <!--  { x: 0, y: 0, w: 15, h: 15, c: '#b4a5ff', l: '', lw: 0, type: 'qr' },-->
  // <!--  { x: 5, y: 40, w: 20, h: 14, v: '111111111111111111111', c: '#000000', s: 24, b: 400, bc: '', f: '', type: 'text' }-->
  // <!-- // [[X, Y, W, H, color, path, W/H(logo),      '标识',       '文字内容', '文字颜色', '文字大小', '文字粗细', '背景颜色']]
  //           0  1  2  3   4       5     6               7              8         9         10         11         12-->

  computed: {
    _qrs (): any {
      this.isDiv = true
      this.$nextTick(() => {this.isDiv = false})
      const r = this.rate || 0
      return this.qrs.map(({ x, y, w, h, lw, px, s, ...others }) => {
        return {
          x: bigTimes(x || 0, r),
          y: bigTimes(y || 0, r),
          w: bigTimes(w || 0, r),
          h: bigTimes(h || 0, r),
          lw: bigTimes(lw || 0, r),
          px: bigTimes(s || 0, r),
          ...others
        }
      })
    },

    _box (): any {
      this.isDiv = true
      this.$nextTick(() => {this.isDiv = false})
      const r = this.rate || 0
      return this.box.map(v => bigTimes(v, r, true))
    }
  },

  methods: {
    // 获取详情信息
    async getDraftDetail () {
      const draftId = this.draftId || ''
      const { body, code } = await uCgi.MarkDraftMaGet({ draftId: draftId })
      if (code === 200) {
        this.draftForm = body || {}
        if (body.background) {
          this.graphImg = this.oss2image(body.background, 'ci0')
        }

        this.box[0] = body?.width || 100
        this.box[1] = body?.height || 100
        this.$set(this.box, 0, this.box[0])
        this.$set(this.box, 1, this.box[1])

        await this.$nextTick()
        this.rate = bigDiv((this.$refs['graphTable'] as Element).clientWidth, this.box[0])

        const bodyQrs = body?.qrs || []
        const bodyTexts = body?.texts || []
        _.forEach(bodyQrs, (item) => {item.type = 'qr'})
        _.forEach(bodyTexts, (item) => {
          item.type = 'text'
          // const textPx = _.filter(this.textSize, { 'size': item.s }) as Dic<any>
          // item.px = textPx[0].px || 14
        })

        this.qrs = _.concat(bodyQrs, bodyTexts)
        const qrSizeResult = await uCgi.MarkDraftQrSizeOptionMaGet({ paperId: body.paperId })
        this.available = qrSizeResult?.body?.available || []
        const textResult = await uCgi.MarkDraftTextSizeOptionMaGet({ paperId: body.paperId })
        this.textSize = textResult?.body || []
      }
    },

    oss2image,
    handleChangePaper (value: any) {
      this.draftDetailForm.paperId = value[1] || ''
    },

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

    // 添加模版弹框模版页面
    async getGraphDetail () {
      const school = await uCgi.CoreAccountSchoolWaList({ rows: 9999 })
      const schoolList = school?.body?.list || []

      this.companySchoolList = schoolList.filter((v: Dic<any>) => (v.companyId === this.draftForm.companyId)) || []

      const { code, body } = await uCgi.MarkRuleMaList({ rows: 9999 })
      this.ruleList = body || []

      const result = await PaperList() || {}
      this.paperList = result || []

      const resultDraft = await uCgi.MarkDraftMaGet({ draftId: this.draftId })

      const { companyId, name, ruleId, schoolId, remark, paper, paperId } = resultDraft?.body || {}

      const data = {
        companyId,
        name,
        ruleId,
        schoolId,
        paperId,
        remark,
        paperArray: [paper.pid, paper.paperId],
      }

      if (code === 200 && school?.code === 200) {
        this.draftDetailForm = data || {}
        this.dialogVisibleGraphCreate = true
      }
    },

    // 修改详情
    async reviseGraph () {
      const valid = await (this.$refs['draftDetailForm'] as ElForm).validate().catch(e => false)
      if (!valid) {return false}
      this.detailLoading = true
      const { companyId, name, ruleId, paperId, schoolId, remark } = this.draftDetailForm

      const data = {
        draftId: this.draftId || '',
        dpi: 500,
        companyId,
        name,
        ruleId,
        paperId,
        schoolId,
        remark,
      }

      const { code } = await uCgi.MarkDraftBasicMaPut(data)

      if (code === 200) {
        this.dialogVisibleGraphCreate = false
        this.$notify({ title: '成功', message: '成功修改模版基本信息', type: 'success' })
        await this.getDraftDetail()
      }

      setTimeout(() => {this.detailLoading = false}, 3000)

    },

    // 关闭添加
    handleCloseGraphCreate (done: () => {}) {
      const ElForm = this.$refs['draftDetailForm'] as ElForm
      ElForm.resetFields()
      done()
    },

    // cp 保存
    async graphCpSave () {

      const qrs = _.filter(this.qrs, { 'type': 'qr' }) || []
      const texts = _.filter(this.qrs, { 'type': 'text' }) || []

      const data = {
        draftId: this.draftId || '',
        qrs,
        texts
      }
      const { code } = await uCgi.MarkDraftAdvanceMaPut(data)
      if (code === 200) {
        this.$notify({ title: '成功', message: '已成功设置模版的二维码和文本', type: 'success' })
      }

    },

    // cp 预览
    async graphCpPreview () {

      const qrs = _.filter(this.qrs, { 'type': 'qr' }) || []
      const texts = _.filter(this.qrs, { 'type': 'text' }) || []
      const data = { draftId: this.draftId || '', qrs, texts }

      const { code } = await uCgi.MarkDraftAdvanceMaPut(data)
      if (code === 200) {
        const { body, code } = await uCgi.MarkDraftMaPreview({ draftId: this.draftId })
        if (code === 200) {
          this.isShowGraphImg.url = body?.path || ''
          // this.$set(this.isShowGraphImg,'url',body.path || '')
          this.dialogVisible = true
          await this.getDraftDetail()
        }
      }

    },

    // cp 打印
    async graphCpPrint () {
      const { body, code } = await uCgi.devicesList({ row: 9999, types: 'P30' })
      if (code === 200) {
        this.rfidOptions = [
          {
            type: 'P30',
            list: body.list || []
          }
        ]
        this.dialogVisiblePrinter = true
      }

    },

    // 关闭添加
    handleClosePrinter (done: () => {}) {
      // const ElForm = this.$refs['draftDetailForm'] as ElForm
      // ElForm.resetFields()
      done()
    },

    // 打印
    async createPrint () {
      const valid = await (this.$refs['draftPrintForm'] as ElForm).validate().catch(e => false)
      if (!valid) {return false}
      this.detailLoading = true

      const data = {
        draftId: this.draftId,
        iotDeviceId: this.draftPrintForm.iotDeviceId
      }

      const { code, message } = await uCgi.MarkDraftMaPreviewPrint(data)

      if (code === 200) {
        this.dialogVisiblePrinter = false
        this.$notify({ title: '成功', message: '打印成功', type: 'success' })
      } else {
        this.dialogVisiblePrinter = false
        this.$notify.error({ title: '失败', message: message })
      }

      setTimeout(() => {this.detailLoading = false}, 3000)

    },

    // 添加二维码
    addQr () {
      const qrArray = _.filter(this.qrs, { 'type': 'qr' }) || []
      const index = this.qrs.length - 1
      if (qrArray.length > 0) {
        this.qrs.push({ x: 0.5, y: 0.5, w: qrArray[qrArray.length - 1].w, h: qrArray[qrArray.length - 1].h, c: qrArray[qrArray.length - 1].c, l: '', lw: 0, type: 'qr' })
        this.qrActive = index + 1
        this.isSelect = index + 1
      } else {
        this.qrs.push({ x: 0.5, y: 0.5, w: bigTimes(0.2, this.box[0]), h: bigTimes(0.2, this.box[0]), c: '#000000', l: '', lw: 0, type: 'qr' })
      }
    },

    // 添加文字
    addText () {
      const textArray = _.filter(this.qrs, { 'type': 'text' }) || []
      const index = this.qrs.length - 1
      if (textArray.length > 0) {
        this.qrs.push({
          x: 1,
          y: 1,
          w: 8.4,
          h: 2,
          c: textArray[textArray.length - 1].c,
          v: '文字内容',
          s: 2.04,
          b: textArray[textArray.length - 1].b,
          bc: textArray[textArray.length - 1].bc || '',
          f: textArray[textArray.length - 1].f || '',
          type: 'text'
        })
        this.qrActive = index + 1
        this.isSelect = index + 1
      } else {
        this.qrs.push({ x: 1, y: 1, w: 8.4, h: 2, c: '#000000', v: '文字内容', s: 2.04, b: '400', bc: '', f: '', type: 'text' })
      }
    },

    changeText (e: any) {
      const r = this.rate || 0
      this.qrs[this.qrActive].px = bigTimes(e || 0, r)
      this.qrs[this.qrActive].w = bigTimes(e, this.qrs[this.qrActive].v.length) + 0.5
      this.qrs[this.qrActive].h = e + 0.5
    },

    changeInput (e: any) {
      this.qrs[this.qrActive].w = bigTimes(this.qrs[this.qrActive].s, e.length)
    },

    //-----------

    // 下载预览图
    uploadShowImg () {
      window.open(this.ossImg + this.isShowGraphImg.url + '/ci0')
    },
    // 更换底图 文件
    async beforeAvatarUpload (file: any) {
      const type = file.name.split('.')[1]
      const fileType = ['png'].some(item => item === type)
      if (!fileType) {
        this.$message('格式错误！请重新选择')
        const elUpload = this.$refs['upload'] as ElUpload
        elUpload.abort(file)
        return
      }
      this.fullscreenLoadingO = true
      this.dialogVisibleAi = false

      const result = await uCgi.MarkUploadTokenMaGet({ type: 'background', draftId: this.draftId })

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
        this.draftForm.background = this.uploaderSign['dir'] + '.' + type
      }
    },

    // 上传图片成功,并赋值
    async handleAvatarSuccess () {
      this.$notify({ title: '成功', message: '上传成功', type: 'success' })
      const data = {
        draftId: this.draftId || '',
        background: this.draftForm.background || ''
      }
      const res = await uCgi.MarkDraftBackgroundMaPut(data)
      if (res.code === 200) {
        window.location.reload()
      }
    },

    // 上传图片失败
    uploadError () {
      // console.log('失败', response, file, fileList)
      this.$notify({ title: '请注意', message: '上传失败，请重试', type: 'warning' })
    },

    // 关闭重新上传弹框
    handleCloseAi (done: () => {}) {
      done()
    },

    // 关闭 -保存合成 -预览
    handleClose (done: () => {}) {
      this.isShowGraphImg.url = ''
      done()
    },

    // 删除模版
    graphDelete () {
      this.$confirm('此操作将永久删除模版, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await uCgi.GraphRemove({ draftId: this.draftId })
        if (result.code === 200) {
          this.$router.push(`/cp/graph`)
          this.$notify({ title: '成功', message: '已删除模版', type: 'success' })
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })

    },

    // 放大或缩小--rate
    formatTooltip (val: any) {
      if (val) this.rate = val
    },

    // 计算二维码数据
    toQrFormat (index: number, e: Dic<any>) {
      const r = this.rate
      const item = this.qrs[index]
      const qrw = [] as any
      const p = bigDiv(item.lw || 0, item.w)

      if (item.type === 'qr') {
        if (this.available.length > 0) {
          if (bigDiv(e.width || 0, r) <= this.available[0]) {
            e.width && this.$set(item, 'w', this.available[0])
            e.height && this.$set(item, 'h', this.available[0])
          } else if (bigDiv(e.width || 0, r) >= this.available[this.available.length - 1]) {
            e.width && this.$set(item, 'w', this.available[this.available.length - 1])
            e.height && this.$set(item, 'h', this.available[this.available.length - 1])
          } else {
            _.forEach(this.available, v => {if (bigDiv(e.width || 0, r) <= v + 0.2) {qrw.push(v)}})
            e.width && this.$set(item, 'w', qrw[0])
            e.height && this.$set(item, 'h', qrw[0])
          }
        } else {
          e.width && this.$set(item, 'w', bigDiv(e.width || 0, r))
          e.height && this.$set(item, 'h', bigDiv(e.height || 0, r))
        }

        e.left && this.$set(item, 'x', bigDiv(e.left || 0, r))
        e.top && this.$set(item, 'y', bigDiv(e.top || 0, r))
        e.width && this.$set(item, 'lw', bigTimes(item.w, p))
      }

      if (item.type === 'text') {
        e.width && this.$set(item, 'w', bigDiv(e.width || 0, r))
        e.height && this.$set(item, 'h', bigDiv(e.height || 0, r))
        e.left && this.$set(item, 'x', bigDiv(e.left || 0, r))
        e.top && this.$set(item, 'y', bigDiv(e.top || 0, r))
      }
    },

    // 移动转换计算
    dragStop (index: number, e: any) {
      this.toQrFormat(index, e)
    },

    // 二维码放大缩小计算
    resizeStop (index: number, e: any) {
      this.toQrFormat(index, e)
    },

    // 修改qr宽高
    changeQrW () {
      const qrw = [] as any
      _.forEach(this.available, v => {
        if (this.qrs[this.qrActive].w <= v) {qrw.push(v)}
      })
      this.qrs[this.qrActive].h = this.qrs[this.qrActive].w = qrw[0] || this.available[0] || this.qrs[this.qrActive].w
    },

    // 获取点击index
    onActivated (index: number) {
      this.qrActive = index
      this.isSelect = index
    },

    // 选中QR列表
    changeQRList (index: number) {
      this.qrActive = index
      this.isSelect = index
    },

    onDeActivated () {
      // if (this.qrActive === index) this.qrActive = -1
    },

    // 删除二维码
    deleteQr () {
      if (this.qrs.length === 0) {
        return
      }
      this.$confirm(`是否删除${this.qrActive + 1}号二维码/文字?`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        this.qrs.splice(this.qrActive, 1)
        this.qrActive--
        if (this.qrActive === -1) {
          this.qrActive = 0
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })

    },

    // 撤销
    cancel () {
      if (this.qrs.length < 1) {
        // console.log('this.qrs.length', this.qrs.length)
        return
      }
      this.qrActive = 0
      this.qrs = this.saveQrs
    },

    // 敬请期待
    open () {
      this.$alert('功能尚未完成，敬请期待', '提示', { confirmButtonText: '确定' })
    },

    // 添加logo 文件
    async beforeAvatarUploadLogo (file: any) {
      const type = file.name.split('.').pop().toLowerCase()
      const fileType = ['jpg', 'jpeg', 'png'].some(item => item === type)
      if (!fileType) {
        this.$message('格式错误！请重新选择')
        const elUpload = this.$refs['upload'] as ElUpload
        elUpload.abort(file)
        return
      }
      // const result = await uCgi.StoreOssToken({ path: this.path })
      const result = await uCgi.MarkUploadTokenMaGet({ type: 'logo', draftId: this.draftId })
      if (result.code === 200) {
        const uploaderSignLogo = result.body || {}
        const type = file.name.split('.').pop().toLowerCase()
        let uploaderDataLogo = {
          OSSAccessKeyId: uploaderSignLogo['accessid'],
          policy: uploaderSignLogo['policy'],
          Signature: uploaderSignLogo['signature'],
          key: uploaderSignLogo['dir'] + '.' + type,
          success_action_status: 200
        }

        this.uploaderSignLogo = uploaderSignLogo
        this.uploaderDataLogo = uploaderDataLogo
        file.key = this.uploaderDataLogo.key
      }

    },

    // 添加logo--上传图片成功,并赋值
    handleAvatarSuccessLogo (response: any, file: any) {
      const qr = this.qrs[this.qrActive] as Dic<any>[]
      this.$set(qr, 'l', file.raw.key)
      this.$notify({ title: '成功', message: '上传成功', type: 'success' })
    },

    // 添加logo--上传图片失败
    uploadErrorLogo () {
      this.$notify({ title: '请注意', message: '上传失败，请重试', type: 'warning' })
    },

  }
})

</script>

<style lang="scss">

.graph-detail-cp-detail {
  background-color: #F0F2F5;

  .graph-detail-cp-top {
    height: 64px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 1px 4px 0 rgba(153, 153, 153, 0.2);
    display: flex;
    justify-content: space-between;
    padding: 0 40px;

    .navigation_logo_cp-top {

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

    .graph_name {
      font-size: 18px;
      line-height: 64px;
      color: #999999;
      cursor: pointer;

      &:hover {
        color: #47494e;
      }
    }

    .navigation_bar_cp-top {
      z-index: 999;

      .exhibition_cp_btn {
        display: flex;
        justify-content: space-between;
        padding: 16px 0;

      }

    }
  }

  .frm_tip {
    font-size: 12px;
    color: #8d8d8d;
    line-height: 18px;
  }

  .operation {
    width: 280px;
    height: 100%;
    min-height: 700px;
    background-color: #FAFAFA;
    z-index: 99;
    position: fixed;
    top: 64px;

    .graph_form_info {
      .graph_form_info_text {
        color: rgba(153, 153, 153, 1);
      }

    }

    .graph_operation_cp {
      position: absolute;
      bottom: 80px;
      width: 100%;

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
      padding: 70px 300px 0 300px;
      margin-right: 300px;
      /*background-color: peru;*/

      .paper_wh {
        font-size: 14px;
        color: rgba(24, 144, 255, 1);
        position: absolute;
        top: 26px;
        left: 50%;
        transform: translateX(-50%);

      }

      .exhibition_img {
        max-width: 80%;
        margin: 0 auto;
        max-height: calc(100vh - 170px);
        background-color: #F0F2F5;
        overflow: scroll;
        position: relative;

        &::-webkit-scrollbar-thumb {

          background-color: #dddddd;
          background-clip: padding-box;
          min-height: 28px;
          width: 1px;

        }

        &::-webkit-scrollbar-track-piece {
          background-color: #f8f8f8;
        }

        &::-webkit-scrollbar {
          width: 2px;
          height: 2px;
        }

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

      &.QR_text {

        .QRTwo {
          margin-top: 14px;

          .el-input__inner {
            width: 106px;
            text-align: center;
            padding-left: 28px;
            padding-right: 28px;
          }

          .ranks_icon_WH_width_color {
            .el-input__inner {
              width: 229px;
              padding-left: 6px;
              padding-right: 28px;
              text-align: left;
            }

          }

        }

      }

      p {
        height: 28px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(102, 102, 102, 1);
        line-height: 28px;
        margin-bottom: 8px;
        margin-top: 4px;
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

        .ranks_icon_WH_width_color {
          .el-input__inner {
            width: 229px;
            padding-left: 6px;
            padding-right: 28px;
            text-align: left;
          }
        }

        .ranks_icon_WH_width_color_text {
          .el-input__inner {
            width: 106px;
            padding-left: 6px;
            padding-right: 28px;
            text-align: left;
          }

        }

        .ranks_icon_WH_width {
          .el-input__inner {
            width: 106px;
            padding-left: 6px;
            padding-right: 28px;
            text-align: left;
          }

          .text_s {
            .el-input__inner {
              text-align: center;
              width: 106px;
              padding-left: 28px;
              padding-right: 28px;

            }
          }

          .text-size {

            .el-input.el-input--suffix {
              height: 28px;

              .el-input__inner {
                height: 28px;

              }

              .el-input__suffix {
                top: 3px;

              }

            }
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

        .logo_ranks_icon_WH_width_text {
          .el-input__inner {
            width: 230px;
            padding-left: 6px;
            padding-right: 6px;
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

        .ranks_icon_text {
          font-size: 12px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          z-index: 999;

          &.text_s {
            background-color: #333333;
          }

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
          left: 100px;
          top: 5px;
          /*background-color: #fff;*/
        }

        .ranks_icon_WH_H {
          font-size: 12px;
          color: rgba(153, 153, 153, 1);
          z-index: 999;
          position: absolute;
          left: 228px;
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

          &.C {
            left: 90px;
            top: 22px;
          }

          &.BC {
            top: 22px;
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
            width: 230px;
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
      height: calc(100vh - 642px);

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

    .graph_line {
      width: 100%;
      height: 1px;
      background-color: #EEEEEE;
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

  .showCreateGraph {

    .el-dialog {
      width: 464px;
      min-height: 300px;

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

        &.print {
          padding-top: 20px;
        }
      }
    }

    .graph-create {
      .el-input {
        height: 36px;

        .el-input__inner {
          height: 36px;
        }
      }

      &.print {
        padding-bottom: 20px;
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

}

.el-input__inner {
  border-radius: 2px;
}

.el-textarea__inner {
  border-radius: 2px;
}

.el-popper.el-cascader__dropdown {
  z-index: 2042 !important;

}
</style>
