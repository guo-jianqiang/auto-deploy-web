/** @format */

import React, { useState, useRef, useEffect } from 'react'
import { Modal, Table, PaginationProps, Card, Tag, Input, Spin } from 'antd'
import moment from 'moment'
import { useLocation } from "react-router-dom";
import { paginationConfig, DATE_FORMAT } from '../../constant'
import { getLogs, getLogView } from '../../api/project'
import IconFont from '../../commpent/icon/Icon'
import { getQuery } from '../../route/history';

export interface LogManagementProps { }

const LogManagement: React.FC<LogManagementProps> = () => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [logLoading, setLogLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [logText, setLogText] = useState<string>()

  const paginationRef = useRef<{ limit: number; current: number }>({ limit: paginationConfig.pageSize, current: 1 })

  const totalRef = useRef(0)

  const { id: projectId } = getQuery()
  console.log(projectId)

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    setLoading(true)
    getLogs({ ...paginationRef.current, projectId })
      .then((res: any) => {
        if (res.errorCode === 0) {
          totalRef.current = res.data.total
          setDataSource(res.data.list as any)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const columns = [
    {
      title: '日志文件名',
      width: 200,
      dataIndex: 'logFileName',
    },
    {
      title: '环境',
      dataIndex: 'env',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: number, record: any) => <Tag color={status === 1 ? 'blue' : 'green'}>{record.statusText}</Tag>
    },
    {
      title: '部署时间',
      width: 200,
      dataIndex: 'createdTime',
      render: (timestamp: string) => moment(timestamp).format(DATE_FORMAT.YYYYMMDDHHMMSS),
    },
    {
      title: '操作',
      width: 60,
      dataIndex: 'op',
      render: (v: any, record: any) => <IconFont className={record.status === 1 ? 'disabled-text' : ''} title="查看" onClick={handleClickLogView(record.id)} type="iconchakan" />,
    },
  ]

  const handleClickLogView = (id: number) => () => {
    setVisible(true)
    setLogLoading(true)
    getLogView(id).then((res: any) => {
      if (res.errorCode === 0) {
        setLogText(res.data)
      }
    }).catch(() => {
      setLogText('')
    }).finally(() => {
      setLogLoading(false)
    })
  }

  const handleClickCancel = () => setVisible(false)

  const handleTableChange = (pagination: PaginationProps) => {
    const { pageSize: limit, current: current } = pagination
    if (paginationRef.current && limit && current) {
      paginationRef.current = { limit, current }
      getData()
    }
  }
  return (
    <Card>
      <Modal
        title='日志查看'
        visible={visible}
        onCancel={handleClickCancel}
        width={800}
        footer={null}
      >
        <Spin spinning={logLoading}>
          <Input.TextArea value={logText} rows={20} />
        </Spin>
      </Modal>
      <Table
        rowKey='id'
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        onChange={handleTableChange}
        pagination={{
          pageSize: paginationConfig.pageSize,
          total: totalRef.current,
          showTotal: total => `总共${total}条数据`,
        }}
      />
    </Card>
  )
}

export default LogManagement
