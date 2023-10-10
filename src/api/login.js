import {request} from '@/utils/request'

// 获取验证码
export const getCode = (email) => {
  const data = {
    email
  }
  return request.post('/api/user/sendcode',data)
}

// 注册
export const registerAccount = (email,code,username,password) => {
  const data = {
    email,code,username,password
  }
  return request.post('/api/user/register',data)
}

// 用户名登录
export const loginByUserName = (username,password,isadmin) => {
  const data = {
    username,password,isadmin
  }
  return request.post('/api/user/login',data)
}

// 邮箱登录
export const loginByEmail = (email,password,isadmin) => {
  const data = {
    email,password,isadmin
  }
  return request.post('/api/user/login',data)
}

// 获取重置密码的验证码
export const getResetPwdCode = (email) => {
  const data = {
    email
  }
  return request.post('/api/user/resetpwdcode',data)
}

// 重置密码
export const resetPwd = (email,code,password) => {
  const data = {
    email,code,password
  }
  console.log(data);
  return request.post('/api/user/resetpwd',data)
}