<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片面板 -->
    <el-card>
      <!-- 搜索与添加用户 -->
      <el-row :gutter="30">
        <el-col :span="12">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
          <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="userDialogVisible = !userDialogVisible">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table
        :data="userList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="150">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="220">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="状态"
           width="80">
           <template slot-scope="props">
              <el-switch
              v-model="props.row.mg_state"
              @change="getUserStateChange(props.row)">
              </el-switch>
            </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="props">
            <el-button type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditUser(props.row.id)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(props.row.id)"></el-button>
            <el-tooltip  effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="userDialogVisible"
      @close="resetUserForm"
      width="50%"
     >
      <el-form :model="addUserForm" :rules="userRules" ref="addUserFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱号" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = !userDialogVisible">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
     <el-dialog
      title="编辑修改用户"
      :visible.sync="userEditDialog"
      @close="resetUserEditForm"
      width="50%"
     >
      <el-form :model="userEditForm" :rules="userRules" ref="userEditFormRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input disabled v-model="userEditForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱号" prop="email">
          <el-input v-model="userEditForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userEditForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userEditDialog = !userEditDialog">取 消</el-button>
        <el-button type="primary" @click="userEditCommit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'users',
  data () {
    var checkEmail = (rule, value, callback) => {
      const emailReg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (emailReg.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的邮箱号'))
    }
    var checkMobile = (rule, value, callback) => {
      const mobileReg = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
      if (mobileReg.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      // 用户数据列表
      userList: [],
      // 显示添加用户信息对话框开关
      userDialogVisible: false,
      // 显示修改用户信息对话框开关
      userEditDialog: false,
      // 添加用户表单
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户表单
      userEditForm: {
        id: '',
        role_id: '',
        mobile: '',
        email: ''
      },
      // 用户表单验证规则
      userRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度在 6 到 15个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱号', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUserList () {
      const { data: result } = await this.axios.get('users', { params: this.queryInfo })
      if (result.meta.status !== 200) return this.$message.error('获取用户失败')
      this.total = result.data.total
      this.userList = result.data.users
      // console.log(result)
    },
    // pageSize 改变时会触发
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // currentPage 改变时会触发
    handleCurrentChange (newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getUserList()
    },
    // 监听switch开关改变
    async getUserStateChange (userInfo) {
      const { data: result } = await this.axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (result.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户失败')
      }
      this.$message.success('更新用户成功')
    },
    // 重置添加用户表单
    resetUserForm () {
      this.$refs.addUserFormRef.resetFields()
    },
    // 提交表单添加用户
    addUser () {
      this.$refs.addUserFormRef.validate(async check => {
        if (!check) return false
        const { data: result } = await this.axios.post('users', this.addUserForm)
        if (result.meta.status !== 201) {
          return this.$message.error('创建用户失败')
        }
        this.$message.success(result.meta.msg)
        this.userDialogVisible = !this.userDialogVisible
        this.getUserList()
      })
    },
    // 修改编辑用户
    async showEditUser (id) {
      this.userEditDialog = !this.userEditDialog
      const { data: result } = await this.axios.get(`users/${id}`)
      if (result.meta.status !== 200) {
        return this.$message.error('查询用户数据失败')
      }
      this.userEditForm = result.data
    },
    // 重置修改用户表单
    resetUserEditForm () {
      this.$refs.userEditFormRef.resetFields()
    },
    // 修改用户表单提交
    userEditCommit () {
      this.$refs.userEditFormRef.validate(async check => {
        if (!check) return false
        const { data: result } = await this.axios.put(`users/${this.userEditForm.id}`, this.userEditForm)
        if (result.meta.status !== 200) {
          return this.$message.error('更新用户失败')
        }
        this.userEditDialog = !this.userEditDialog
        this.getUserList()
        this.$message.success(result.meta.msg)
      })
    },
    // 根据用户ID 删除对应的用户
    async deleteUser (id) {
      const confirmRes = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmRes !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: result } = await this.axios.delete(`users/${id}`)
      if (result.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success(result.meta.msg)
      this.getUserList()
    }
  },
  created () {
    this.getUserList()
  }
}
</script>
<style lang="less" scoped>
</style>
