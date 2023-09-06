import {request,requests} from '@/utils/request'

// 获取目录
export const getFolder = () => request.get('folder/api/getfolder')
// 获取目录下的文件
export const getFolderFile = (folder,size,refresh) => {
  const params = {
    folder,
    size,
    refresh
  };
  return request.get(`folder/api/getfolderfile`,{ params })
}
// 新增目录
export const addFolder = (folder) => {
  const data = {folder}
  return request.post('folder/addfolder', data)
}
// 删除目录
export const deleteFolder = (folder) => {
  const data = {folder}
  return request.post('folder/deletefolder', data)
}
// 重命名目录
export const renameFolder = (oldName,newName) => {
  const data = {oldName,newName}
  return request.post('folder/renamefolder', data)
}
