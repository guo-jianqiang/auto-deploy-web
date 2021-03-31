/** @format */

import React, {useState} from 'react'
import {Popconfirm, Radio, RadioChangeEvent} from 'antd'
import {envs} from '../../constant'
import IconFont from '../../commpent/icon/Icon'

export interface DeployPopconfirmProps {
  // projectId: string
  // sshUrl: string
  onOk: (value: any, cb: Function) => void
  disabled?: boolean
}

const DeployPopconfirm: React.FC<DeployPopconfirmProps> = ({children, onOk}) => {
  const [value, setValue] = useState(envs[0])
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const handleChangeRadio = (e: RadioChangeEvent) => {
    setValue(e.target.value)
  }
  const handleClickBtn = () => setVisible(true)
  const handleCancel = () => setVisible(false)
  const handleOk = () => {
    setConfirmLoading(true)
    onOk(value, () => {
      setConfirmLoading(false)
      handleCancel()
    })
  }
  const renderRadios = (
    <Radio.Group value={value} onChange={handleChangeRadio}>
      {envs.map(env => (
        <Radio key={env} value={env}>
          {env}
        </Radio>
      ))}
    </Radio.Group>
  )
  return (
    <Popconfirm
      title={renderRadios}
      icon={null}
      visible={visible}
      onConfirm={handleOk}
      okButtonProps={{loading: confirmLoading}}
      onCancel={handleCancel}>
      {React.cloneElement(children as React.ReactElement, {
        onClick: handleClickBtn,
      })}
    </Popconfirm>
  )
}

export default DeployPopconfirm
