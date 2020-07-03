<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索与添加商品 -->
      <el-row :gutter="30">
        <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodList">
          <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
        </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table
        :data="goodList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="40">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="650">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格"
          width="80">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="80">
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间">
          <template slot-scope="props">
            <template>
              {{props.row.add_time ? new Date(props.row.add_time).toLocaleDateString() : ""}}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="props">
            <el-button type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditGood(props.row.goods_id)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(props.row.goods_id)"></el-button>
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
    <!-- 修改商品对话框 -->
    <el-dialog
      title="编辑修改商品"
      :visible.sync="goodEditDialog"
      width="50%"
     >
      <el-form :model="goodEditForm" :rules="goodRules" ref="goodEditFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodEditForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goodEditForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goodEditForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="goodEditForm.goods_number" type="number"></el-input>
            </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goodEditDialog = !goodEditDialog">取 消</el-button>
        <el-button type="primary" @click="goodEditCommit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'goods',
  data () {
    return {
      // 请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总共商品条数
      total: 0,
      // 显示添加商品信息对话框开关
      goodsDialogVisible: false,
      // 显示修改商品信息对话框开关
      goodsEditDialog: false,
      // 商品数据列表
      goodList: [],
      goodEditDialog: false,
      // 商品表单
      goodEditForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      goodRules: {
        goods_name: [
          { required: true, message: '请输入商品名', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入重量', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 请求商品数据
    async getGoodList () {
      const { data: result } = await this.axios.get('goods', { params: this.queryInfo })
      if (result.meta.status !== 200) return this.$message.error('获取商品数据失败')
      this.total = result.data.total
      this.goodList = result.data.goods
    },
    // pageSize 改变时会触发
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodList()
    },
    // currentPage 改变时会触发
    handleCurrentChange (newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getGoodList()
    },
    // 重置添加商品列表
    resetGoodForm () {
      this.$refs.addGoodFormRef.resetFields()
    },
    // 编辑商品
    async showEditGood (id) {
      this.goodEditDialog = !this.goodEditDialog
      const { data: result } = await this.axios.get(`goods/${id}`)
      if (result.meta.status !== 200) {
        return this.$message.error('查询商品数据失败')
      }
      this.goodEditForm = result.data
    },
    // 编辑商品提交
    goodEditCommit () {
      this.$refs.goodEditFormRef.validate(async check => {
        if (!check) return false
        const { data: result } = await this.axios.put(`goods/${this.goodEditForm.goods_id}`, this.goodEditForm)

        if (result.meta.status !== 200) {
          return this.$message.error('修改商品失败')
        }
        this.goodEditDialog = !this.goodEditDialog
        this.getGoodList()
        this.$message.success(result.meta.msg)
      })
    },
    // 根据商品ID删除对应的商品
    async deleteGoods (goodsId) {
      const confirmRes = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmRes !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: result } = await this.axios.delete(`goods/${goodsId}`)
      if (result.meta.status !== 200) {
        return this.$message.error('删除商品失败')
      }
      this.$message.success(result.meta.msg)
      this.getGoodList()
    },
    // 跳转添加商品页面
    goAddGoods () {
      this.$router.push({ name: 'addgoods' })
    }
  },
  created () {
    this.getGoodList()
  }
}
</script>
<style lang="less" scoped>
</style>
