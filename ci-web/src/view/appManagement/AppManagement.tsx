/** @format */

import React, { useRef, useEffect, useState } from 'react'
import { Card, Form, Input, notification, Button, Table, message } from 'antd'
import AppModal from './AppModal'
import { getGroups, createApp, projectProps } from '../../api/gitlab'
import { createProject, getProjects, depolyProject, updateProject } from '../../api/project'
import IconFont from '../../commpent/icon/Icon'
import { WS_SERVER_URL } from '../../constant'
import PackageDownloadModal from './PackageDownloadModal'
import DeployPopconfirm from './DeployPopconfirm'
import history from '../../route/history'
import { PortProps } from './PortInputs'

export const getPorts = (ports: Array<PortProps>) => {
  return ports.map(item => {
    const newItem = {...item}
    if (newItem.id.includes && newItem.id.includes('uuid')) delete newItem.id
    return newItem
  })
}

interface ProjectManagementProps { }

const AppManagement: React.FC<ProjectManagementProps> = () => {
  const queryRef = useRef<{ [key: string]: any }>({})

  const wsRef = useRef()

  const [dataSource, setDataSource] = useState<Array<any>>([])

  const [groupLoading, setGroupLoading] = useState(false)

  const [loading, setLoading] = useState(false)

  const [groups, setGroups] = useState<Array<any>>([])

  const [form] = Form.useForm()

  const columns = [
    {
      title: '应用名称',
      width: 200,
      fixed: 'left',
      dataIndex: 'name',
    },
    {
      title: '项目描述',
      width: 200,
      dataIndex: 'description',
    },
    {
      title: '项目权限',
      dataIndex: 'visibility',
    },
    {
      title: '项目web地址',
      dataIndex: 'httpUrl',
      width: 200,
      render: (href: string) => (
        <a href={href} target="view_window" className="link-text">
          {href}
        </a>
      ),
    },
    {
      title: '开发环境地址',
      dataIndex: 'dev_deploy_url',
      width: 200,
      render: (href: string) => (
        <a href={href} target="view_window" className="link-text">
          {href}
        </a>
      ),
    },
    {
      title: '测试环境地址',
      dataIndex: 'test_deploy_url',
      width: 200,
      render: (href: string) => (
        <a href={href} target="view_window" className="link-text">
          {href}
        </a>
      ),
    },
    {
      title: '生产环境地址',
      dataIndex: 'prod_deploy_url',
      width: 200,
      render: (href: string) => (
        <a href={href} target="view_window" className="link-text">
          {href}
        </a>
      ),
    },
    {
      title: '操作',
      dataIndex: 'op',
      fixed: 'right',
      align: 'center',
      width: 150,
      render: (v: any, record: any) => (
        <div className="flex-center-vh">
          <DeployPopconfirm onOk={handleClickDeploy(record)}>
            <IconFont
              title={'部署'}
              type="iconziyuan3"
              className={record.status === 1 ? 'disabled-text' : 'link-text'}
              style={{ marginRight: 16 }}
            />
          </DeployPopconfirm>
          <AppModal
            title='编辑'
            onOk={handleClickEditApp(record)}
            isEdit
            record={record}
          >
            <IconFont
              title='编辑'
              type='iconbianji'
              className='link-text'
              style={{ marginRight: 16 }}
            />
          </AppModal>
          <PackageDownloadModal projectId={record.id}>
            <IconFont
              title="下载包"
              type="iconxiazai"
              className="link-text"
              style={{ marginRight: 16 }}
            />
          </PackageDownloadModal>
          <IconFont
            onClick={hanldeClickLog(record.id)}
            className='link-text'
            type='iconrizhi1'
            title='部署日志'
          />
        </div>
      ),
    },
  ]

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    setLoading(true)
    const fieldsValue = form.getFieldsValue()
    const projects = (await getProjects(fieldsValue)).data || []
    setDeployUrls(projects)
    setLoading(false)
    setDataSource(projects as any)
  }

  const setDeployUrls = (list: Array<any>) => {
    list.forEach(item => {
      if (item.ports && item.ports.length) {
        ; (item.ports as Array<any>).forEach(port => {
          item[`${port.env}_deploy_url`] = 'http://' + item.deploy_host + ':' + port.port
        })
      }
    })
  }

  const handleClickEditApp = (record: any) => (values: any, cb: Function) => {
    values.ports = getPorts(values.ports)
    updateProject(record.id, values).then((res: any) => {
      if (res.errorCode === 0) {
        message.success('编辑成功')
        getList()
      }
    }).finally(() => {
      cb()
    })
  }

  const handleClickAddApp = (values: any, cb: Function) => {
    values.ports = getPorts(values.ports)
    createApp(values).then((res: any) => {
      if (res.message) {
        message.error('新增失败')
        return
      }
      const { name, id, description, ssh_url_to_repo, web_url, visibility } = res as any
      createProject({
        name: name as string,
        id,
        description: description as string,
        ports: values.ports,
        sshUrl: ssh_url_to_repo,
        httpUrl: web_url,
        visibility: visibility as string,
      }).then(res => {
        getList()
        message.success('项目新增成功')
      })
      cb()
    })
  }

  const hanldeClickLog = (id: number) => () => {
    history.push({ pathname: '/log_management', search: `?id=${id}` })
  }

  console.log('123')

  const handleClickDeploy = (record: any) => (env: string, cb: Function) => {
    depolyProject({
      env,
      id: record.id,
      sshUrl: record.sshUrl,
    })
      .then((res: any) => {
        if (res.errorCode === 0) {
          const ws: WebSocket = new window.WebSocket(WS_SERVER_URL)
          ws.onopen = () => {
            console.log(123)
            notification.info({
              message: `开始部署${record.name},环境:${env}`,
            })
            getList()
          }
          ws.onmessage = event => {
            const data = JSON.parse(event.data)
            if (data.code !== 1) {
              if (data.code === 0) {
                notification.error({
                  message: '部署失败',
                })
              } else {
                notification.success({
                  message: '部署成功',
                })
              }
              ws.close()
              getList()
            }
          }
        }
      })
      .finally(() => {
        cb()
      })
  }

  const handleDropdownVisibleChange = (open: boolean) => {
    if (open && !groups.length) {
      getAppGroups()
    }
  }

  const getAppGroups = () => {
    setGroupLoading(true)
    getGroups()
      .then(res => {
        setGroups(res as any)
      })
      .finally(() => {
        setGroupLoading(false)
      })
  }

  return (
    <React.Fragment>
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} onFinish={getList} layout="inline">
          <Form.Item name="name">
            <Input style={{ width: 200, marginRight: 16 }} placeholder="项目名称" allowClear />
          </Form.Item>
          <Form.Item>
            <AppModal
              title={'新增应用'}
              onOk={handleClickAddApp}
              groups={groups}
              groupLoading={groupLoading}
              onGroupDropdownVisibleChange={handleDropdownVisibleChange}>
              <Button type="primary" style={{ marginRight: 16 }}>
                新增项目
              </Button>
            </AppModal>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={getList}>
              查询
            </Button>
          </Form.Item>
          {/* <Form.Item>
            <ImportAppModal
              onOk={() => {}}
            >
              <Button type='primary'>导入</Button>
            </ImportAppModal>
          </Form.Item> */}
        </Form>
        {/* <Select
          loading={groupLoading}
          style={{width: 200, marginRight: 16}}
          placeholder="分组"
          allowClear
          onDropdownVisibleChange={handleDropdownVisibleChange}
          onChange={handleChangeQuery('appName')}>
          {groups.map(item => (
            <Option key={item.full_name} value={item.full_name}>
              {item.full_name}
            </Option>
          ))}
        </Select> */}
      </Card>
      <Card>
        <Table
          rowKey={'id'}
          loading={loading}
          columns={columns}
          scroll={{ x: 1500 }}
          dataSource={dataSource}
          pagination={false}
        />
      </Card>
    </React.Fragment>
  )
}

export default AppManagement
