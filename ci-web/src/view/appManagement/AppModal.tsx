/** @format */

import React, {useState} from 'react'
import {Modal, Form, Input, Select, Radio, InputNumber} from 'antd'
import {layout, GITLAB_URL} from '../../constant'
import PortInputs, {PortProps} from './PortInputs'

const {Option} = Select

interface AppModalProps {
  isEdit?: boolean
  record?: {
    [key: string]: any
  }
  title: string
  onOk: (value: Object, cb: Function) => void
  [key: string]: any
}

const AppModal: React.FC<AppModalProps> = ({
  isEdit = false,
  record = {},
  title,
  groupLoading,
  groups = [],
  onOk,
  onGroupDropdownVisibleChange,
  children,
}) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const handleClickSubmit = () => {
    form.validateFields().then(values => {
      setLoading(true)
      // values['path'] = GITLAB_URL + '/' + values['path'] + '/' + slug
      onOk(values, () => {
        setLoading(false)
        // handleClickCancel()
      })
    })
  }
  const handleClickCancel = () => {
    setVisible(false)
  }

  const handleClickBtn = () => {
    setVisible(true)
  }

  const handleDropdownVisibleChange = (open: boolean) => {
    onGroupDropdownVisibleChange(open)
  }
  return (
    <React.Fragment>
      {React.cloneElement(children as React.ReactElement, {
        onClick: handleClickBtn,
      })}
      <Modal
        visible={visible}
        title={title}
        destroyOnClose
        // width={300}
        confirmLoading={loading}
        onOk={handleClickSubmit}
        onCancel={handleClickCancel}>
        <Form {...layout} form={form} preserve={false}>
          <Form.Item
            label="应用名称"
            name="name"
            rules={[{required: true, message: '请填写应用名称'}]}
            initialValue={record.name}>
            <Input disabled={isEdit} placeholder="应用名称" />
          </Form.Item>
          {!isEdit && (
            <Form.Item
              label="分组"
              name="namespace_id"
              rules={[{required: true, message: '请完善项目地址'}]}
              initialValue={record.namespace_id}>
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
            </Form.Item>
          )}
          <Form.Item label="项目描述" name="description" initialValue={record.description}>
            <Input.TextArea placeholder="描述" />
          </Form.Item>
          <Form.Item name="visibility" label="visibility" initialValue={record.visibility || 'private'}>
            <Radio.Group disabled={isEdit}>
              <Radio value="private">私有</Radio>
              <Radio value="public">公有</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="部署端口号"
            name="ports"
            initialValue={record.ports}
            rules={[
              {
                required: true,
                message: '请填写端口信息',
              },
              () => ({
                validator(_, value) {
                  if (!value.length) {
                    return Promise.reject(new Error('请填写端口信息'))
                  }
                  if (value.find((item: PortProps) => !item.env || !item.port)) {
                    return Promise.reject(new Error('请填写完整端口信息'))
                  }
                  return Promise.resolve()
                  // return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}>
            <PortInputs />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  )
}

export default AppModal
