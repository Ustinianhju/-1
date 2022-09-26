import request from '@/utils/request'

/**
 *提交登录
 * @param {Object} data
 * @returns
 */
export const login = (data) => {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}
