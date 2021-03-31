/** @format */

import http from './axios'
import {setItem} from '../lib/localStorage'
import {ACCOUNT_INFO, GITLAB_URL, CLIENT_ID, SECRET, REDIRECT_URL} from '../constant'

export const authGitlab = async (code: string) => {
  const tokenResponse = await http({
    method: 'post',
    url:
      'https://gitlab.com' +
      '/oauth/token?' +
      `client_id=${CLIENT_ID}&` +
      `client_secret=${SECRET}&` +
      `code=${code}&` +
      `grant_type=authorization_code&` +
      `redirect_uri=${REDIRECT_URL}`,
    headers: {
      accept: 'application/json',
    },
  })
  console.log(tokenResponse)
  return tokenResponse
}

export const getGitlabUserData = async (accessToken: string) => {
  const userData = await http.get(GITLAB_URL + '/user/', {
    params: {
      access_token: accessToken,
    },
  })
  setItem(ACCOUNT_INFO, {...userData, accessToken})
  return userData
}

// 登录
export const login = (body: {email: string; password: string}) => {
  body = {
    email: body.email,
    password: body.password,
  }
  return http.post('/admin/login', body)
}
export const logout = () => {
  return http.post('/admin/logout')
}
// 获取用户信息
export const auth = () => {
  return http.get('/admin/auth')
}
