<template>
<div class="home_cp clearfix">
  <div style="width: 1280px;margin: 0 auto">

    <div class="show_info fl clearfix">
      <div class="show_number fl show_number1">
        <div class="clearfix">
          <p class="show_title">模版数量</p>
          <p class="show_num" v-if="graphCount">{{graphCount}} <span class="num"> /个</span></p>
        </div>
        <div :key="i" class="show_list clearfix" v-for="(item,i) in graphCountSelect" v-if="graphCountSelect.length > 0">
          <div class="show_list_title fl title1"><span v-if="item.name">{{item.name}}</span><span v-else>暂无</span></div>
          <div class="show_list_title fl title2"><span v-if="item.operator">{{item.operator.name}}</span><span v-else>暂无</span></div>
          <div class="show_list_title fl title3"><span v-if="item.created">{{item.created | dateFormat}}</span><span v-else>暂无</span></div>
<!--          <div class="show_list_title fl title4">-->
<!--            <span @click="graphProduct(item.graphId,$event)" class="show_product" v-if="item.process === 'previewed' || item.process === 'printed'|| item.type === 'simple'">生产</span>-->
<!--            <span @click="graphDetail(item.graphId, $event)" class="show_ui" v-if="item.type === 'normal'">设计</span>-->
<!--            <span @click="clickQRDetail(item.graphId, $event)" class="show_ui" v-if="item.type === 'simple'">设计</span>-->
<!--          </div>-->
        </div>
        <div style="color: #bbb;font-size: 18px;text-align: center;line-height: 160px" v-if="graphCountSelect.length <= 0">暂无模版</div>
      </div>
      <div class="show_number fr">
        <div class="clearfix">
          <p class="show_title">模板生成记录</p>
          <p class="show_num" v-if="graphPrintCount">{{graphPrintCount}}<span class="num"> /次</span></p>
        </div>
        <div class="show_list clearfix" v-for="item in graphPrintCountSelect" v-if="graphPrintCountSelect.length > 0">
          <div class="show_list_title fl titlePrint1"><span v-if="item.name">{{item.name}}</span><span v-else>暂无</span></div>
          <div class="show_list_title fl titlePrint2">生成版数：<span v-if="item.pageCount">{{item.pageCount}}</span><span v-else>0</span> 版</div>
          <div class="show_list_title fl titlePrint3"><span v-if="item.printAt">{{item.printAt | dateFormat}}</span> <span v-else>暂无</span></div>
<!--          <div class="show_list_title fl titlePrint4">-->
<!--            <span @click="graphProduct(item.graphId,$event)" class="show_ui">查看</span>-->
<!--          </div>-->
        </div>
        <div style="color: #bbb;font-size: 18px;text-align: center;line-height: 160px" v-if="graphPrintCountSelect.length <= 0">暂无模版生成记录</div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import uCgi from '~/app/@biz/uCgi'
import uHelper from '~/app/@biz/uHelper'
import uPassport from '~/app/@biz/uPassport'
import Vue from 'vue'

export default Vue.extend({
  name: 'home',
  layout: 'default_cp',
  components: {},
  data () {
    return {
      tagCountSelect: [] as any,
      graphCountSelect: [] as any,
      graphPrintCountSelect: [] as any,

    }
  },

  filters: {
    dateFormat: (value: number) => {
      return uHelper.dateFormat(value, 'YYYY-MM-DD HH:mm:ss')
    },
  },

  async asyncData () {
    const result = await uCgi.GatherHome()
    const companyCount = result.body ? result.body.companyCount : ''
    const companyList = result.body ? result.body.companyList : []
    const graphList = result.body ? result.body.graphList : []
    const graphPrintList = result.body ? result.body.graphPrintList : []

    const tagCountSelect = companyList ? companyList.slice(0, 3) : []
    const graphCount = result.body ? result.body.graphCount : ''

    const graphCountSelect = graphList ? graphList.slice(0, 3) : []
    const graphPrintCount = result.body ? result.body.graphPrintCount : ''

    const graphPrintCountSelect = graphPrintList ? graphPrintList.slice(0, 3) : []

    return {
      companyCount: '',
      tagCountSelect: [],

      graphCount: '',
      graphCountSelect: [],

      graphPrintCount: '',
      graphPrintCountSelect: [],
    }
  },

  methods: {

    //跳转模版管理页面
    toGraphCount () {
      console.log('跳转模版管理页面')
      this.$router.push({ path: '/mp/graph' })
    },
    //跳转客户管理
    toTypeList () {
      console.log('跳转客户管理')
      this.$router.push({ path: '/mp/client_list' })
    },


    //跳转生产页面
    graphProduct (graphId: string, event: Event) {
      //阻止点击穿透
      event.stopPropagation()
      this.$router.push({ path: '/mp/graph/product/' + graphId })
    },

    //跳转设计页面
    graphDetail (graphId: string, event: Event) {
      //阻止点击穿透
      event.stopPropagation()
      this.$router.push({ path: '/mp/graph/detail/' + graphId })
    },

    clickQRDetail (graphId: string, event: Event) {
      event.stopPropagation()
      this.$router.push({ path: '/mp/graph/detail_qr/' + graphId })
    },

  },
})
</script>

<style lang="scss">
.home_cp {
  padding: 24px 40px;


  .show_info {
    /*width: calc(100% - 190px);*/
    min-width: 1008px;
    width: 100%;

    .show_number {
      cursor: pointer;

      width: 49%;
      min-width: 500px;
      /*height: 288px;*/
      height: calc(100vh - 560px);
      min-height: 288px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 2px 10px 0 rgba(153, 153, 153, 0.2);
      border-radius: 4px;
      padding: 16px;
      margin-bottom: 24px;

      .show_title {
        height: 56px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 56px;
        float: left;
      }

      .show_num {
        float: right;
        height: 56px;
        font-size: 40px;
        font-weight: 600;
        color: rgba(24, 144, 255, 1);
        line-height: 56px;

        .num {
          height: 20px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          line-height: 20px;
        }
      }

      .show_list {
        width: 100%;
        height: 25%;
        margin-bottom: 10px;
        border-bottom: 1px solid #EEEEEE;
        font-size: 14px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);

        .show_list_title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: relative;
          top: 50%;
          transform: translateY(-50%);

          &.title1 {
            padding-right: 10px;
            width: 28%;
          }

          &.title2 {
            padding-right: 10px;
            width: 22%;
          }

          &.title3 {
            padding-right: 10px;
            width: 35%;
          }

          &.title4 {
            text-align: right;
            width: 15%;

          }

          &.titlePrint1 {
            padding-right: 10px;
            width: 25%;

          }

          &.titlePrint2 {
            padding-right: 10px;
            width: 30%;
          }

          &.titlePrint3 {
            padding-right: 10px;
            width: 35%;
          }

          &.titlePrint4 {
            text-align: right;
            width: 10%;
          }

          .show_product {
            color: rgba(24, 85, 255, 1);
            cursor: pointer;

            &:hover {
              color: rgba(24, 85, 255, .7);
            }
          }

          .show_ui {
            cursor: pointer;
            color: rgba(24, 144, 255, 1);

            &:hover {
              color: rgba(24, 144, 255, .7);
            }
          }
        }

      }
    }

  }


}


</style>
