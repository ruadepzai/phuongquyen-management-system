import { useState } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Typography, Divider, Space, Select } from 'antd'
import {
  ShoppingCartOutlined, CheckCircleOutlined,
  DollarOutlined, TeamOutlined,
  RiseOutlined, ClockCircleOutlined, CalendarOutlined
} from '@ant-design/icons'

const { Text, Title } = Typography

// Format VNĐ
function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

// ==================== MOCK DATA ====================
const summaryStats = {
  tongDon: 48,
  donHoanThanh: 42,
  donDangXuLy: 6,
  doanhThu: 576000000,
  soNVHoatDong: 6,
}

// Thống kê đơn hàng theo ngày — nhiều tháng
const allDailyStats = {
  '2026-05': [
    { ngay: '01/05', soDon: 2, doanhThu: 21000000, tongMam: 18 },
    { ngay: '02/05', soDon: 3, doanhThu: 35000000, tongMam: 28 },
    { ngay: '03/05', soDon: 3, doanhThu: 44100000, tongMam: 35 },
    { ngay: '04/05', soDon: 1, doanhThu: 36000000, tongMam: 20 },
    { ngay: '05/05', soDon: 2, doanhThu: 19500000, tongMam: 15 },
    { ngay: '06/05', soDon: 2, doanhThu: 25500000, tongMam: 22 },
    { ngay: '07/05', soDon: 4, doanhThu: 52000000, tongMam: 45 },
    { ngay: '08/05', soDon: 3, doanhThu: 38000000, tongMam: 30 },
    { ngay: '09/05', soDon: 2, doanhThu: 30000000, tongMam: 25 },
    { ngay: '10/05', soDon: 3, doanhThu: 42000000, tongMam: 32 },
    { ngay: '12/05', soDon: 1, doanhThu: 15000000, tongMam: 10 },
    { ngay: '14/05', soDon: 2, doanhThu: 28000000, tongMam: 20 },
    { ngay: '15/05', soDon: 4, doanhThu: 55000000, tongMam: 48 },
    { ngay: '17/05', soDon: 2, doanhThu: 22000000, tongMam: 18 },
    { ngay: '19/05', soDon: 3, doanhThu: 40000000, tongMam: 35 },
    { ngay: '20/05', soDon: 2, doanhThu: 18000000, tongMam: 14 },
    { ngay: '22/05', soDon: 1, doanhThu: 12000000, tongMam: 8 },
    { ngay: '24/05', soDon: 3, doanhThu: 33000000, tongMam: 28 },
    { ngay: '25/05', soDon: 2, doanhThu: 27000000, tongMam: 22 },
    { ngay: '27/05', soDon: 3, doanhThu: 38000000, tongMam: 30 },
  ],
  '2026-06': [
    { ngay: '01/06', soDon: 2, doanhThu: 24000000, tongMam: 20 },
    { ngay: '02/06', soDon: 3, doanhThu: 42000000, tongMam: 35 },
    { ngay: '03/06', soDon: 1, doanhThu: 18000000, tongMam: 10 },
    { ngay: '04/06', soDon: 3, doanhThu: 45000000, tongMam: 40 },
  ],
  '2026-04': [
    { ngay: '05/04', soDon: 1, doanhThu: 12000000, tongMam: 10 },
    { ngay: '08/04', soDon: 2, doanhThu: 28000000, tongMam: 22 },
    { ngay: '10/04', soDon: 3, doanhThu: 35000000, tongMam: 30 },
    { ngay: '12/04', soDon: 2, doanhThu: 20000000, tongMam: 16 },
    { ngay: '15/04', soDon: 4, doanhThu: 50000000, tongMam: 42 },
    { ngay: '18/04', soDon: 1, doanhThu: 9000000, tongMam: 8 },
    { ngay: '20/04', soDon: 3, doanhThu: 38000000, tongMam: 30 },
    { ngay: '22/04', soDon: 2, doanhThu: 25000000, tongMam: 20 },
    { ngay: '25/04', soDon: 3, doanhThu: 42000000, tongMam: 35 },
    { ngay: '28/04', soDon: 2, doanhThu: 30000000, tongMam: 24 },
  ],
}

// Bảng NCC
const nccStats = [
  { key: '1', nccTen: 'Anh Tuấn', soLanGiao: 20, soLanLoi: 2 },
  { key: '2', nccTen: 'Chị Hoa', soLanGiao: 15, soLanLoi: 3 },
  { key: '3', nccTen: 'Bác Hùng', soLanGiao: 12, soLanLoi: 0 },
  { key: '4', nccTen: 'Cô Lan', soLanGiao: 18, soLanLoi: 1 },
  { key: '5', nccTen: 'Anh Bình', soLanGiao: 8, soLanLoi: 1 },
]

const monthOptions = [
  { value: '2026-06', label: 'Tháng 6/2026' },
  { value: '2026-05', label: 'Tháng 5/2026' },
  { value: '2026-04', label: 'Tháng 4/2026' },
]

