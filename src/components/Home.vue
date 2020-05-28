<template>
  <div class="home">
    <el-button type="info" @click="signOut">SignOut</el-button>
  </div>
</template>
<script>
export default {
  name: 'home',
  data() {
    return {
      age: 18
    }
  },
  methods: {
    signOut() {
      sessionStorage.clear()
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  color: #000;
}
</style>
