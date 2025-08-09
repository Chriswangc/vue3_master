/*
 * @Author: Chris-wang chriswang64@foxmail.com
 * @Date: 2024-01-27 14:27:33
 * @LastEditors: Chris-wang chriswang64@foxmail.com
 * @LastEditTime: 2025-05-24 01:25:55
 * @FilePath: \vue3-master\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @file 项目入口文件
 * @description 负责初始化Vue应用，配置全局插件和属性
 */

import { createApp } from 'vue'
// 引入element-plus UI框架
import ElementPlus from 'element-plus'
// 引入element-plus 样式
import 'element-plus/dist/index.css'
// 引入公共样式
import '@/assets/css/index.scss'
// 引入element-plus图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'

// 导入API接口
import api from './api'

/**
 * @description 在开发环境中加载Mock数据
 * @condition 仅在开发环境(DEV)下执行
 */
if (import.meta.env.DEV) {
  import('./mock')
  console.log('Mock 数据已加载')
}

// 创建Vue应用实例
const app = createApp(App)

/**
 * @description 注册全局API接口
 * @usage 在组件中可以通过 this.$api 访问API接口
 */
app.config.globalProperties.$api = api

/**
 * @description 全局注册Element Plus图标组件
 * @usage 可以在任何组件中直接使用图标组件，如 <el-icon><HomeFilled /></el-icon>
 */
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 使用Element Plus插件
app.use(ElementPlus)
// 使用路由插件
app.use(router)
// 挂载应用到DOM
app.mount('#app')

