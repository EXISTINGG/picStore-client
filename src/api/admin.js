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
  return request.post('admin/updatepermissions',data)
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
export const restoreUser = (restoreUser, id) => {
  const data = {restoreUser, id}
  return request.post('admin/restoreuser',data)
}

// 获取系统设置
export const getSystem = () => request.get('admin/getsystem')

// 更改系统设置(至少一项参数)
export const changeSystem = (storage_type, cloud_disk_capacity, local_disk_capacity) => {
  const data = {storage_type, cloud_disk_capacity, local_disk_capacity}
  return request.post('admin/changesystem',data)
}

// 获取所有相册
export const getAlbumList = () => request.get('admin/getallalbum')

// 获取所有图片
export const getAllImage = (offset,batchSize) => {
  const params = {
    offset,batchSize
  };
  return request.get('admin/getallimg',{params})
}