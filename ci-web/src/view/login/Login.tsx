/** @format */

import React, {FC, useContext, useEffect} from 'react'
import {Row, Col, Form, Input, Button, Checkbox} from 'antd'
import {UserOutlined, LockOutlined} from '@ant-design/icons'
import project from '../../../package.json'
import style from './style.m.less'
import LoginImg from '../../assets/images/login/login.png'
import Icon from '../../commpent/icon/Icon'
import {getItem, removeItem, setItem} from '../../lib/localStorage'
import {ACCOUNT_INFO} from '../../constant'
import {getFirstRoute} from '../../lib/until'
import history, {getQuery} from '../../route/history'
import routeItems from '../../route/routeItems'
import userContext from '../../context/userContext'
import IconSelect from '../../commpent/IconSelect/IconSelect'
import {authGitlab, getGitlabUserData} from '../../api/login'

const layout = {
  // labelCol: { span: 6 },
  wrapperCol: {span: 24},
}

interface LoginProps {}

const Login: FC<LoginProps> = (props: {}) => {
  const context = useContext(userContext)
  useEffect(() => {
    // LoginGitlab()
  }, [])

  const handleChange = (event: MouseEvent) => {
    console.log(event)
  }
  const onFinish = async (values: any) => {
    const userData = await getGitlabUserData(values.accessToken)
    context?.setUserData({...userData, accessToken: values.accessToken})
    const homePath = getFirstRoute(routeItems).path
    history.push(homePath)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  const {SERVER_URL, CLIENT_ID, SECRET, REDIRECT_URL} = process.env.APP_CONFIG as any
  console.log(SERVER_URL)
  console.log(123)
  // const gitLabAuthPath = `${AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code&scope=api`
  const {username, password} = getItem(ACCOUNT_INFO)
  return (
    <div className={style.login}>
      <div className={style['login-wrapper']}>
        <div className={style['login-wrapper-img']}>
          <img src={LoginImg} />
        </div>
        <div className={style['login-wrapper-form']}>
          <p className={style['login-wrapper-form-title']}>
            {project.name}
            <Icon type="iconweixiao" className={style['login-wrapper-form-title-icon']} />
          </p>
          <p className={style['login-wrapper-form-description']}>欢迎使用～</p>
          <Form
            {...layout}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}>

            <Form.Item
              label="授权令牌"
              name="accessToken"
              initialValue={password}
              rules={[{required: true, message: 'Please input your accessToken!'}]}>
              <Input.Password
                size="large"
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="请输入accessToken"
              />
            </Form.Item>
            <Form.Item wrapperCol={{span: 24}}>
              <Button size="large" block type="primary" htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Login
