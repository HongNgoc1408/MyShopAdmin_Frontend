import { ArrowDownOutlined, ArrowUpOutlined, LikeOutlined } from '@ant-design/icons'
import { Card, Statistic } from 'antd'
import React from 'react'

const Home = () => {
  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <Card bordered={false} className="drop-shadow">
          <Statistic
            title="Active"
            value={11.28}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined />}
            suffix="%"
          />
        </Card>
        <div>
          <Card bordered={false}>
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </div>
        <div>
          <Card bordered={false}>
            <Statistic title="Feedback" value={1128} prefix={<LikeOutlined />} />
          </Card>
        </div>
        <div>
          <Card bordered={false}>
            <Statistic title="Unmerged" value={93} suffix="/ 100" />
          </Card>
        </div>
        <div>
          <Card bordered={false}>
            <Statistic title="Unmerged" value={93} suffix="/ 100" />
          </Card>
        </div>
        <div>
          <Card bordered={false}>
            <Statistic title="Unmerged" value={93} suffix="/ 100" />
          </Card>
        </div>
        <div>
          <Card bordered={false}>
            <Statistic title="Unmerged" value={93} suffix="/ 100" />
          </Card>
        </div>
        <div>
          <Card bordered={false}>
            <Statistic title="Unmerged" value={93} suffix="/ 100" />
          </Card>
        </div>
        <div>
          <Card bordered={false}>
            <Statistic title="Unmerged" value={93} suffix="/ 100" />
          </Card>
        </div>
        <div>
          <Card bordered={false}>
            <Statistic title="Unmerged" value={93} suffix="/ 100" />
          </Card>
        </div>
      </div>
    </>
  )
}

export default Home