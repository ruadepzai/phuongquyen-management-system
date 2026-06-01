import { Card, Col, Row, Statistic, Table, Tag, Typography, Space, Divider } from 'antd'
import {
  ShoppingCartOutlined, InboxOutlined, CheckCircleOutlined,
  ClockCircleOutlined, DollarOutlined, FireOutlined,
  CalendarOutlined, CarOutlined
} from '@ant-design/icons'

const { Text, Title } = Typography

function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

// Mock data
const ordersToday = [
  { key: '1', maDH: 'HD3-030526', khachHang: 'Lê Hoàng Nam', loai: 'Tiệc sinh nhật', soMam: 5, thoiGian: '17:00', trangThai: 'ChoDongGoi' },
  { key: '2', maDH: 'HD4-040526', khachHang: 'Phạm Minh Tuấn', loai: 'Cỗ cưới', soMam: 20, thoiGian: '11:00', trangThai: 'DaThanhToanCoc' },
  { key: '3', maDH: 'HD5-050526', khachHang: 'Võ Thị Hương', loai: 'Cỗ giỗ', soMam: 10, thoiGian: '08:00', trangThai: 'DaGiao' },
]

const cookingPlan = [
  { key: '1', tenMon: 'Gà luộc lá chanh', tongMam: 15, daDat: true },
  { key: '2', tenMon: 'Nem rán', tongMam: 25, daDat: true },
  { key: '3', tenMon: 'Bò nướng lá lốt', tongMam: 5, daDat: false },
  { key: '4', tenMon: 'Xôi gấc', tongMam: 30, daDat: true },
  { key: '5', tenMon: 'Gà hấp hành', tongMam: 20, daDat: false },
  { key: '6', tenMon: 'Bánh kem', tongMam: 1, daDat: true },
]

const statusMap = {
  ChoXuLy: { text: 'Chờ xử lý', color: 'gold' },
  DaThanhToanCoc: { text: 'Đã TT cọc', color: 'cyan' },
  ChoDongGoi: { text: 'Chờ đóng gói', color: 'blue' },
  DangDongGoi: { text: 'Đang đóng gói', color: 'processing' },
  DangGiao: { text: 'Đang giao', color: 'geekblue' },
  DaGiao: { text: 'Đã giao', color: 'success' },
  HoanThanh: { text: 'Hoàn thành', color: 'success' },
}

const nguyenLieuCanDat = [
  { key: '1', ten: 'Gà ta', slCan: '25 con', ncc: 'Anh Tuấn', trangThai: 'ChuaDat' },
  { key: '2', ten: 'Tôm sú', slCan: '10 kg', ncc: 'Chị Hoa', trangThai: 'DaDat' },
  { key: '3', ten: 'Thịt lợn', slCan: '15 kg', ncc: 'Anh Bình', trangThai: 'ChuaDat' },
  { key: '4', ten: 'Rau xà lách', slCan: '8 kg', ncc: 'Bác Hùng', trangThai: 'DaDat' },
]

