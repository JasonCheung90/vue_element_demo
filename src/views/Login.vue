<template>
  <div class="container">
    <div class="login_content">
      <!-- logo开始 -->
      <div class="logo">
        <img src="../assets/logo.png" alt="logo" />
      </div>
      <!-- logo结束 -->
      <!-- login表单开始 -->
      <el-form
        ref="loginFormRef"
        class="login_form"
        :model="loginForm"
        :rules="loginRules"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="posBtn">
          <el-button type="primary" @click="loginCommit">Login</el-button>
          <el-button type="info" @click="resetForm">Reset</el-button>
        </el-form-item>
      </el-form>
      <!-- login表单结束 -->
    </div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
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
        ]
      }
    }
  },
  methods: {
    // 重置登录表单
    resetForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录提交
    loginCommit () {
      this.$refs.loginFormRef.validate(async check => {
        if (!check) return false
        const { data: loginResult } = await this.axios.post(
          'login',
          this.loginForm
        )
        if (loginResult.meta.status === 200) {
          // 把token存入sessionStorage
          sessionStorage.setItem('token', loginResult.data.token)
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          this.$router.push({ name: 'home' })
        } else {
          this.$message.error('账号或者密码不对')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  background-color: #583a73;
  height: 100%;
  .login_content {
    width: 500px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .logo {
      width: 100px;
      height: 100px;
      background-color: #fff;
      border: 1px solid #eee;
      border-radius: 50%;
      overflow: hidden;
      padding: 5px;
      margin: 0 auto;
      transform: translate(0, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 1px solid #eee;
        background-color: #ddd;
      }
    }
    .login_form {
      padding: 0 10px;
      .posBtn {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
