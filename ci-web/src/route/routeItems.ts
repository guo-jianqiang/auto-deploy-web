/** @format */

import React from 'react'
import AppManagement from '../view/appManagement'
import GitlabProjectManagement from '../view/gitlabProjectManagement'
import LogManagement from '../view/LogManagement'

type ComponentType = React.ComponentType<any> & {name: string}
export interface RouteItem {
  path: string
  exact: boolean
  meta: {
    tabFixed?: boolean
    isCache?: boolean
    isChild?: boolean
    hidden?: boolean
    name: string
    icon: Function | string
  }
  component: ComponentType
  hiddenTab?: boolean;
  routes?: Array<RouteItem>
}

const routeItems: Array<RouteItem> = [
  {
    path: '/app_management',
    exact: true,
    meta: {
      icon: 'iconxiangmu',
      isCache: true,
      isChild: true,
      name: '项目管理',
    },
    component: AppManagement,
  },
  {
    path: '/git_management',
    exact: true,
    meta: {
      icon: 'icongitlab2',
      isCache: true,
      isChild: true,
      name: 'gitlab项目',
    },
    component: GitlabProjectManagement,
  },
  {
    path: '/log_management',
    exact: true,
    hiddenTab: true,
    meta: {
      icon: '',
      // isCache: true,
      isChild: true,
      hidden: true,
      name: '日志查看',
    },
    component: LogManagement
  },
]

export default routeItems
