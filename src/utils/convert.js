/**
 * 将文件大小转换为较大的单位。
 * @param {number} fileSize - 文件大小，单位为字节。
 * @returns {string} - 转换后的文件大小，保留两位小数，带有单位。
 *
 * @example
 * const size = 1536; // 文件大小为1536字节
 * const convertedSize = convertFileSize(size);
 * console.log(convertedSize); // 输出：1.54 KB
 */
export function convertFileSize(size) {
  let fileSize = Number(size);
  if(!fileSize) return '0B';

  if (isNaN(fileSize) || fileSize < 0) {
    fileSize = fileSize - 0
  }
  // 定义单位数组
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  // 定义单位索引
  let unitIndex = 0

  // 当文件大小大于1000，且单位索引小于单位数组的长度减1时，循环执行以下操作,找到合适的单位
  while (fileSize >= 1000 && unitIndex < units.length - 1) {
    // 将文件大小转换为较大的单位
    fileSize /= 1000
    // 将单位索引加1,转换为较大的单位
    unitIndex++
  }

  // 返回转换后的文件大小，保留两位小数，单位为传入的单位
  return `${fileSize.toFixed(2)} ${units[unitIndex]}`
}