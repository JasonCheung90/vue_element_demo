<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="showCateDialog">添加分类</el-button>
      <!-- 角色列表 -->
      <zk-table
      ref="table"
      index-text="#"
      show-index
      stripe
      border
      :data="cateList"
      :columns="columns"
      :expand-type="false"
      :selection-type="false">
      <template slot="isEffective" scope="props">
        <i class="el-icon-success lightGreen" v-if="props.row.cat_deleted == false"></i>
        <i class="el-icon-error red" v-else></i>
      </template>
      <template slot="sort" scope="props">
        <el-tag v-if="props.row.cat_level ==0">一级</el-tag>
        <el-tag type="success" v-else-if="props.row.cat_level ==1">二级</el-tag>
        <el-tag type="warning" v-else>三级</el-tag>
      </template>
      <template slot="operation" scope="props">
        <el-button type="primary"
        icon="el-icon-edit"
        size="mini"
        @click="showEditCate(props.row.id)">
          编辑
        </el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini"
          @click="deleteCate(props.row.id)">
          删除
        </el-button>
      </template>
    </zk-table>
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
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="cateDialogVisible"
      @close="resetCateForm"
      width="50%"
     >
      <el-form :model="addCateForm" :rules="cateRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
          v-model="selectCate"
          :options="parentCateList"
          :props="cascaderProps"
          clearable
          change-on-select
          @change="parentCateChanged"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateDialogVisible = !cateDialogVisible">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'categories',
  data () {
    return {
      // 请求参数
      queryInfo: {
        type: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总页数
      total: 0,
      // 控制显示添加分类的开关
      cateDialogVisible: false,
      // 分类列表
      cateList: [],
      // table列的数据
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isEffective'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      // 添加分类表单
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加角色表单验证规则
      cateRules: {
        cat_name: [
          { required: true, message: '请输入分类名', trigger: 'blur' }
        ]
      },
      // 选中的父级分类数组
      selectCate: [],
      // 父级分类数据列表
      parentCateList: [],
      // 层级表单的配置数据
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      }
    }
  },
  methods: {
    // 请求分类数据
    async getCateList () {
      const { data: result } = await this.axios.get('categories', { params: this.queryInfo })
      if (result.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.total = result.data.total
      this.cateList = result.data.result
    },
    // 每页显示数据改变时会触发
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 当前页面改变时会触发
    handleCurrentChange (newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getCateList()
    },
    // 展示添加分类对话框
    showCateDialog () {
      this.getParentCateList()
      this.cateDialogVisible = !this.cateDialogVisible
    },
    // 请求父级分类数据列表
    async getParentCateList () {
      const { data: result } = await this.axios.get('categories', { params: { type: 2 } })
      if (result.meta.status !== 200) return this.$message.error('获取父级分类列表失败')
      this.parentCateList = result.data
    },
    // 分类选择项选中发送变化触发
    parentCateChanged () {
      if (this.selectCate.length > 0) {
        this.addCateForm.cat_pid = this.selectCate[this.selectCate.length - 1]
        this.addCateForm.cat_level = this.selectCate.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 重置添加分类表单
    resetCateForm () {
      this.$refs.addCateFormRef.resetFields()
      this.selectCate = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 点击确定按钮添加分类
    addCate () {
      this.$refs.addCateFormRef.validate(async check => {
        if (!check) return false
        const { data: result } = await this.axios.post('categories', this.addCateForm)
        if (result.meta.status !== 201) {
          return this.$message.error('创建分类失败')
        }
        this.$message.success(result.meta.msg)
        this.getCateList()
        this.cateDialogVisible = !this.cateDialogVisible
      })
    },
    showEditCate () {},
    deleteCate () {}
  },
  created () {
    this.getCateList()
  }
}
</script>
<style lang="less" scoped>
.lightGreen {
  color: lightgreen;
}
.red {
  color: red;
}
.zk-table {
  margin-top: 15px;
}
</style>
