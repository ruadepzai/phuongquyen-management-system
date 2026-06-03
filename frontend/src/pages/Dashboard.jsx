import { useState } from 'react'
import { Card, Col, Row, Statistic, Table, Tag, Typography, Space } from 'antd'
import {
  ShoppingCartOutlined, InboxOutlined, CheckCircleOutlined,
  FireOutlined, CalendarOutlined, DownOutlined, RightOutlined
} from '@ant-design/icons'

const { Text } = Typography

function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

// Mock data
const ordersToday = [
  {
    key: '1', maDH: 'HD3-030526', khachHang: 'Lê Hoàng Nam', loai: 'Tiệc sinh nhật', soMam: 5, thoiGian: '17:00', trangThai: 'ChoDongGoi',
    monAn: [
      { ten: 'Bò nướng lá lốt', sl: 5, donGia: 400000 },
      { ten: 'Gỏi cuốn', sl: 5, donGia: 200000 },
      { ten: 'Cơm chiên', sl: 5, donGia: 180000 },
      { ten: 'Canh chua cá', sl: 5, donGia: 220000 },
      { ten: 'Chè thái', sl: 5, donGia: 150000 },
      { ten: 'Bánh kem', sl: 1, donGia: 1750000 },
    ],
  },
  {
    key: '2', maDH: 'HD4-040526', khachHang: 'Phạm Minh Tuấn', loai: 'Cỗ cưới', soMam: 20, thoiGian: '11:00', trangThai: 'DaThanhToanCoc',
    monAn: [
      { ten: 'Gà hấp hành', sl: 20, donGia: 380000 },
      { ten: 'Nem cuốn', sl: 20, donGia: 220000 },
      { ten: 'Bò xào lúc lắc', sl: 20, donGia: 450000 },
      { ten: 'Xôi gấc', sl: 20, donGia: 150000 },
      { ten: 'Chè hạt sen', sl: 20, donGia: 200000 },
      { ten: 'Hoa quả dĩa', sl: 20, donGia: 100000 },
      { ten: 'Nước uống', sl: 20, donGia: 300000 },
    ],
  },
  {
    key: '3', maDH: 'HD5-050526', khachHang: 'Võ Thị Hương', loai: 'Cỗ giỗ', soMam: 10, thoiGian: '08:00', trangThai: 'DaGiao',
    monAn: [
      { ten: 'Gà luộc', sl: 10, donGia: 350000 },
      { ten: 'Xôi gấc', sl: 10, donGia: 150000 },
      { ten: 'Giò chả', sl: 10, donGia: 250000 },
      { ten: 'Canh măng', sl: 10, donGia: 180000 },
      { ten: 'Nem rán', sl: 10, donGia: 200000 },
      { ten: 'Chè kho', sl: 10, donGia: 250000 },
    ],
  },
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

  // Expandable row to show menu items
  const expandedRowRender = (record) => {
    const monCols = [
      { title: 'Tên món', dataIndex: 'ten', render: v => <Text strong>{v}</Text> },
      { title: 'SL', dataIndex: 'sl', width: 60, align: 'center' },
      { title: 'Đơn giá', dataIndex: 'donGia', width: 120, align: 'right', render: v => formatVND(v) },
      { title: 'Thành tiền', key: 'tt', width: 130, align: 'right', render: (_, r) => <Text strong style={{ color: '#52c41a' }}>{formatVND(r.sl * r.donGia)}</Text> },
    ]
    return (
      <Table columns={monCols} dataSource={record.monAn.map((m, i) => ({ ...m, key: i }))}
        pagination={false} size="small" style={{ margin: '0 0 0 24px' }} />
    )
  }

  const cookColumns = [
    { title: 'Tên món', dataIndex: 'tenMon', render: v => <Text strong>{v}</Text> },
    { title: 'Mâm', dataIndex: 'tongMam', width: 60, align: 'center', render: v => <Tag color="blue" style={{ borderRadius: 8, fontWeight: 700 }}>{v}</Tag> },
    { title: 'NL', dataIndex: 'daDat', width: 80, align: 'center', render: v => v ? <Tag color="success">Đã đặt</Tag> : <Tag color="warning">Chưa</Tag> },
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
        <Col xs={24} sm={8}>
          <Card bordered={false} className="glass-effect stat-card" style={statCard('#5b8def')}>
            <Statistic title="Đơn hàng hôm nay" value={3} prefix={<ShoppingCartOutlined style={{ color: '#5b8def' }} />} valueStyle={{ color: '#5b8def' }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="glass-effect stat-card" style={statCard('#faad14')}>
            <Statistic title="Đang đóng gói" value={1} prefix={<InboxOutlined style={{ color: '#faad14' }} />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="glass-effect stat-card" style={statCard('#52c41a')}>
            <Statistic title="Hoàn thành" value={1} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
      </Row>

      {/* Tables row */}
      <Row gutter={[20, 20]}>
        {/* Đơn hàng trong ngày - expandable */}
        <Col xs={24} lg={16}>
          <Card className="glass-effect" style={{ borderRadius: 16 }}
            title={<Space><CalendarOutlined style={{ color: 'var(--primary)' }} /><Text strong>Đơn hàng giao hôm nay</Text></Space>}>
            <Table columns={orderColumns} dataSource={ordersToday}
              pagination={false} size="small" rowClassName="order-row"
              expandable={{
                expandedRowRender,
                expandRowByClick: true,
                expandIcon: ({ expanded, onExpand, record }) =>
                  expanded ? <DownOutlined onClick={e => onExpand(record, e)} style={{ color: 'var(--primary)', cursor: 'pointer' }} />
                    : <RightOutlined onClick={e => onExpand(record, e)} style={{ color: '#aaa', cursor: 'pointer' }} />,
              }} />
          </Card>
        </Col>

        {/* Kế hoạch chế biến - thu nhỏ */}
        <Col xs={24} lg={8}>
          <Card className="glass-effect" style={{ borderRadius: 16 }}
            title={<Space><FireOutlined style={{ color: '#fa541c' }} /><Text strong>Chế biến hôm nay</Text></Space>}>
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
