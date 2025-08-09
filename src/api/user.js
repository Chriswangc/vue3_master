/**
 * @description 用户相关 API 接口
 */
import request from './request'

/**
 * @description 用户登录
 * @param {Object} data - 登录参数
 * @param {string} data.user - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise} 返回包含用户信息和 token 的 Promise
 */
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

/**
 * @description 用户注册
 * @param {Object} data - 注册参数
 * @param {string} data.user - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise} 返回注册结果的 Promise
 */
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

/**
 * @description 获取用户信息
 * @returns {Promise} 返回用户信息的 Promise
 */
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

/**
 * @description 用户退出登录
 * @returns {Promise} 返回退出结果的 Promise
 */
export function logout() {
  // 实际项目中可能需要调用后端接口
  return new Promise((resolve) => {
    // 清除本地存储的 token
    localStorage.removeItem('token')
    resolve({
      code: 200,
      message: '退出成功'
    })
  })
}