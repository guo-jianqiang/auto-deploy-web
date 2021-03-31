/** @format */

import http from './axios'
import {getItem} from '../lib/localStorage'
import {ACCOUNT_INFO, GITLAB_URL} from '../constant'
import { getUserData } from '../lib/userData'

export interface projectProps {
  name: string
  description?: string
  visibility?: string
  [key: string]: any
}

export const getGroups = async () => {
  return await http.get(GITLAB_URL + '/groups', {
    headers: {
      'private-token': getUserData().accessToken,
    },
  })
}

export const getApps = async (params: any) => {
  return await http.get(GITLAB_URL + '/projects', {
    params: {
      ...params,
      owned: true,
    },
    headers: {
      'private-token': getUserData().accessToken,
    },
  })
}

export const createApp = async (body: projectProps) => {
  return await http.post(GITLAB_URL + '/projects', body, {
    headers: {
      'private-token': getUserData().accessToken,
    },
  })
}
