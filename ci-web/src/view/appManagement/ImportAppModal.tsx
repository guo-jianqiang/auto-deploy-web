/** @format */

import React, {useState, useRef} from 'react'
import {Modal, Form, Button, Input, Select, Table, PaginationProps} from 'antd'
import {getApps} from '../../api/gitlab'

const {Option} = Select

export interface ImportAppModalProps {
  onOk: (cb: () => void) => void
  // groupLoading: boolean;
  // onGroupDropdownVisibleChange: (open: boolean) => void;
  // groups: Array<any>;
}

const ImportAppModal: React.FC<ImportAppModalProps> = ({
  // groups = [],
  onOk = () => {},
  // groupLoading,
  // onGroupDropdownVisibleChange = () => {},
  children,
}) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])

  // const paginationRef = useRef<{per_page: number, page: number}>({per_page: 20, page: 1})

  const [form] = Form.useForm()

  const handleClickBtn = () => {
    setVisible(true)
    getData()
    // getApps('23').then((res) => {
    //   setVisible(res as any)
    // })
  }
  const queryData = () => {
    // if (paginationRef.current) {
    //   paginationRef.current['page'] = 1
    // }
    getData()
  }

  const getData = () => {
    const search = form.getFieldValue('search')
    getApps({search, per_page: 100}).then(res => {
      setDataSource(res as any)
      setLoading(false)
    })
  }
  const handleClickOk = () => {
    onOk(() => {
      handleClickCancel()
    })
  }
  const handleClickCancel = () => setVisible(false)

  // const handleDropdownVisibleChange = (open: boolean) => {
  //   onGroupDropdownVisibleChange(open)
  // }
  const columns = [
    {
      title: '项目名',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: 'ssh地址',
      dataIndex: 'ssh_url_to_repo',
    },
    {
      title: 'http地址',
      dataIndex: 'http_url_to_repo',
    },
    {
      title: '项目地址',
      dataIndex: 'web_url',
    },
  ]
  // const handleTableChange = (pagination: PaginationProps) => {
  //   const { pageSize: per_page, current: page } = pagination
  //   paginationRef.current = { per_page, page }
  //   getData()
  // }
  return (
    <React.Fragment>
      {React.cloneElement(children as React.ReactElement, {
        onClick: handleClickBtn,
      })}
      <Modal title="导入项目" visible={visible} width={600} onCancel={handleClickCancel} onOk={handleClickOk}>
        <React.Fragment>
          <Form form={form} onFinish={queryData} layout="inline">
            {/* <Form.Item label="分组" name="namespace_id" rules={[{ required: true, message: '请完善项目地址' }]}>
            <Select
              loading={groupLoading}
              onDropdownVisibleChange={handleDropdownVisibleChange}
              placeholder="分组"
              allowClear>
              {groups.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.full_name}
                </Option>
              ))}
            </Select>
          </Form.Item> */}
            <Form.Item name="search">
              <Input style={{width: 200, marginRight: 16}} placeholder="搜索" allowClear />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
          </Form>
          <Table
            columns={columns}
            dataSource={dataSource}
            // onChange={handleTableChange}
            pagination={false}
          />
        </React.Fragment>
      </Modal>
    </React.Fragment>
  )
}

export default ImportAppModal
