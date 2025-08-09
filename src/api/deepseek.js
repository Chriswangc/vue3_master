/*
 * @Author: Chris-wang chriswang64@foxmail.com
 * @Date: 2025-08-09 08:31:35
 * @LastEditors: Chris-wang chriswang64@foxmail.com
 * @LastEditTime: 2025-08-09 08:33:16
 * @FilePath: \vue3-master-houtaiguanliDemo\vue3-master\src\api\deepseek.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @description DeepSeek AI API 接口
 */
import request from './request'

/**
 * @description 发送消息到DeepSeek AI
 * @param {Object} data - 请求参数
 * @param {string} data.message - 用户消息
 * @param {string} data.apiKey - DeepSeek API密钥
 * @returns {Promise} 返回AI响应的Promise
 */
export function sendMessage(data) {
  // 这里使用本地代理，实际项目中可能需要直接调用DeepSeek API
  return request({
    url: '/deepseek/chat',
    method: 'post',
    data
  })
}

/**
 * @description 验证API密钥是否有效
 * @param {string} apiKey - DeepSeek API密钥
 * @returns {Promise} 返回验证结果的Promise
 */
export function validateApiKey(apiKey) {
  return request({
    url: '/deepseek/validate',
    method: 'post',
    data: { apiKey }
  })
}