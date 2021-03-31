/** @format */

import * as React from 'react'
import {createFromIconfontCN} from '@ant-design/icons'
import {Tooltip} from 'antd'
import cs from 'classnames'
import './style.less'

declare let require: any

export interface IconProps {
  type: string
  title?: string
  // scriptUrl?: any;
  className?: string
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

const Icon = createFromIconfontCN({
  scriptUrl: require('./iconfont.js'),
})

const IconFont = (props: IconProps) => {
  const {title, style, ...otherProps} = props
  const icon = <Icon {...otherProps} style={{...style, fontSize: 18}} />
  if (title) {
    return (
      <Tooltip title={title}>
        {icon}
      </Tooltip>
    )
  } else {
    return icon
  }
}

export default IconFont
