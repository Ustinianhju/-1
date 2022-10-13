import request from '@/utils/request'

export function getEmployeeSimple() {
  return request({
    url: 'sys/user/simple'
  })
}

export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}

export function addEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

export const getEmployeesInfo = (id) => {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

export const saveEmployeesInfo = (data) => {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'PUT',
    data
  })
}

export const getEmployeesJobInfo = (id) => {
  return request({
    url: `/employees/${id}/jobs`
  })
}

export const saveEmployeesJobsInfo = (data) => {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'PUT',
    data
  })
}
