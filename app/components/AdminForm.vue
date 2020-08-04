<template>
<div v-if="form">
  <el-form :model="form" :rules="rules" class="adminForm" label-width="120px" ref="form">
    <el-form-item label="用户名/昵称：" prop="name">
      <el-input maxlength="15" placeholder="请输入用户名/昵称" v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item abel-width="150px" label="身份：" prop="role">
      <el-select placeholder="请选择人员身份" v-model="form.role">
        <!--          //角色  system 管理员-->
        <!--          //  system.design 设计管理员  system.design.work 设计人员-->
        <!--          //  system.product 生产管理员  system.product.work  生产人员-->
        <el-option label="系统管理员" value="system"></el-option>
        <el-option label="设计管理员" value="system.design"></el-option>
        <el-option label="设计人员" value="system.design.work"></el-option>

        <el-option label="生产管理员" value="system.product"></el-option>
        <el-option label="生产人员" value="system.product.work"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="手机号：" prop="mobile">
      <el-input maxlength="11" placeholder="请输入手机号" v-model="form.mobile"></el-input>
    </el-form-item>
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
