import { Card, Col, Row, Statistic } from 'antd'
import { ShoppingCartOutlined, InboxOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'

export default function Dashboard() {
  return (
    <div>
      <h2 className="dashboard-title">Tổng quan</h2>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="glass-effect stat-card">
            <Statistic 
              title="Đơn hàng hôm nay" 
              value={12} 
              prefix={<ShoppingCartOutlined style={{ color: 'var(--primary)' }} />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="glass-effect stat-card">
            <Statistic 
              title="Đang đóng gói" 
              value={3} 
              prefix={<InboxOutlined style={{ color: '#faad14' }} />} 
              valueStyle={{ color: '#faad14' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="glass-effect stat-card">
            <Statistic 
              title="Đã hoàn thành" 
              value={8} 
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} 
              valueStyle={{ color: '#52c41a' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="glass-effect stat-card">
            <Statistic 
              title="Chờ xử lý" 
              value={1} 
              prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />} 
              valueStyle={{ color: '#1890ff' }} 
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
