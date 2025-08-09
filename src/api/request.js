/*
 * @Author: Chris-wang chriswang64@foxmail.com
 * @Date: 2025-05-23 07:51:49
 * @LastEditors: Chris-wang chriswang64@foxmail.com
 * @LastEditTime: 2025-05-23 08:08:48
 * @FilePath: \vue3-master-houtaiguanliDemo\vue3-master\src\api\request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @file 请求工具封装
 * @description 基于Axios封装的HTTP请求工具，包含请求拦截器和响应拦截器
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'

/**
 * @description 创建axios实例
 * @property {string} baseURL - API请求的基础路径
 * @property {number} timeout - 请求超时时间（毫秒）
 * @property {Object} headers - 默认请求头
 */
const service = axios.create({
  baseURL: '/api', // API 请求的基础路径
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

/**
 * @description 请求拦截器
 * @function
 * @param {Object} config - 请求配置对象
 * @returns {Object} 处理后的请求配置
 * @throws {Error} 请求错误时抛出异常
 */
service.interceptors.request.use(
  config => {
    // 在请求发送前添加token到请求头
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    // 处理请求错误
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

/**
 * @description 响应拦截器
 * @function
 * @param {Object} response - 响应对象
 * @returns {Object} 处理后的响应数据
 * @throws {Error} 响应错误时抛出异常
 */
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 开发环境下直接返回Mock数据
    if (import.meta.env.DEV) {
      return res
    }
    
    // 处理业务状态码
    if (res.code !== 200) {
      // 显示错误消息
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 3000
      })
      
      // 处理未授权情况
      if (res.code === 401) {
        // 清除token
        localStorage.removeItem('token')
        // 跳转到登录页
        window.location.href = '/login'
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res
    }
  },
  error => {
    // 处理HTTP错误
    console.error('响应错误:', error)
    ElMessage({
      message: error.message || '请求失败',
      type: 'error',
      duration: 3000
    })
    return Promise.reject(error)
  }
)

export default service