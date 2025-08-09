/**
 * @description API 接口统一出口
 */
import * as userApi from './user'
import * as dataApi from './data'
import * as deepseekApi from './deepseek'

export default {
  user: userApi,
  data: dataApi,
  deepseek: deepseekApi
}