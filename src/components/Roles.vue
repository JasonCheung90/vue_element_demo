<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片面板 -->
    <el-card>
      <el-button type="primary" @click="roleDialogVisible = !roleDialogVisible">添加角色</el-button>
      <!-- 角色列表 -->
      <el-table
        :data="roleList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="expand"
          width="50">
          <template slot-scope="props">
            <el-row v-for="(item1, index1) of props.row.children" :key="item1.id"
            :class="['borbot', index1 == 0? 'bortop': '', 'vercenter']">
              <el-col :span="5">
                <el-tag closable
                 @close="removeRight(props.row, item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2, index2) of item1.children" :key="item2.id"
                :class="[ index2 == 0? '': 'bortop', 'vercenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable
                     @close="removeRight(props.row, item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning"
                    closable
                    v-for="(item3, index3) of item2.children" :key="item3.id"
                    @close="removeRight(props.row, item3.id)"
                    :class="[index3 == 0? '': 'bortop']">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
        >
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
        >
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="props">
            <el-button type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditRoles(props.row.id)">
              编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
             @click="deleteRoles(props.row.id)">
              删除
            </el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini"
             @click="assignmentRoles(props.row)">
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="roleDialogVisible"
      @close="resetRoleForm"
      width="50%"
     >
      <el-form :model="addRoleForm" :rules="roleRules" ref="addRoleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = !roleDialogVisible">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 修改角色对话框 -->
     <el-dialog
      title="编辑修改角色"
      :visible.sync="roleEditDialog"
      width="50%"
     >
      <el-form :model="roleEditForm" :rules="roleRules" ref="roleEditFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleEditForm.roleName" ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleEditForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleEditDialog = !roleEditDialog">取 消</el-button>
        <el-button type="primary" @click="roleEditCommit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignmentShow"
      @close="clearDefaultKeys"
      width="50%"
     >
      <el-tree
        :props="rightProps"
        :data="rightList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultKeys"
        ref="treeRef"
        >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignmentShow = !assignmentShow">取 消</el-button>
        <el-button type="primary" @click="assignmentCommit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'roles',
  data () {
    return {
      // 角色列表
      roleList: [],
      // 控制显示添加角色的开关
      roleDialogVisible: false,
      // 控制显示修改角色的开关
      roleEditDialog: false,
      // 添加角色表单
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 修改角色表单
      roleEditForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      // 添加角色表单验证规则
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 控制显示分配权限对话框的开关
      assignmentShow: false,

      // 所有权限数据列表
      rightList: [],
      // 树形控件权限属性
      rightProps: {
        label: 'authName',
        children: 'children'
      },
      defaultKeys: [],
      // 分配权限的roleId
      roleId: ''
    }
  },
  methods: {
    // 请求角色列表数据
    async getRoleList () {
      const { data: result } = await this.axios.get('roles')
      if (result.meta.status !== 200) return this.$message.error('获取用户权限列表失败')
      this.roleList = result.data
    },
    // 重置添加角色表单
    resetRoleForm () {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 提交表单添加角色
    addRole () {
      this.$refs.addRoleFormRef.validate(async check => {
        if (!check) return false
        const { data: result } = await this.axios.post('roles', this.addRoleForm)
        if (result.meta.status !== 201) {
          return this.$message.error('创建角色失败')
        }
        this.$message.success(result.meta.msg)
        this.roleDialogVisible = !this.roleDialogVisible
        this.getRoleList()
      })
    },
    // 修改编辑角色
    async showEditRoles (id) {
      this.roleEditDialog = !this.roleEditDialog
      const { data: result } = await this.axios.get(`roles/${id}`)
      if (result.meta.status !== 200) {
        return this.$message.error('查询角色数据失败')
      }
      this.roleEditForm = result.data
    },
    // 修改角色表单提交
    roleEditCommit () {
      this.$refs.roleEditFormRef.validate(async check => {
        if (!check) return false
        const { data: result } = await this.axios.put(`roles/${this.roleEditForm.roleId}`, this.roleEditForm)
        if (result.meta.status !== 200) {
          return this.$message.error('更新用户失败')
        }
        this.roleEditDialog = !this.roleEditDialog
        this.getRoleList()
        this.$message.success(result.meta.msg)
      })
    },
    // 根据角色ID删除对应的角色
    async deleteRoles (id) {
      const confirmRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)

      if (confirmRes !== 'confirm') return this.$message.info('已经取消删除')
      const { data: result } = await this.axios.delete(`roles/${id}`)
      if (result.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success(result.meta.msg)
      this.getRoleList()
    },
    // 根据ID删除权限
    async removeRight (role, rightId) {
      const confirmRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)

      if (confirmRes !== 'confirm') return this.$message.info('已经取消删除')
      const { data: result } = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      if (result.meta.status !== 200) return this.$message.error('删除权限失败')
      this.$message.success(result.meta.msg)
      role.children = result.data
    },
    // 分配权限
    async assignmentRoles (role) {
      const { data: result } = await this.axios.get('rights/tree')
      if (result.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.rightList = result.data
      this.roleId = role.id
      this.getDefaultKeys(role, this.defaultKeys)
      this.assignmentShow = !this.assignmentShow
    },
    // 递归函数
    getDefaultKeys (ele, arr) {
      if (!ele.children) {
        return arr.push(ele.id)
      }

      ele.children.forEach(item =>
        this.getDefaultKeys(item, arr)
      )
    },
    // 关闭分配对话框清空数组
    clearDefaultKeys () {
      this.defaultKeys = []
    },
    // 提交角色分配权限
    async assignmentCommit () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const keyStr = keys.join(',')
      const { data: result } = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids: keyStr
      })
      if (result.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success(result.meta.msg)
      this.getRoleList()
      this.assignmentShow = !this.assignmentShow
    }
  },
  created () {
    this.getRoleList()
  }
}
</script>
<style lang="less" scoped>
  .el-tag {
    margin: 10px;
  }
  .bortop {
    border-top: 1px solid #ccc;
  }
  .borbot {
    border-bottom: 1px solid #ccc;
  }
  .vercenter {
    display: flex;
    align-items: center;
  }
</style>
