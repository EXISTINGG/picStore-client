import {request} from '@/utils/request'

// 获取api列表
export const getApiList = () => request.get('admin/getinterface')
// 修改api权限
export const changeApi = (id,interfaceName,setPower) => {
  const data = {id,interfaceName,setPower}
  return request.post('admin/changeinterface',data)
}

// 获取user列表
export const getUserList = () => request.get('admin/getuser')
// 修改user权限
export const changeUser = (setPower,setUserName, setId) => {
  const data = {setPower,setUserName, setId}
  return request.post('admin/updatepower',data)
}

// 获取注销user列表
export const getsignOutUserList = () => request.get('admin/getsignoutuser')
// 删除注销用户
export const deletesignOutUser = () => request.get('admin/deletesignoutuser')
// 删除注销的某个用户
export const delUser = (delUserName, id) => {
  const data = {delUserName, id}
  return request.post('admin/deleteuser',data)
}
// 恢复注销的某个用户
export const restoreUser = (delUserName, id) => {
  const data = {delUserName, id}
  return request.post('admin/restoreuser',data)
}