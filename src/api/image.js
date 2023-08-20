import {request} from '@/utils/request'

// 随机获取图片
export const getRandomImg = () => request.get('file/api/randomimg')

// 删除图片
export const deleteImg = (folder,file) => {
  const data = {folder,file}
  return request.post('/file/deletefile',data)
}

// 重命名图片
export const renameImg = (folder,oldName,newName) => {
  const data = {folder,oldName,newName}
  return request.post('/file/renamefile',data)
}

