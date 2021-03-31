/** @format */

import http from './axios'
import {SERVER_URL} from '../constant'

export const createProject = async (body: any) => {
  return await http.post('/api/v1/project', body)
}

export const getProjects = async (params: any) => {
  return await http.get('/api/v1/project', {params})
}

export const depolyProject = async (body: any) => {
  return await http.post('/api/v1/project/deploy', body)
}

export const updateProject = async (id: string, body: any) => {
  return await http.put(`/api/v1/project/${id}`, body)
}

export const getPackages = async (params: any) => {
  return await http.get('/api/v1/project/files', {params})
}

export const downloadPackage = (id: number) => {
  window.location.href = SERVER_URL + `/api/v1/project/files/${id}`
}

export const getLogs = async (params: any) => {
  return await http.get('/api/v1/project/logs', {params})
}

export const getLogView = async (id: number) => {
  return await http.get(`/api/v1/project/logs/${id}`)
}
