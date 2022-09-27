import request from '@/utils/request'

export function login(data) {

}

export const getInfo = () => {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

export const getUserFateilById = (id) => {
  return request({
    url: `/sys/user/${id}`
  })
}
