/** @format */

import React, {useState} from 'react'
import {Select, Row, Col, InputNumber} from 'antd'
import {envs} from '../../constant'
import IconFont from '../../commpent/icon/Icon'
import {getUuid} from '../../lib/until'

const {Option} = Select

export interface PortInputsProps {
  // onChange: (value: Array<any>) => void;
  [key: string]: any
}

export interface PortProps {
  id: string
  env?: string
  port?: number
  [key: string]: any
}

const PortInputs: React.FC<PortInputsProps> = ({value = [], onChange}) => {
  const [ports, setPorts] = useState<Array<PortProps>>(value.length ? value : [{id: getUuid()}])


  const handleChange = (key: string, i: number) => (e: any) => {
    console.log(value[i])
    ports[i][key] = e.target ? e.target.value : e
    setPorts([...ports])
    onChange(ports)
  }
  const handleClickAddPort = () => {
    ports.push({id: getUuid()})
    setPorts([...ports])
  }

  const handleClickDelPort = (index: number) => () => {
    if (ports.length === 1) return
    ports.splice(index, 1)
    setPorts([...ports])
    onChange(ports)
  }
  const disabledOpt = (env: string) => !!ports.find(item => item.env === env)
  return (
    <React.Fragment>
      {ports.map((item: PortProps, i: number) => (
        <Row key={item.id} gutter={[8, 8]} align="middle" style={{marginBottom: 8}}>
          <Col span={8}>
            <Select placeholder="环境" value={item.env} onChange={handleChange('env', i)}>
              {envs.map(env => (
                <Option key={env} value={env} disabled={disabledOpt(env)}>
                  {env}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={10}>
            <InputNumber
              style={{width: '100%'}}
              value={item.port}
              placeholder="端口"
              onChange={handleChange('port', i)}
            />
          </Col>
          <Col span={6}>
            {i === 0 && (
              <IconFont
                className="link-text"
                type="icontianjia"
                style={{fontSize: 24, marginRight: 8}}
                onClick={handleClickAddPort}
              />
            )}
            <IconFont className="danger-text" type="iconjian" style={{fontSize: 24}} onClick={handleClickDelPort(i)} />
          </Col>
        </Row>
      ))}
    </React.Fragment>
  )
}

export default PortInputs
