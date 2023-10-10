import {request,requests} from '@/utils/request'

/**
 * 获取相册
 * @returns {Promise} 返回一个包含相册数据的Promise对象
 */
export const getAlbum = () => request.get('album/api/getalbum')

/**
 * 获取相册下的文件
 * @param {string} id - 相册ID
 * @param {string} name - 相册名称
 * @param {number} [offset] - 偏移量（可选）
 * @param {number} [batchSize] - 批量大小（可选）
 * @returns {Promise} 返回一个包含相册文件数据的Promise对象
 */
export const getAlbumFile = (id,name,offset,batchSize) => {
  const params = {
    id,name,offset,batchSize
  };
  return request.get(`image/api/getimg`,{ params })
}

/**
 * 新增相册
 * @param {string} albumName - 相册名称
 * @param {string} privacy - 相册隐私设置
 * @returns {Promise} 返回一个表示新增相册操作的Promise对象
 */
export const addAlbum = (albumName, privacy) => {
  const data = {albumName, privacy}
  console.log(data);
  return request.post('album/addalbum', data)
}

/**
 * 删除相册
 * @param {string} id - 相册ID
 * @param {string} albumName - 相册名称
 * @returns {Promise} 返回一个表示删除相册操作的Promise对象
 */
export const deleteAlbum = (id,albumName) => {
  const data = {id,albumName}
  return request.post('album/deletealbum', data)
}

/**
 * 更新相册信息
 * @param {string} id - 相册ID
 * @param {string} albumName - 相册名称
 * @param {string} [newAlbumName] - 新的相册名称（必须提供newAlbumName和newPrivacy中的一个）
 * @param {string} [newPrivacy] - 新的相册隐私设置（必须提供newAlbumName和newPrivacy中的一个）
 * @returns {Promise} 返回一个表示更新相册信息的Promise对象
 */
export const updateAlbum = (id,albumName,newAlbumName,newPrivacy) => {
  const data = {id,albumName,newAlbumName,newPrivacy}
  return request.post('album/updatealbum', data)
}
