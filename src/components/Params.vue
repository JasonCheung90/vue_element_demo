<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
      title="注意！ 只允许为第三级分类设置相关参数"
      type="warning"
      show-icon
      :closable="false">
      </el-alert>
      <p>选择商品分类：
        <el-cascader
          v-model="selectCate"
          :options="cateList"
          :props="cascaderProps"
          clearable
          @change="CateChanged"
          >
          </el-cascader>
      </p>
      <el-tabs v-model="activeName" @tab-click="handleTab">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini"
          :disabled="btnIsShow"
          @click="addParamsShow = !addParamsShow">
           添加参数
          </el-button>
          <el-table
              :data="manyData"
              border
              stripe
              style="width: 100%">
              <el-table-column
                type="expand">
                <template slot-scope="props">
                  <el-tag closable v-for="(item, index) of props.row.attr_vals" :key="index"
                  @close="handleClose(props.row,index)">
                    {{item}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="props.row.inputVisible"
                    v-model="props.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(props.row)"
                    @blur="handleInputConfirm(props.row)"
                  >
                  </el-input>
                  <el-button v-else
                  class="button-new-tag"
                  size="small" @click="showInput(props.row)">
                    + New Tag
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                type="index"
                label="#">
              </el-table-column>
              <el-table-column
                prop="attr_name"
                label="参数名称">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="props">
                  <el-button type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditAttr(props.row.attr_id)">
                  </el-button>
                  <el-button  type="danger"
                  icon="el-icon-delete" size="mini"
                  @click="deleteAttr(props.row.attr_id)">
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="btnIsShow"
          @click="addParamsShow = !addParamsShow">添加属性</el-button>
          <el-table
              :data="onlyData"
              border
              stripe
              style="width: 100%">
              <el-table-column
                type="expand">
                <template slot-scope="props">
                  <el-tag closable v-for="(item, index) of props.row.attr_vals" :key="index"
                  @close="handleClose(props.row,index)">
                    {{item}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="props.row.inputVisible"
                    v-model="props.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(props.row)"
                    @blur="handleInputConfirm(props.row)"
                  >
                  </el-input>
                  <el-button v-else
                  class="button-new-tag"
                  size="small" @click="showInput(props.row)">
                    + New Tag
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                type="index"
                label="#">
              </el-table-column>
              <el-table-column
                prop="attr_name"
                label="参数名称">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="props">
                  <el-button type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditAttr(props.row.attr_id)">
                  </el-button>
                  <el-button  type="danger"
                  icon="el-icon-delete" size="mini"
                  @click="deleteAttr(props.row.attr_id)">
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加属性对话框 -->
    <el-dialog
      :title="'添加'+ getTitle"
      :visible.sync="addParamsShow"
      @close="resetaddForm"
      width="50%"
     >
     <el-form :model="addAttrForm" :rules="attrRules" ref="attrFormRef" label-width="100px">
        <el-form-item :label="getTitle" prop="attr_name">
          <el-input v-model="addAttrForm.attr_name" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsShow = !addParamsShow">取 消</el-button>
        <el-button type="primary" @click="addParamCommit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改属性对话框 -->
     <el-dialog
      :title="'修改'+ getTitle"
      :visible.sync="attrEditDialog"
      width="50%"
     >
      <el-form :model="editAttrForm" :rules="attrRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="getTitle" prop="attr_name">
          <el-input v-model="editAttrForm.attr_name" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="attrEditDialog = !attrEditDialog">取 消</el-button>
        <el-button type="primary" @click="attrEditCommit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'params',
  data () {
    return {
      // 分类列表
      cateList: [],
      // 层级表单的配置数据
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 选中的父级分类数组
      selectCate: [],
      // 激活选中的页签
      activeName: 'many',
      // 动态数据
      manyData: [],
      // 静态数据
      onlyData: [],
      // 控制显示添加属性的开关
      addParamsShow: false,
      // 控制显示修改属性的开关
      attrEditDialog: false,
      // 添加属性表单
      addAttrForm: {
        attr_name: ''
      },
      // 修改属性表单
      editAttrForm: {
        attr_name: ''
      },
      // 表单验证规则
      attrRules: {
        attr_name: [
          { required: true, message: '请输入参数名', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 请求分类数据
    async getCateList () {
      const { data: result } = await this.axios.get('categories')
      if (result.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.cateList = result.data
    },
    // 选中第三级商品分类的事件
    CateChanged () {
      this.getParamsData()
    },
    // 切换tab面板事件
    handleTab (tab, event) {
      this.getParamsData()
    },
    // 获取参数列表数据
    async getParamsData () {
      if (this.selectCate.length !== 3) {
        this.selectCate = []
        this.manyData = []
        this.onlyData = []
        return false
      }
      const { data: result } = await this.axios.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (result.meta.status !== 200) return this.$message.error('获取参数列表失败')
      result.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyData = result.data
      } else {
        this.onlyData = result.data
      }
    },
    resetaddForm () {
      this.$refs.attrFormRef.resetFields()
    },
    // 添加参数提交
    addParamCommit () {
      this.$refs.attrFormRef.validate(async check => {
        if (!check) return false
        const { data: result } = await this.axios.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addAttrForm.attr_name,
          attr_sel: this.activeName
        })
        if (result.meta.status !== 201) {
          return this.$message.error('添加属性失败')
        }
        this.$message.success(result.meta.msg)

        this.getParamsData()
        this.addParamsShow = !this.addParamsShow
      })
    },
    // 修改属性
    async showEditAttr (attrId) {
      const { data: result } = await this.axios.get(`categories/${this.cateId}/attributes/${attrId}`, { params: { attr_sel: this.activeName } })
      if (result.meta.status !== 200) return this.$message.error('获取参数列表失败')
      this.editAttrForm = result.data
      this.attrEditDialog = !this.attrEditDialog
    },
    // 修改属性提交
    attrEditCommit () {
      this.$refs.editFormRef.validate(async check => {
        if (!check) return false
        const { data: result } = await this.axios.put(`categories/${this.cateId}/attributes/${this.editAttrForm.attr_id}`, {
          attr_name: this.editAttrForm.attr_name,
          attr_sel: this.activeName
        })
        if (result.meta.status !== 200) {
          return this.$message.error('更新属性失败')
        }
        this.$message.success(result.meta.msg)

        this.getParamsData()
        this.attrEditDialog = !this.attrEditDialog
      })
    },
    // 删除属性
    async deleteAttr (attrId) {
      const confirmRes = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)

      if (confirmRes !== 'confirm') return this.$message.info('已经取消删除')
      const { data: result } = await this.axios.delete(`categories/${this.cateId}/attributes/${attrId}`)
      if (result.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success(result.meta.msg)
      this.getParamsData()
    },
    // 按下enter键或者失去鼠标焦点触发
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveParams(row)
    },
    // 向后台修改属性数据
    async saveParams (row) {
      const { data: result } = await this.axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (result.meta.status !== 200) return this.$message.error('修改参数失败')
      this.$message.success('修改参数成功')
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose (row, index) {
      row.attr_vals.splice(index, 1)
      this.saveParams(row)
    }
  },
  computed: {
    // 动态启用和禁用按钮
    btnIsShow () {
      if (this.selectCate.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 获取动态的第三级参数Id
    cateId () {
      if (this.selectCate.length === 3) {
        return this.selectCate[2]
      } else {
        return null
      }
    },
    getTitle () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  created () {
    this.getCateList()
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 10px 10px;
}
.input-new-tag {
  width: 200px
}
</style>
