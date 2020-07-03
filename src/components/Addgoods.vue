<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 商品信息面板 -->
    <el-card>
      <el-alert
      title="添加商品信息"
      type="info"
      show-icon
      :closable="false">
      </el-alert>
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息" name="0"></el-step>
        <el-step title="商品参数" name="1"></el-step>
        <el-step title="商品属性" name="2"></el-step>
        <el-step title="商品图片" name="3"></el-step>
        <el-step title="商品内容" name="4"></el-step>
        <el-step title="完成" name="5"></el-step>
      </el-steps>
      <el-form :model="addGoodForm" :rules="goodRules" ref="addGoodFormRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left" v-model="activeIndex" @tab-click="handleTab" :before-leave="beforeTabLeave">
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
              v-model="addGoodForm.goods_cat"
              :options="cateList"
              :props="cascaderProps"
              clearable
              @change="CateChanged"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <el-form-item :label="item.attr_name" v-for="item of manyData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for=" (item2, index2) of item.attr_vals" :key="index2" :label="item2" border>
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
              <el-form-item :label="item.attr_name" v-for="item of onlyData" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              :headers="headers"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <quill-editor v-model="addGoodForm.goods_introduce"
                ref="myQuillEditor">
            </quill-editor>
            <el-button type="primary" @click="addGoodCommit">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="preViewDialog"
      width="50%"
     >
      <img :src="preViewPath" class="preViewImg">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'addgoods',
  data () {
    return {
      activeIndex: '0',
      // 商品表单
      addGoodForm: {
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
        ],
        goods_cat: [
          { required: true, message: '选择分类', trigger: 'blur' }
        ]
      },
      // 分类列表
      cateList: [],
      // 层级表单的配置数据
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 动态参数列表数据
      manyData: [],
      // 静态属性列表
      onlyData: [],
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      preViewPath: '',
      preViewDialog: false
    }
  },
  methods: {
    // 请求分类数据
    async getCateList () {
      const { data: result } = await this.axios.get('categories')
      if (result.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.cateList = result.data
    },
    CateChanged () {
      if (this.addGoodForm.goods_cat.length !== 3) {
        this.addGoodForm.goods_cat = []
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 切换面板获取参数列表
    async handleTab () {
      if (this.activeIndex === '1') {
        // 动态参数列表
        const { data: result } = await this.axios.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (result.meta.status !== 200) return this.$message.error('获取动态参数列表失败')
        result.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyData = result.data
      } else if (this.activeIndex === '2') {
        // 属性参数列表
        const { data: result } = await this.axios.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (result.meta.status !== 200) return this.$message.error('获取动态参数列表失败')
        this.onlyData = result.data
      }
    },
    // 图片上传事件
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const index = this.addGoodForm.pics.findIndex(item => item.pic === filePath)
      this.addGoodForm.pics.splice(index, 1)
    },
    handlePreview (file) {
      this.preViewPath = file.response.data.url
      this.preViewDialog = true
    },
    handleSuccess (response) {
      const { data } = response
      const picObj = {
        pic: data.tmp_path
      }
      this.addGoodForm.pics.push(picObj)
    },
    // 商品添加提交
    addGoodCommit () {
      this.$refs.addGoodFormRef.validate(async check => {
        if (!check) return this.$message.error('请输入商品的必要信息')
        // 对象深拷贝
        const _ = await import('lodash')
        const form = _.cloneDeep(this.addGoodForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyData.forEach(item => {
          const info = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addGoodForm.attrs.push(info)
        })
        this.onlyData.forEach(item => {
          const info = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addGoodForm.attrs.push(info)
        })
        form.attrs = this.addGoodForm.attrs

        const { data: result } = await this.axios.post('goods', form)
        if (result.meta.status !== 201) {
          return this.$message.error('创建商品失败')
        }
        this.$message.success(result.meta.msg)
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 获取动态的第三级参数Id
    cateId () {
      if (this.addGoodForm.goods_cat.length === 3) {
        return this.addGoodForm.goods_cat[2]
      } else {
        return null
      }
    }
  },
  created () {
    this.getCateList()
  }
}
</script>
<style lang="less" scoped>
.el-alert {
  justify-content: center;
}
.el-steps, .el-tabs {
  margin-top: 20px;
}
.el-checkbox {
  margin: 5px 5px 0 0  !important;
}
.preViewImg {
  width: 100%;
}
.el-button {
  margin-top: 15px;
}
</style>
