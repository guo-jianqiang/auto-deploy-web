/** @format */

import {createBrowserHistory} from 'history'
import queryString from 'query-string'

const history = createBrowserHistory()

export const getQuery = () => {
  const searchString = history.location.search || ''
  return queryString.parse(searchString)
}

export default history
