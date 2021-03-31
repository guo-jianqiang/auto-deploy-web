/** @format */

export const LOGIN_PATH = '/login'

export const ACCOUNT_INFO = '__account_info__'

export const SYSTEM_CONFIG = '__system_config__'

export const SYSTEM_CONFIG_DRAWER_WIDTH = 256

export interface themeColorsInterface {
  id: number
  color: string
  name: string
}

export const themeColors: Array<themeColorsInterface> = [
  {
    id: 1,
    color: 'rgb(24, 144, 255)',
    name: '拂晓蓝(默认)',
  },
  {
    id: 2,
    color: 'rgb(245, 34, 45)',
    name: '薄暮',
  },
  {
    id: 3,
    color: 'rgb(250, 84, 28)',
    name: '火山',
  },
  {
    id: 4,
    color: 'rgb(19, 194, 194)',
    name: '明青',
  },
  {
    id: 5,
    color: 'rgb(82, 196, 26)',
    name: '激光绿',
  },
  {
    id: 6,
    color: 'rgb(114, 46, 209)',
    name: '酱紫',
  },
]

export const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
}

export const tailLayout = {
  wrapperCol: {offset: 8, span: 16},
}

// 日期格式
export const DATE_FORMAT = {
  YYYY: 'YYYY',
  YYYYMM: 'YYYY-MM',
  YYYYMMDD: 'YYYY-MM-DD',
  YYYYMMDD1: 'YYYY/MM/DD',
  YYYYMMDDHH: 'YYYY-MM-DD HH',
  YYYYMMDDHHMM: 'YYYY-MM-DD HH:mm',
  YYYYMMDDHHMMSS: 'YYYY-MM-DD HH:mm:ss',
}

export const envs = ['dev', 'test', 'prod']

export const deployStatus = [
  {
    code: 0,
    text: '部署失败',
  },
  {
    code: 1,
    text: '部署中',
  },
  {
    code: 2,
    text: '部署成功',
  },
]

export const paginationConfig = {
  pageSize: 20,
}

export const {WS_SERVER_URL, GITLAB_URL, AUTH_URL, CLIENT_ID, SECRET, REDIRECT_URL, SERVER_URL} = process
  .env.APP_CONFIG as any
