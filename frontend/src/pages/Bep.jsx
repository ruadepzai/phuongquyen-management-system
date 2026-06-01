import { useState } from 'react'
import {
  Card, Row, Col, Statistic, Tag, Table, Collapse, Space,
  Typography, Button, message, Badge, Select
} from 'antd'
import {
  FireOutlined, CheckCircleOutlined, ClockCircleOutlined,
  CaretRightOutlined, CalendarOutlined, SyncOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

// ==================== MOCK DATA ====================
const mockBepData = {
  '2026-05-07': [
    {
      maDH: 'HD3-030526', khachHang: 'Lê Hoàng Nam', loai: 'Tiệc sinh nhật', soMam: 5,
      thoiGianToChuc: '17:00',
      monAn: [
        { tenMon: 'Bò nướng lá lốt', soLuong: 5 },
        { tenMon: 'Gỏi cuốn', soLuong: 5 },
        { tenMon: 'Cơm chiên', soLuong: 5 },
        { tenMon: 'Canh chua cá', soLuong: 5 },
        { tenMon: 'Chè thái', soLuong: 5 },
        { tenMon: 'Bánh kem', soLuong: 1 },
      ],
    },
    {
      maDH: 'HD4-040526', khachHang: 'Phạm Minh Tuấn', loai: 'Cỗ cưới', soMam: 20,
      thoiGianToChuc: '11:00',
      monAn: [
        { tenMon: 'Gà hấp hành', soLuong: 20 },
        { tenMon: 'Nem cuốn', soLuong: 20 },
        { tenMon: 'Bò xào lúc lắc', soLuong: 20 },
        { tenMon: 'Xôi gấc', soLuong: 20 },
        { tenMon: 'Chè hạt sen', soLuong: 20 },
        { tenMon: 'Hoa quả dĩa', soLuong: 20 },
        { tenMon: 'Nước uống', soLuong: 20 },
      ],
    },
    {
      maDH: 'HD5-050526', khachHang: 'Võ Thị Hương', loai: 'Cỗ giỗ', soMam: 10,
      thoiGianToChuc: '08:00',
      monAn: [
        { tenMon: 'Gà luộc', soLuong: 10 },
        { tenMon: 'Xôi gấc', soLuong: 10 },
        { tenMon: 'Giò chả', soLuong: 10 },
        { tenMon: 'Canh măng', soLuong: 10 },
        { tenMon: 'Nem rán', soLuong: 10 },
        { tenMon: 'Chè kho', soLuong: 10 },
      ],
    },
  ],
  '2026-05-09': [
    {
      maDH: 'HD6-060526', khachHang: 'Đặng Quốc Việt', loai: 'Tiệc liên hoan', soMam: 12,
      thoiGianToChuc: '12:00',
      monAn: [
        { tenMon: 'Bò sốt tiêu đen', soLuong: 12 },
        { tenMon: 'Cá chiên giòn', soLuong: 12 },
        { tenMon: 'Gỏi ngó sen', soLuong: 12 },
        { tenMon: 'Xôi vò', soLuong: 12 },
        { tenMon: 'Canh cua', soLuong: 12 },
        { tenMon: 'Chè thập cẩm', soLuong: 12 },
      ],
    },
  ],
  '2026-05-05': [
    {
      maDH: 'HD1-010526', khachHang: 'Nguyễn Văn An', loai: 'Cỗ cưới', soMam: 15,
      thoiGianToChuc: '10:00',
      monAn: [
        { tenMon: 'Gà luộc lá chanh', soLuong: 15 },
        { tenMon: 'Nem rán', soLuong: 15 },
        { tenMon: 'Xôi gấc', soLuong: 15 },
        { tenMon: 'Canh măng', soLuong: 15 },
        { tenMon: 'Giò thủ', soLuong: 15 },
        { tenMon: 'Chè sen', soLuong: 15 },
        { tenMon: 'Hoa quả dĩa', soLuong: 15 },
        { tenMon: 'Nước ngọt', soLuong: 15 },
      ],
    },
    {
      maDH: 'HD2-020526', khachHang: 'Trần Thị Bích', loai: 'Cỗ giỗ', soMam: 8,
      thoiGianToChuc: '11:30',
      monAn: [
        { tenMon: 'Gà luộc lá chanh', soLuong: 8 },
        { tenMon: 'Xôi gấc', soLuong: 8 },
        { tenMon: 'Canh bóng', soLuong: 8 },
        { tenMon: 'Giò lụa', soLuong: 8 },
        { tenMon: 'Chè kho', soLuong: 8 },
      ],
    },
  ],
}

// ==================== COMPONENT ====================
export default function Bep() {
  const [cookingStatus, setCookingStatus] = useState({})
  const allDates = Object.keys(mockBepData).sort()

  const statusOptions = [
    { value: 'ChuaNau', label: '⏳ Chưa nấu', color: 'default' },
    { value: 'DangNau', label: '🔥 Đang nấu', color: 'processing' },
    { value: 'DaXong', label: '✅ Đã xong', color: 'success' },
  ]

  const handleStatusChange = (dateStr, tenMon, newStatus) => {
    setCookingStatus(prev => ({
      ...prev,
      [`${dateStr}_${tenMon}`]: newStatus,
    }))
    const label = statusOptions.find(s => s.value === newStatus)?.label || newStatus
    message.success(`${tenMon}: ${label}`)
  }

  // Aggregate dishes for a date
  const aggregateDishes = (dateStr) => {
    const orders = mockBepData[dateStr]
    const dishMap = {}
    orders.forEach(order => {
      order.monAn.forEach(mon => {
        if (!dishMap[mon.tenMon]) {
          dishMap[mon.tenMon] = { tenMon: mon.tenMon, tongSL: 0, chiTiet: [] }
        }
        dishMap[mon.tenMon].tongSL += mon.soLuong
        dishMap[mon.tenMon].chiTiet.push({ maDH: order.maDH, khach: order.khachHang, soLuong: mon.soLuong })
      })
    })
    return Object.values(dishMap).sort((a, b) => b.tongSL - a.tongSL)
  }

  // Stats
  const allOrders = Object.values(mockBepData).flat()
  const tongDon = allOrders.length
  const tongMam = allOrders.reduce((s, o) => s + o.soMam, 0)
  const allDishes = allDates.flatMap(d => aggregateDishes(d))
  const tongMon = new Set(allDishes.map(d => d.tenMon)).size
  const doneCount = Object.values(cookingStatus).filter(v => v === 'DaXong').length

  const statCard = (color) => ({
    background: `linear-gradient(135deg, ${color}22, ${color}08)`,
    border: `1px solid ${color}30`, borderRadius: 14, padding: '16px 20px',
  })

  // Collapse items
  const collapseItems = allDates.map(dateStr => {
    const orders = mockBepData[dateStr]
    const tongMamNgay = orders.reduce((s, o) => s + o.soMam, 0)
    const dishes = aggregateDishes(dateStr)

    const dishColumns = [
      { title: 'Tên món', dataIndex: 'tenMon', render: v => <Text strong>{v}</Text> },
      {
        title: 'Tổng SL (mâm)', dataIndex: 'tongSL', width: 130, align: 'center',
        render: v => <Tag color="blue" style={{ borderRadius: 8, fontWeight: 700, fontSize: 14 }}>{v}</Tag>,
        sorter: (a, b) => a.tongSL - b.tongSL,
      },
      {
        title: 'Chi tiết đơn', key: 'chiTiet', width: 280,
        render: (_, r) => (
          <Space wrap size={[4, 4]}>
            {r.chiTiet.map((ct, i) => (
              <Tag key={i} style={{ borderRadius: 6 }}>{ct.maDH}: {ct.soLuong} mâm ({ct.khach})</Tag>
            ))}
          </Space>
        ),
      },
      {
        title: 'Trạng thái', key: 'status', width: 160, align: 'center',
        render: (_, r) => {
          const key = `${dateStr}_${r.tenMon}`
          const current = cookingStatus[key] || 'ChuaNau'
          return (
            <Select size="small" value={current}
              onChange={v => handleStatusChange(dateStr, r.tenMon, v)}
              style={{ width: 140 }}
              options={statusOptions.map(s => ({
                value: s.value,
                label: <Tag color={s.color} style={{ borderRadius: 8, margin: 0 }}>{s.label}</Tag>,
              }))} />
          )
        },
      },
    ]

    return {
      key: dateStr,
      label: (
        <Space size={16}>
          <Text strong style={{ fontSize: 15, color: '#5b8def' }}>
            <CalendarOutlined style={{ marginRight: 6 }} />{dateStr}
          </Text>
          <Tag color="blue">{orders.length} đơn</Tag>
          <Tag color="green">{tongMamNgay} mâm</Tag>
          <Tag color="orange">{dishes.length} món</Tag>
        </Space>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Order summary cards */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {orders.map(order => (
              <div key={order.maDH} style={{
                background: 'rgba(91,141,239,0.06)', border: '1px solid rgba(91,141,239,0.15)',
                borderRadius: 12, padding: '12px 16px', minWidth: 220, flex: '1 1 220px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text strong style={{ color: '#5b8def' }}>{order.maDH}</Text>
                  <Tag color="green" style={{ borderRadius: 6 }}>{order.soMam} mâm</Tag>
                </div>
                <Text>{order.khachHang}</Text>
                <div><Text type="secondary" style={{ fontSize: 12 }}>{order.loai} • Giao lúc {order.thoiGianToChuc}</Text></div>
              </div>
            ))}
          </div>

          {/* Aggregated cooking list */}
          <Card size="small" title={<Text strong><FireOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />Danh sách món cần chế biến</Text>}
            style={{ borderRadius: 12, background: 'rgba(255,255,255,0.04)' }}>
            <Table columns={dishColumns} dataSource={dishes.map((d, i) => ({ ...d, key: i }))}
              pagination={false} size="small" />
          </Card>
        </div>
      ),
    }
  })

  return (
    <div>
      <h2 className="dashboard-title">Bếp — Kế hoạch Chế biến</h2>
      <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>Tổng hợp danh sách món cần chế biến theo ngày</Text>

      {/* Stats */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <div style={statCard('#5b8def')}>
            <Statistic title="Tổng đơn" value={tongDon} prefix={<CalendarOutlined />} valueStyle={{ color: '#5b8def' }} />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div style={statCard('#52c41a')}>
            <Statistic title="Tổng mâm" value={tongMam} prefix={<FireOutlined />} valueStyle={{ color: '#52c41a' }} />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div style={statCard('#fa541c')}>
            <Statistic title="Loại món cần nấu" value={tongMon} prefix={<SyncOutlined />} valueStyle={{ color: '#fa541c' }} />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div style={statCard('#722ed1')}>
            <Statistic title="Đã hoàn thành" value={doneCount} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#722ed1' }} />
          </div>
        </Col>
      </Row>

      {/* Collapse by date */}
      <Card bordered={false} className="glass-effect" style={{ borderRadius: 16 }}>
        <Collapse items={collapseItems} defaultActiveKey={[allDates[0]]}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          style={{ background: 'transparent', border: 'none' }} size="large" />
      </Card>
    </div>
  )
}
