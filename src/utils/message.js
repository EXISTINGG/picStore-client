import { ElMessage } from 'element-plus'

export const success = (msg) => {
  ElMessage({
    showClose: true,
    message: msg || 'Congrats, this is a success message.',
    type: 'success',
  })
}
export const warning = (msg) => {
  ElMessage({
    showClose: true,
    message: msg || 'Warning, this is a warning message.',
    type: 'warning',
  })
}
export const error = (msg) => {
  ElMessage({
    showClose: true,
    message: msg || 'Oops, this is a error message.',
    type: 'error',
  })
}