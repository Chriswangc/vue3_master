<!--
 * @Author: Chris-wang chriswang64@foxmail.com
 * @Date: 2024-01-27 14:27:33
 * @LastEditors: Chris-wang chriswang64@foxmail.com
 * @LastEditTime: 2025-05-23 08:47:21
 * @FilePath: \vue3-master-houtaiguanliDemo\vue3-master\src\components\Login.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import { ref } from "vue";
import {useRouter} from 'vue-router'
import { ElMessage } from 'element-plus'
import registerDialog from "./dialog/registerDialog.vue";
import { login } from '../api/user';
const router =  useRouter()
// form表单引用
const ruleFormRef = ref()

// form 表单
let formData = ref({
  user: "",
  password: "",
});
// 校验规则
let rules = ref({
  user: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});
// 注册弹窗DOM
let register = ref();
// 注册弹窗是否显示
let visible = ref(false);
// 注册方法
function handleRegister() {
  visible.value = true;
}
/**
 * @description 处理用户登录的方法，包含表单验证和登录成功后的路由跳转
 * @returns {void}
 */
function handleLogin(){
  ruleFormRef.value.validate(valid => {
    if(valid){
      // 使用 API 接口进行登录
      login(formData.value).then(res => {
        if (res.code === 200) {
          // 保存 token 到本地存储
          localStorage.setItem('token', res.data.token)
          
          ElMessage({
            message: res.message || '登录成功!',
            type: 'success'
          })
          
          router.push({
            path:'/homeShow'
          })
        } else {
          ElMessage({
            message: res.message || '登录失败!',
            type: 'error'
          })
        }
      }).catch(error => {
        console.error('登录失败:', error)
        ElMessage({
          message: '登录请求失败，请检查网络或服务器状态',
          type: 'error'
        })
      })
    }
  })
}
</script>
<template>
  <!-- 登录容器 -->
  <div class="container">
    <!-- 封面-左 -->
    <img src="../assets/img/cover.png" alt="" class="cover_img" />
    <!-- 登录-右 -->
    <div class="login_div">
      <!-- 标题 -->
      <h1 class="title_h1">Welcome to Test System</h1>
      <!-- 登录表单 -->
      <el-form class="form"  ref="ruleFormRef" :model="formData" :rules="rules"  label-width="auto"  label-position="left">
        <el-form-item label="用户名" prop="user">
          <el-input v-model="formData.user"></el-input>
        </el-form-item>
        <el-form-item label="密码" class="password_item" prop="password">
          <el-input v-model="formData.password" show-password></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮组 -->
      <div>
        <el-button type="primary" @click="handleLogin">登录</el-button>
        <el-button type="warning" @click="handleRegister">注册</el-button>
      </div>
    </div>
  </div>
  <registerDialog
    ref="register"
    v-model="visible"
  ></registerDialog>
</template>
<style scoped lang="scss">
// 容器
.container {
  display: flex;
  height: 100%;
  // 封面
  .cover_img {
    flex: 1;
    height: 100%;
  }
  // 登录
  .login_div {
    display: flex;
    align-items: center;
    flex-direction: column;
    flex: 1;
    height: 100%;
    // 标题
    .title_h1 {
      font-size: 36px;
      margin: 100px 0px;
    }
    // 登录表单
    .form {
      margin: 100px 0px 0px;
    }
    :deep(.el-form) {
      .el-form-item {
        .el-form-item__label-wrap{
             label::before {
          content: "";
        }
        }
     
      }
      //   密码form-item
   .password_item {
        span {
          width: 22px;
        }
      
      } 
    }
  }
}
</style>