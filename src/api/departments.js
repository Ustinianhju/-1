import request from '@/utils/request'

export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

export const addDepartments = (data) => {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

export const updateDepartments = (data) => {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}

export const delDepartments = (id) => {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
