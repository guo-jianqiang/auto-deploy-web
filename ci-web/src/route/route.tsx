/** @format */

import React, {useEffect, useState} from 'react'
import {Router, Redirect, Route} from 'react-router-dom'
import CacheRoute, {
  CacheSwitch,
  dropByCacheKey,
  clearCache,
  refreshByCacheKey,
  getCachingKeys,
} from 'react-router-cache-route'
import {ACCOUNT_INFO, LOGIN_PATH} from '../constant'
import history from './history'
import Login from '../view/login'
import routeItems, {RouteItem} from './routeItems'
// import Layout from '../layout/Layout'
import pkg from '../../package.json'
import {Layout} from 'little-deer-ui'
import {removeUserData, UserInterface} from '../lib/userData'
import userContext from '../context/userContext'
import {getFirstRoute, isEmpty} from '../lib/until'
import {getItem} from '../lib/localStorage'
import {getGitlabUserData} from '../api/login'

const {Tabs} = Layout

const aliveControl = {
  dropByCacheKey,
  clearCache,
  refreshByCacheKey,
  getCachingKeys,
}

const Routes = () => {
  const [userData, setUserData] = useState<UserInterface | null>(null)
  const userInfo = getItem(ACCOUNT_INFO)
  useEffect(() => {
    if (history.location.pathname !== LOGIN_PATH) {
      // console.log(userInfo)
      if (isEmpty(userInfo)) {
        history.push(LOGIN_PATH)
        return
      }
    }
  }, [])
  const handleClickDrop = () => {
    Tabs.clearTabsCache()
    removeUserData()
  }
  const renderRoutes = () => {
    const routes: Array<React.ReactNode> = []
    const routeMap = (arr: Array<RouteItem>) => {
      arr.forEach(route => {
        if (route.meta.isChild) {
          routes.push(
            <CacheRoute
              when={() => !!route.meta.isCache}
              cacheKey={route.path}
              key={route.path}
              exact={route.exact}
              path={route.path}
              component={route.component}
            />,
          )
        }
        if (route.routes && route.routes.length) routeMap(route.routes)
      })
    }
    routeMap(routeItems)
    return routes
  }
  const homePath = getFirstRoute(routeItems).path
  return (
    <userContext.Provider
      value={{
        userData,
        setUserData,
      }}>
      <Router history={history}>
        <CacheSwitch>
          <Route exact path="/">
            <Redirect to={isEmpty(getItem(ACCOUNT_INFO)) ? LOGIN_PATH : homePath} />
          </Route>
          <Route exact path={LOGIN_PATH} component={Login} />
          <Layout
            proName={pkg.projectName}
            avatar={<img src={userInfo?.avatar_url} />}
            logo={require('../assets/images/ci-logo.svg')}
            routeItems={routeItems}
            username={userInfo?.username || ''}
            history={history}
            aliveControl={aliveControl}
            onClickDrop={handleClickDrop}>
            {renderRoutes()}
          </Layout>
        </CacheSwitch>
      </Router>
    </userContext.Provider>
  )
}

export default Routes
