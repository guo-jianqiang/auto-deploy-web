/** @format */

import React, {useState, useRef} from 'react'
import {Modal, Table, PaginationProps} from 'antd'
import moment from 'moment'
import {paginationConfig, DATE_FORMAT} from '../../constant'
import {getPackages, downloadPackage} from '../../api/project'
import IconFont from '../../commpent/icon/Icon'
import {bytesToSize} from '../../lib/until'

export interface PackageDownloadModalProps {
  projectId: string
}

const PackageDownloadModal: React.FC<PackageDownloadModalProps> = ({projectId, children}) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])

  const paginationRef = useRef<{limit: number; current: number}>({limit: 20, current: 1})

  const totalRef = useRef(0)

  const handleClickBtn = () => {
    setVisible(true)
    getData()
    // getApps('23').then((res) => {
    //   setVisible(res as any)
    // })
  }

  const getData = () => {
    setLoading(true)
    getPackages({...paginationRef.current, projectId})
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
  const handleClickOk = () => {
    handleClickCancel()
  }
  const handleClickCancel = () => setVisible(false)

  const columns = [
    {
      title: '包名',
      width: 200,
      dataIndex: 'filename',
    },
    {
      title: '环境',
      dataIndex: 'env',
    },
    {
      title: '包大小',
      dataIndex: 'size',
      render: (size: number) => bytesToSize(size),
    },
    {
      title: '创建时间',
      width: 200,
      dataIndex: 'createdTime',
      render: (timestamp: string) => moment(timestamp).format(DATE_FORMAT.YYYYMMDDHHMMSS),
    },
    {
      title: '操作',
      width: 60,
      dataIndex: 'op',
      render: (v, record) => <IconFont title="下载" onClick={handleClickDownloadPkg(record.id)} type="iconxiazai" />,
    },
  ]

  const handleClickDownloadPkg = (id: number) => () => {
    downloadPackage(id)
  }

  const handleTableChange = (pagination: PaginationProps) => {
    const {pageSize: limit, current: current} = pagination
    if (paginationRef.current && limit && current) {
      paginationRef.current = {limit, current}
      getData()
    }
  }
  return (
    <React.Fragment>
      {React.cloneElement(children as React.ReactElement, {
        onClick: handleClickBtn,
      })}
      <Modal title="包下载" visible={visible} width={800} onCancel={handleClickCancel} onOk={handleClickOk}>
        <React.Fragment>
          <Table
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
        </React.Fragment>
      </Modal>
    </React.Fragment>
  )
}

export default PackageDownloadModal
