<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索订单 -->
      <el-row :gutter="30">
        <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
          <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
        </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表 -->
      <el-table
        :data="orderList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="40">
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="350">
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="80">
        </el-table-column>
        <el-table-column
          prop="pay_status"
          label="是否付款"
           width="150">
          <template slot-scope="props">
            <el-tag type="success" v-if="props.row.pay_status == 1">已付款</el-tag>
            <el-tag type="warning" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="80">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="下单时间">
          <template slot-scope="props">
            <template>
              {{props.row.create_time ? new Date(props.row.create_time).toLocaleDateString() : ""}}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200">
          <template slot-scope="props">
            <el-button type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditOrder(props.row.goods_id)">
            </el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="orderExpress(props.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,5,10,20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
     <el-dialog
      title="编辑修改地址"
      :visible.sync="orderEditDialog"
      width="50%"
      @close="resetOrderForm"
     >
      <el-form :model="orderEditForm" :rules="orderRules" ref="orderEditFormRef" label-width="100px">
        <el-form-item label="省市" prop="addressOne">
          <el-cascader
          v-model="orderEditForm.addressOne"
          :options="cityData"
          :props="{ expandTrigger: 'hover' }"
          clearable
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="addressTwo">
          <el-input v-model="orderEditForm.addressTwo" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderEditDialog = !orderEditDialog">取 消</el-button>
        <el-button type="primary" @click="orderEditCommit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看物流对话框 -->
     <el-dialog
      title="查看物流"
      :visible.sync="orderExpressDialog"
      width="50%"
     >
     <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in expressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderExpressDialog = !orderExpressDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '@/citydata.js'
export default {
  name: 'orders',
  data () {
    return {
      // 请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总共订单条数
      total: 0,
      // 订单列表数据
      orderList: [],
      // 控制显示修改地址的开关
      orderEditDialog: false,
      orderExpressDialog: false,
      // 修改地址表单
      orderEditForm: {
        addressOne: [],
        addressTwo: ''
      },
      orderRules: {
        addressOne: [
          { required: true, message: '请选择省市', trigger: 'blur' }
        ],
        addressTwo: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      expressInfo: []

    }
  },
  methods: {
    // 请求订单数据列表
    async getOrderList () {
      const { data: result } = await this.axios.get('orders', { params: this.queryInfo })
      if (result.meta.status !== 200) return this.$message.error('获取订单数据失败')
      this.total = result.data.total
      this.orderList = result.data.goods
    },
    // pageSize 改变时会触发
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // currentPage 改变时会触发
    handleCurrentChange (newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getOrderList()
    },
    // 修改地址
    showEditOrder () {
      this.orderEditDialog = true
    },
    // 重置地址表单
    resetOrderForm () {
      this.$refs.orderEditFormRef.resetFields()
    },
    orderEditCommit () {

    },
    async orderExpress () {
      const { data: result } = await this.axios.get('/kuaidi/1106975712662')
      if (result.meta.status !== 200) return this.$message.error('获取物流数据失败')
      this.expressInfo = result.data
      this.orderExpressDialog = true
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%
}
</style>
