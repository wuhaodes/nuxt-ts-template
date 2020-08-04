<template>
<div class="QR">
  <div class="list_title clearfix">
    <div class="title fl " style="text-align: left">二维码生成列表<span style="color: #999999;"></span></div>
    <div class="list-operate fr ">
      <el-button @click="createQR" type="primary">生成二维码</el-button>
    </div>
  </div>

  <div class="page-content">
    <div class="list-table">
      <el-table
        :data="QRList"
        class="table-gary-bg"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="80">
        </el-table-column>
        <el-table-column
          label="生成ID"
          prop="codeId">
        </el-table-column>
        <el-table-column
          label="生成数量"
          prop="count">
        </el-table-column>
        <el-table-column
          label="生成者"
          prop="creator">
          <template slot-scope="scope">
          <span v-if="scope.row.creator && scope.row.creator.name  ">{{scope.row.creator.name}} </span>
          <span v-else> 暂无 </span>
          </template>
        </el-table-column>
        <el-table-column
          label="生成时间"
          prop="created">
          <template slot-scope="scope">
          {{scope.row.created | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
          <div v-if="scope.row.process==='pended'">生成中...</div>
          <div v-if="scope.row.process==='completed'">已完成</div>
          <div v-if="scope.row.process==='suspend'">生成失败</div>

          <!--                <div class="point_wrong" v-if="scope.row.process==='suspend'">-->
          <!--                  <el-popover-->
          <!--                    :content="scope.row.reason"-->
          <!--                    placement="right-start"-->
          <!--                    title="错误信息"-->
          <!--                    trigger="hover"-->
          <!--                    width="300">-->
          <!--                    <div slot="reference" style="cursor: pointer;">生成失败</div>-->
          <!--                  </el-popover>-->
          <!--                </div>-->
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          label="操作">
          <template slot-scope="scope">

          <el-button @click="QRDetail(scope.row.codeId)" type="text" v-if="scope.row.process==='completed'">下载</el-button>
          <el-button :disabled="authRole==='map.market.design' || authRole==='map.maker.worker'" @click="QRDelete(scope.row.codeId)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination fr">
        <!--          <el-pagination-->
        <!--            @current-change="handleCurrentChange"-->
        <!--            layout="prev, pager, next,total"-->
        <!--            :total="880">-->
        <!--          </el-pagination>-->
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
  name: 'QRList',
  layout: 'default_detail',

  filters: {
    dateFormat: (value:number) => {
      return uHelper.dateFormat(value, 'YYYY-MM-DD HH:mm:ss')
    }
  },

  data () {
    const passportData = uPassport.getPassportInfo()
    return {
      authRole: passportData.role || '',
      search: '',
      QRList: [],
      dialogVisible: false,
      name: '',
      box: ['', ''],
      rate: 100,
    }
  },

  //获取QR列表
  async asyncData () {
    const result = await uCgi.CodeSelect()
    return {
      QRList: result.body || []
    }
  },
  methods: {
    //currentPage 改变时会触发
    handleCurrentChange (val:any) {
      console.log(`当前页: ${val}`)
    },

    //生成二维码
    createQR () {
      this.$router.push({ path: '/mp/graph/q_r_list/create_qR' })
    },

    // 跳转编辑页面
    QRDetail (codeId:string) {
      this.$router.push({ path: '/mp/graph/q_r_list/detail/' + codeId })
    },

    //删除
    QRDelete (codeId:string) {
      this.$confirm('此操作将永久删除二维码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // console.log('删除', codeId)
        const result = await uCgi.CodeRemove({ codeId: codeId })
        // console.log('result', result)
        if (result.code === 200) {
          const result = await uCgi.CodeSelect()
          this.QRList = result.body || []
          this.$notify({
            title: '成功',
            message: '已删除二维码',
            type: 'success'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })

    }
  }
})
</script>


<style lang="scss">

.QR {
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

    .input-with-select {
      .el-input-group__append {
        border-color: #1890FF;
        background-color: #1890FF;
        color: #fff;
      }

    }

  }

  .el-button--primary {
    padding: 10px 20px;
    border-radius: 2px;
    height: 36px;
    width: 120px;
    margin-left: 16px;
  }

  .page-content {
    background-color: #fff;

    .list-table {
      padding-top: 20px;

      .table-gary-bg {
        th {
          font-size: 12px;
          background-color: #fafafa;
          height: 48px;
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
    }
  }
}


</style>

