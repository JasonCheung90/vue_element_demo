<template>
  <el-container class="home">
    <!-- 头部区域开始 -->
    <el-header>
      <div>
        <img src="../assets/cat.png">
        <span>后台管理系统</span>
        </div>
      <el-button type="warning" @click="signOut"> SignOut</el-button>
    </el-header>
    <!-- 头部区域结束 -->
    <!-- 内容区域开始 -->
    <el-container>
      <el-aside :width=" isCollapse? '64px':'200px'">
        <div class="toggle-button" @click="collapseMenu">>>></div>
        <el-menu
        background-color ="#583a73"
        text-color = "#fff"
        active-text-color="#e6a23c"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition= "false"
        router
        :default-active="activePath"
        >
          <el-submenu :index="item.id + ''" v-for ="item of menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span slot="title">{{item.authName}}</span>
            </template>
             <el-menu-item
              :index="'/'+val.path"
              v-for ="val of item.children"
              :key="val.id"
              @click="saveMenuState('/'+val.path)"
              >
              <template slot="title">
                <i class="el-icon-s-operation"></i>
                <span>{{val.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <!-- 内容区域结束 -->
  </el-container>
</template>
<script>
export default {
  name: 'home',
  data () {
    return {
      menuList: [],
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    // 退出
    signOut () {
      sessionStorage.clear()
      this.$router.push({ name: 'login' })
    },
    // 请求menu数据
    async getMenuList () {
      const { data: result } = await this.axios.get('menus')
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.menuList = result.data
      // console.log(result)
    },
    // 折叠菜单栏
    collapseMenu () {
      this.isCollapse = !this.isCollapse
    },
    // 保存激活状态的地址
    saveMenuState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
}
.el-header {
  background: #583a73;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  color: #eee;
  div {
    display: flex;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
    }
  }
}
.el-aside {
  background: #583a73;
  .el-menu {
    border-right: none;
  }
}
.toggle-button{
    font-size: 10px;
    background: #836e96;
    line-height: 24px;
    text-align: center;
    color: cornsilk;
    letter-spacing: 0.3em;
    cursor: pointer;
  }
.el-main {
  background: cornsilk;
}
.iconfont {
  color:cornsilk;
  margin-right: 10px;
}
.el-icon-s-operation {
 color:cornsilk;
}
</style>
