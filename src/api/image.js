import {request} from '@/utils/request'

// 随机获取图片
export const getRandomImg = () => request.get('image/api/randomimg')

// 删除图片
export const deleteImg = (id, name) => {
  const data = {id,name};
  return request.post('image/deleteimg',data);
}

/**
 * 重命名图片（废弃接口，不再支持）
 * @deprecated 该接口已被废弃，不再支持使用
 * @param {string} album - 相册名称
 * @param {string} oldName - 原始图片名称
 * @param {string} newName - 新的图片名称
 * @returns {Promise} 返回一个表示重命名图片操作的 Promise 对象
 */
// export const renameImg = (album,oldName,newName) => {
//   const data = {album,oldName,newName}
//   return request.post('image/renamefile',data)
// }

