import {request} from '@/utils/request'

// 修改信息
export const updateInfo = (username) => {
  const data = {username}
  return request.post('/userinfo/updateinfo',data)
}
// 修改密码
export const updatepwd = (oldPwd,newPwd) => {
  const data = {oldPwd,newPwd}
  return request.post('/userinfo/updatepwd',data)
}
// 注销账号
export const deleteUser = () => request.post('/userinfo/markdeleteuser')

// 获取更换邮箱的验证码
export const getChangeEmailCode = (newEmail,password) => {
  const data = {
    newEmail,
    password
  }
  console.log(data);
  return request.post('/userinfo/updateemailcode',data)
}

// 更换邮箱
export const changeEmail = (email,code) => {
  const data = {
    email,
    code
  }
  return request.post('/userinfo/updateemail',data)
}