export default function Dashboard() {
  const orderColumns = [
    { title: 'Mã ĐH', dataIndex: 'maDH', render: v => <Text strong style={{ color: 'var(--primary)' }}>{v}</Text> },
    { title: 'Khách hàng', dataIndex: 'khachHang' },
    { title: 'Loại', dataIndex: 'loai', render: v => <Tag style={{ borderRadius: 8 }}>{v}</Tag> },
    { title: 'Mâm', dataIndex: 'soMam', width: 60, align: 'center', render: v => <Text strong>{v}</Text> },
    { title: 'Giờ TC', dataIndex: 'thoiGian', width: 70, render: v => <Text code>{v}</Text> },
    {
      title: 'Trạng thái', dataIndex: 'trangThai', width: 130,
      render: v => <Tag color={statusMap[v]?.color} style={{ borderRadius: 10 }}>{statusMap[v]?.text}</Tag>,
    },
  ]

  const cookColumns = [
    { title: 'Tên món', dataIndex: 'tenMon', render: v => <Text strong>{v}</Text> },
    { title: 'Tổng mâm', dataIndex: 'tongMam', width: 90, align: 'center', render: v => <Tag color="blue" style={{ borderRadius: 8, fontWeight: 700 }}>{v}</Tag> },
    { title: 'NL', dataIndex: 'daDat', width: 100, align: 'center', render: v => v ? <Tag color="success">Đã đặt</Tag> : <Tag color="warning">Chưa đặt</Tag> },
  ]

  const nlColumns = [
    { title: 'Nguyên liệu', dataIndex: 'ten', render: v => <Text strong>{v}</Text> },
    { title: 'SL cần', dataIndex: 'slCan', width: 90 },
    { title: 'NCC', dataIndex: 'ncc', width: 100 },
    { title: 'Trạng thái', dataIndex: 'trangThai', width: 100, render: v => v === 'DaDat' ? <Tag color="success">Đã đặt</Tag> : <Tag color="error">Chưa đặt</Tag> },
  ]

  const statCard = (color) => ({
    background: `linear-gradient(135deg, ${color}22, ${color}08)`,
    border: `1px solid ${color}30`, borderRadius: 14, padding: '4px 0',
  })

  return (
    <div>
      <h2 className="dashboard-title">Tổng quan</h2>

      {/* Stat cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="glass-effect stat-card" style={statCard('#5b8def')}>
            <Statistic title="Đơn hàng hôm nay" value={3} prefix={<ShoppingCartOutlined style={{ color: '#5b8def' }} />} valueStyle={{ color: '#5b8def' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="glass-effect stat-card" style={statCard('#faad14')}>
            <Statistic title="Đang đóng gói" value={1} prefix={<InboxOutlined style={{ color: '#faad14' }} />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="glass-effect stat-card" style={statCard('#52c41a')}>
            <Statistic title="Hoàn thành" value={1} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="glass-effect stat-card" style={statCard('#722ed1')}>
            <Statistic title="Doanh thu tháng" value={105600000} prefix={<DollarOutlined style={{ color: '#722ed1' }} />} valueStyle={{ color: '#722ed1' }}
              formatter={val => new Intl.NumberFormat('vi-VN').format(val / 1000000) + 'tr'} />
          </Card>
        </Col>
      </Row>

      {/* Tables row */}
      <Row gutter={[20, 20]}>
        {/* Đơn hàng trong ngày */}
        <Col xs={24} lg={14}>
          <Card className="glass-effect" style={{ borderRadius: 16 }}
            title={<Space><CalendarOutlined style={{ color: 'var(--primary)' }} /><Text strong>Đơn hàng giao hôm nay</Text></Space>}>
            <Table columns={orderColumns} dataSource={ordersToday}
              pagination={false} size="small" rowClassName="order-row" />
          </Card>
        </Col>

        {/* Kế hoạch chế biến */}
        <Col xs={24} lg={10}>
          <Card className="glass-effect" style={{ borderRadius: 16 }}
            title={<Space><FireOutlined style={{ color: '#fa541c' }} /><Text strong>Kế hoạch chế biến hôm nay</Text></Space>}>
            <Table columns={cookColumns} dataSource={cookingPlan}
              pagination={false} size="small" rowClassName="order-row" />
          </Card>
        </Col>
      </Row>

      {/* Nguyên liệu cần đặt */}
      <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
        <Col xs={24}>
          <Card className="glass-effect" style={{ borderRadius: 16 }}
            title={<Space><ShoppingCartOutlined style={{ color: '#fa8c16' }} /><Text strong>Nguyên liệu cần đặt hàng</Text></Space>}>
            <Table columns={nlColumns} dataSource={nguyenLieuCanDat}
              pagination={false} size="small" rowClassName="order-row" />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
