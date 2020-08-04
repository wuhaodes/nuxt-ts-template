<template>
<div v-if="form">
  <el-form :model="form" :rules="rules" class="adminForm" label-width="120px" ref="form">
    <el-form-item label="密码：" prop="password">
      <el-input maxlength="16" placeholder="请输入密码" type="password" v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item label="确认密码：" prop="password2">
      <el-input maxlength="16" placeholder="请确认密码" type="password" v-model="form.password2"></el-input>
    </el-form-item>
    <slot name="button"></slot>
  </el-form>
</div>
</template>

<script lang="ts">

import Vue from 'vue'
import uPassport from '~/app/@biz/uPassport'

export default Vue.extend({
  props: {
    form: Object
  },

  data () {
    return {
      //商店id
      options: [],
      //是否显示商户ID
      rules: {
        name: [
          { required: true, message: '请填写用户名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请填写手机号', trigger: 'blur' },
          { pattern: /^1[0-9]{10}$/, message: '手机号格式错误', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度为 6 到 16 个字符', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度为 6 到 16 个字符', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择身份', trigger: 'change' }
        ]
      },
    }
  },
})
</script>

<style lang="scss">


</style>
