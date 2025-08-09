/**
 * @description 数据相关 API 接口
 */
import request from './request'

/**
 * @description 获取数据列表
 * @param {Object} params - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @returns {Promise} 返回数据列表的 Promise
 */
export function getDataList(params) {
  return request({
    url: '/data/list',
    method: 'get',
    params
  })
}

/**
 * @description 获取数据详情
 * @param {number|string} id - 数据ID
 * @returns {Promise} 返回数据详情的 Promise
 */
export function getDataDetail(id) {
  return request({
    url: '/data/detail',
    method: 'get',
    params: { id }
  })
}

/**
 * @description 获取折线图数据
 * @returns {Promise} 返回折线图数据的 Promise
 */
export function getLineChartData() {
  return request({
    url: '/chart/line',
    method: 'get'
  })
}

/**
 * @description 获取饼图数据
 * @returns {Promise} 返回饼图数据的 Promise
 */
export function getPieChartData() {
  return request({
    url: '/chart/pie',
    method: 'get'
  })
}