// ==================== COMPONENT ====================
export default function BaoCao() {
  const [selectedMonth, setSelectedMonth] = useState('2026-05')
  const dailyStats = allDailyStats[selectedMonth] || []
  const maxDon = Math.max(...dailyStats.map(d => d.soDon), 1)
  const maxDoanhThu = Math.max(...dailyStats.map(d => d.doanhThu), 1)
  const maxMam = Math.max(...dailyStats.map(d => d.tongMam), 1)

  // Cột bảng NCC
  const nccColumns = [
    {
      title: 'Nhà cung cấp', dataIndex: 'nccTen', key: 'nccTen',
      render: v => <Text strong>{v}</Text>,
    },
    {
      title: 'Có lỗi', dataIndex: 'soLanLoi', key: 'soLanLoi', width: 100, align: 'center',
      render: v => v > 0 ? <Tag color="error" style={{ borderRadius: 8 }}>{v}</Tag> : <Tag color="default" style={{ borderRadius: 8 }}>0</Tag>,
    },
    {
      title: 'Số lần giao', dataIndex: 'soLanGiao', key: 'soLanGiao', width: 120, align: 'center',
      render: v => <Text strong style={{ color: 'var(--primary)' }}>{v}</Text>,
    },
  ]

  // Filter header
  const monthFilter = (
    <Select
      value={selectedMonth}
      onChange={v => setSelectedMonth(v)}
      options={monthOptions}
      style={{ width: 160, borderRadius: 10 }}
      size="small"
    />
  )

  return (
    <div>
      <h2 className="dashboard-title">Báo cáo & Thống kê</h2>

      {/* Thống kê tổng quan — 5 cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} lg={5}>
          <Card bordered={false} className="glass-effect stat-card" style={{ borderRadius: 16 }}>
            <Statistic title="Tổng đơn" value={summaryStats.tongDon} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={5}>
          <Card bordered={false} className="glass-effect stat-card" style={{ borderRadius: 16 }}>
            <Statistic title="Hoàn thành" value={summaryStats.donHoanThanh} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={5}>
          <Card bordered={false} className="glass-effect stat-card" style={{ borderRadius: 16 }}>
            <Statistic title="Đang xử lý" value={summaryStats.donDangXuLy} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={5}>
          <Card bordered={false} className="glass-effect stat-card" style={{ borderRadius: 16 }}>
            <Statistic title="Doanh thu" value={summaryStats.doanhThu} prefix={<DollarOutlined />} suffix="₫" valueStyle={{ color: 'var(--primary)' }}
              formatter={(val) => new Intl.NumberFormat('vi-VN').format(val / 1000000) + 'tr'} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card bordered={false} className="glass-effect stat-card" style={{ borderRadius: 16 }}>
            <Statistic title="NV hoạt động" value={summaryStats.soNVHoatDong} prefix={<TeamOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ đơn hàng theo ngày — FULL WIDTH + filter tháng */}
      <Card bordered={false} className="glass-effect" style={{ borderRadius: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Title level={5} style={{ margin: 0 }}><RiseOutlined /> Đơn hàng theo ngày</Title>
          {monthFilter}
        </div>
        <div className="chart-container">
          {dailyStats.map((d, i) => (
            <div key={i} className="chart-bar-group">
              <div className="chart-bar-value">{d.soDon}</div>
              <div className="chart-bar-wrapper">
                <div
                  className="chart-bar"
                  style={{ height: `${(d.soDon / maxDon) * 100}%` }}
                />
              </div>
              <div className="chart-bar-label">{d.ngay}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Biểu đồ Doanh thu theo ngày */}
      <Card bordered={false} className="glass-effect" style={{ borderRadius: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Title level={5} style={{ margin: 0 }}><DollarOutlined style={{ color: '#52c41a' }} /> Doanh thu theo ngày</Title>
          <Select
            value={selectedMonth}
            onChange={v => setSelectedMonth(v)}
            options={monthOptions}
            style={{ width: 160 }}
            size="small"
          />
        </div>
        <div className="chart-container">
          {dailyStats.map((d, i) => (
            <div key={i} className="chart-bar-group">
              <div className="chart-bar-value" style={{ fontSize: 10 }}>{(d.doanhThu / 1000000).toFixed(0)}tr</div>
              <div className="chart-bar-wrapper">
                <div
                  className="chart-bar"
                  style={{
                    height: `${(d.doanhThu / maxDoanhThu) * 100}%`,
                    background: 'linear-gradient(180deg, #52c41a 0%, #95de64 100%)',
                  }}
                />
              </div>
              <div className="chart-bar-label">{d.ngay}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Biểu đồ Tổng mâm theo ngày */}
      <Card bordered={false} className="glass-effect" style={{ borderRadius: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Title level={5} style={{ margin: 0 }}><CalendarOutlined style={{ color: '#722ed1' }} /> Tổng mâm theo ngày</Title>
          <Select
            value={selectedMonth}
            onChange={v => setSelectedMonth(v)}
            options={monthOptions}
            style={{ width: 160 }}
            size="small"
          />
        </div>
        <div className="chart-container">
          {dailyStats.map((d, i) => (
            <div key={i} className="chart-bar-group">
              <div className="chart-bar-value">{d.tongMam}</div>
              <div className="chart-bar-wrapper">
                <div
                  className="chart-bar"
                  style={{
                    height: `${(d.tongMam / maxMam) * 100}%`,
                    background: 'linear-gradient(180deg, #722ed1 0%, #b37feb 100%)',
                  }}
                />
              </div>
              <div className="chart-bar-label">{d.ngay}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Bảng NCC: Nhà cung cấp | Có lỗi | Số lần giao */}
      <Card bordered={false} className="glass-effect" style={{ borderRadius: 16 }}>
        <Title level={5}><TeamOutlined /> Thống kê nhà cung cấp</Title>
        <Table columns={nccColumns} dataSource={nccStats} pagination={false} size="small" rowClassName="order-row" />
      </Card>
    </div>
  )
}
