<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片面板 -->
    <el-card>
      <!-- 用户列表 -->
      <el-table
        :data="rightList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
        >
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
        >
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级"
        >
          <template slot-scope="props">
            <el-tag v-if="props.row.level ==0">一级</el-tag>
            <el-tag type="success" v-else-if="props.row.level ==1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'rights',
  data () {
    return {
      // 权限列表
      rightList: [],
      // 请求参数
      type: 'list'
    }
  },
  methods: {
    // 请求权限列表数据
    async getRightList () {
      const { data: result } = await this.axios.get(`rights/${this.type}`)
      if (result.meta.status !== 200) return this.$message.error('获取用户权限列表失败')
      // console.log(result)
      this.rightList = result.data
    }
  },
  created () {
    this.getRightList()
  }
}
</script>
<style lang="less" scoped>
</style>
