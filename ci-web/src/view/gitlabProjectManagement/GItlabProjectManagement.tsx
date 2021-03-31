/** @format */

import React, {useState, useEffect} from 'react'
import {Form, Button, Input, Table, Card, message} from 'antd'
import {getApps} from '../../api/gitlab'
import {createProject, getProjects} from '../../api/project'
import IconFont from '../../commpent/icon/Icon'
import AppModal from '../appManagement/AppModal'
import { getPorts } from '../appManagement/AppManagement'

export interface GitlabProjectManagementProps {}

const GitlabProjectManagement: React.FC<GitlabProjectManagementProps> = ({}) => {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])

  const [form] = Form.useForm()

  useEffect(() => {
    getData()
  }, [])

  const queryData = () => {
    getData()
  }

  const getData = () => {
    const search = form.getFieldValue('search')
    setLoading(true)
    getApps({search, per_page: 100}).then(res => {
      setDataSource(res as any)
      setLoading(false)
    })
  }

  const handleClickImport = (record: any) => (value: any, cb: Function) => {
    const {name, id, ssh_url_to_repo, web_url, visibility} = record
    createProject({
      name: name as string,
      id,
      description: value.description,
      ports: getPorts(value.ports),
      sshUrl: ssh_url_to_repo,
      httpUrl: web_url,
      visibility: visibility as string,
    })
      .then(() => {
        queryData()
        message.success('项目导入成功')
      })
      .finally(() => {
        cb()
      })
  }

  const columns = [
    {
      title: '项目名',
      width: 200,
      fixed: 'left',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: 'ssh地址',
      width: 300,
      dataIndex: 'ssh_url_to_repo',
    },
    {
      title: 'http地址',
      width: 300,
      dataIndex: 'http_url_to_repo',
    },
    {
      title: '项目地址',
      width: 300,
      dataIndex: 'web_url',
    },
    {
      title: '操作',
      width: 60,
      fixed: 'right',
      dataIndex: 'op',
      render: (v: any, record: any) => (
        <div className="flex-center-vh">
          <AppModal isEdit title="导入" onOk={handleClickImport(record)} record={record}>
            <IconFont title={'导入'} type="icondaoru" className="link-text" style={{fontSize: 24}} />
          </AppModal>
        </div>
      ),
    },
  ]

  return (
    <React.Fragment>
      <Card style={{marginBottom: 16}}>
        <Form form={form} onFinish={queryData} layout="inline">
          <Form.Item name="search">
            <Input style={{width: 200, marginRight: 16}} placeholder="搜索" allowClear />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <Table loading={loading} columns={columns} scroll={{x: 1300}} dataSource={dataSource} pagination={false} />
      </Card>
    </React.Fragment>
  )
}

export default GitlabProjectManagement
