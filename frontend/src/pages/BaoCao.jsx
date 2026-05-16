import { Card, Row, Col, Statistic, Table, Tag, Typography, Divider, Space } from 'antd'
import {
  ShoppingCartOutlined, CheckCircleOutlined, WarningOutlined,
  InboxOutlined, DollarOutlined, TeamOutlined,
  RiseOutlined, ClockCircleOutlined
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
  soMonThieu: 5,
  soNVHoatDong: 6,
}

// Đơn hàng gần đây
const recentOrders = [
  { key: '1', maDH: 'HD6-060526', khachHang: 'Đặng Quốc Việt', loai: 'Liên hoan', tongTien: 18000000, trangThai: 'DangDongGoi' },
  { key: '2', maDH: 'HD5-050526', khachHang: 'Võ Thị Hương', loai: 'Cỗ giỗ', tongTien: 12000000, trangThai: 'DaGiao' },
  { key: '3', maDH: 'HD4-040526', khachHang: 'Phạm Minh Tuấn', loai: 'Cỗ cưới', tongTien: 36000000, trangThai: 'ChoXuLy' },
  { key: '4', maDH: 'HD3-030526', khachHang: 'Lê Hoàng Nam', loai: 'Sinh nhật', tongTien: 7500000, trangThai: 'DangDongGoi' },
  { key: '5', maDH: 'HD2-020526', khachHang: 'Trần Thị Bích', loai: 'Cỗ giỗ', tongTien: 9600000, trangThai: 'DaGiao' },
]

// Lịch sử báo thiếu món
const missingItemsLog = [
  { key: '1', ngay: '09/05/2026', maDH: 'HD6-060526', mon: 'Cá chiên giòn', slYeuCau: 12, slThucTe: 10, thieu: 2, lyDo: 'Bếp chưa chiên kịp', nguoiBao: 'Trần Thị Mai' },
  { key: '2', ngay: '06/05/2026', maDH: 'HD3-030526', mon: 'Bánh kem', slYeuCau: 1, slThucTe: 0, thieu: 1, lyDo: 'Tiệm bánh giao trễ', nguoiBao: 'Lê Hoàng Phúc' },
  { key: '3', ngay: '03/05/2026', maDH: 'HD1-010526', mon: 'Chè sen', slYeuCau: 15, slThucTe: 12, thieu: 3, lyDo: 'Hết hạt sen', nguoiBao: 'Trần Thị Mai' },
  { key: '4', ngay: '01/05/2026', maDH: 'HD1-010526', mon: 'Giò thủ', slYeuCau: 15, slThucTe: 14, thieu: 1, lyDo: 'Hết nguyên liệu', nguoiBao: 'Lê Hoàng Phúc' },
]

// Thống kê theo ngày (7 ngày gần nhất) - dùng CSS bar chart
const dailyStats = [
  { ngay: '03/05', soDon: 3, doanhThu: 44100000 },
  { ngay: '04/05', soDon: 1, doanhThu: 36000000 },
  { ngay: '05/05', soDon: 2, doanhThu: 19500000 },
  { ngay: '06/05', soDon: 2, doanhThu: 25500000 },
  { ngay: '07/05', soDon: 4, doanhThu: 52000000 },
  { ngay: '08/05', soDon: 3, doanhThu: 38000000 },
  { ngay: '09/05', soDon: 2, doanhThu: 30000000 },
]

const statusConfig = {
  ChoXuLy:     { text: 'Chờ xử lý',     color: 'gold' },
  DangDongGoi: { text: 'Đang đóng gói', color: 'processing' },
  DaGiao:      { text: 'Đã giao',       color: 'success' },
}

// ==================== COMPONENT ====================
export default function BaoCao() {
  const maxDon = Math.max(...dailyStats.map(d => d.soDon))

  // Cột bảng đơn gần đây
  const orderColumns = [
    {
      title: 'Mã đơn', dataIndex: 'maDH', key: 'maDH', width: 130,
      render: (text) => <Text strong style={{ color: 'var(--primary)' }}>{text}</Text>,
    },
    { title: 'Khách hàng', dataIndex: 'khachHang', key: 'khachHang' },
    {
      title: 'Loại', dataIndex: 'loai', key: 'loai', width: 120,
      render: (text) => <Tag style={{ borderRadius: 12 }}>{text}</Tag>,
    },
    {
      title: 'Tổng tiền', dataIndex: 'tongTien', key: 'tongTien', width: 150, align: 'right',
      render: (v) => <Text strong>{formatVND(v)}</Text>,
    },
    {
      title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai', width: 150,
      render: (s) => <Tag color={statusConfig[s].color} style={{ borderRadius: 12 }}>{statusConfig[s].text}</Tag>,
    },
  ]

  // Cột bảng thiếu món
  const missingColumns = [
    { title: 'Ngày', dataIndex: 'ngay', key: 'ngay', width: 100 },
    {
      title: 'Mã đơn', dataIndex: 'maDH', key: 'maDH', width: 130,
      render: (text) => <Text strong style={{ color: 'var(--primary)' }}>{text}</Text>,
    },
    { title: 'Món', dataIndex: 'mon', key: 'mon' },
    {
      title: 'Thiếu', dataIndex: 'thieu', key: 'thieu', width: 70, align: 'center',
      render: (v) => <Tag color="error" style={{ borderRadius: 8 }}>{v}</Tag>,
    },
    { title: 'Lý do', dataIndex: 'lyDo', key: 'lyDo' },
    { title: 'Người báo', dataIndex: 'nguoiBao', key: 'nguoiBao', width: 140 },
  ]

  return (
    <div>
      <h2 className="dashboard-title">Báo cáo & Thống kê</h2>

      {/* Thống kê tổng quan */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} lg={4}>
          <Card bordered={false} className="glass-effect stat-card" style={{ borderRadius: 16 }}>
            <Statistic title="Tổng đơn" value={summaryStats.tongDon} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card bordered={false} className="glass-effect stat-card" style={{ borderRadius: 16 }}>
            <Statistic title="Hoàn thành" value={summaryStats.donHoanThanh} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card bordered={false} className="glass-effect stat-card" style={{ borderRadius: 16 }}>
            <Statistic title="Đang xử lý" value={summaryStats.donDangXuLy} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card bordered={false} className="glass-effect stat-card" style={{ borderRadius: 16 }}>
            <Statistic title="Doanh thu" value={summaryStats.doanhThu} prefix={<DollarOutlined />} suffix="₫" valueStyle={{ color: 'var(--primary)' }}
              formatter={(val) => new Intl.NumberFormat('vi-VN').format(val / 1000000) + 'tr'} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card bordered={false} className="glass-effect stat-card" style={{ borderRadius: 16 }}>
            <Statistic title="Thiếu món" value={summaryStats.soMonThieu} prefix={<WarningOutlined />} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card bordered={false} className="glass-effect stat-card" style={{ borderRadius: 16 }}>
            <Statistic title="NV hoạt động" value={summaryStats.soNVHoatDong} prefix={<TeamOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {/* Biểu đồ đơn hàng theo ngày */}
        <Col xs={24} lg={12}>
          <Card bordered={false} className="glass-effect" style={{ borderRadius: 16 }}>
            <Title level={5}><RiseOutlined /> Đơn hàng 7 ngày gần nhất</Title>
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
        </Col>

        {/* Tỷ lệ hoàn thành */}
        <Col xs={24} lg={12}>
          <Card bordered={false} className="glass-effect" style={{ borderRadius: 16 }}>
            <Title level={5}><InboxOutlined /> Hiệu suất đóng gói</Title>
            <div style={{ padding: '20px 0' }}>
              {/* Tỷ lệ hoàn thành */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Tỷ lệ giao thành công</Text>
                  <Text strong style={{ color: '#52c41a' }}>87.5%</Text>
                </div>
                <div style={{ width: '100%', height: 12, borderRadius: 6, background: '#f0f0f0', overflow: 'hidden' }}>
                  <div style={{ width: '87.5%', height: '100%', borderRadius: 6, background: 'linear-gradient(90deg, #52c41a, #73d13d)', transition: 'width 1s ease' }} />
                </div>
              </div>

              {/* Tỷ lệ đúng số lượng */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Đóng gói đúng SL</Text>
                  <Text strong style={{ color: 'var(--primary)' }}>95.8%</Text>
                </div>
                <div style={{ width: '100%', height: 12, borderRadius: 6, background: '#f0f0f0', overflow: 'hidden' }}>
                  <div style={{ width: '95.8%', height: '100%', borderRadius: 6, background: 'linear-gradient(90deg, var(--primary), #89aef2)', transition: 'width 1s ease' }} />
                </div>
              </div>

              {/* Tỷ lệ thiếu món */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Tỷ lệ thiếu món</Text>
                  <Text strong style={{ color: '#ff4d4f' }}>4.2%</Text>
                </div>
                <div style={{ width: '100%', height: 12, borderRadius: 6, background: '#f0f0f0', overflow: 'hidden' }}>
                  <div style={{ width: '4.2%', height: '100%', borderRadius: 6, background: 'linear-gradient(90deg, #ff4d4f, #ff7875)', transition: 'width 1s ease' }} />
                </div>
              </div>

              {/* Thời gian TB */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>TG đóng gói trung bình</Text>
                  <Text strong style={{ color: '#faad14' }}>~25 phút/đơn</Text>
                </div>
                <div style={{ width: '100%', height: 12, borderRadius: 6, background: '#f0f0f0', overflow: 'hidden' }}>
                  <div style={{ width: '42%', height: '100%', borderRadius: 6, background: 'linear-gradient(90deg, #faad14, #ffc53d)', transition: 'width 1s ease' }} />
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Đơn hàng gần đây */}
      <Card bordered={false} className="glass-effect" style={{ borderRadius: 16, marginBottom: 20 }}>
        <Title level={5}><ShoppingCartOutlined /> Đơn hàng gần đây</Title>
        <Table columns={orderColumns} dataSource={recentOrders} pagination={false} size="small" rowClassName="order-row" />
      </Card>

      {/* Lịch sử thiếu món */}
      <Card bordered={false} className="glass-effect" style={{ borderRadius: 16 }}>
        <Title level={5}><WarningOutlined style={{ color: '#ff4d4f' }} /> Lịch sử báo thiếu món</Title>
        <Table columns={missingColumns} dataSource={missingItemsLog} pagination={false} size="small" rowClassName="order-row" />
      </Card>
    </div>
  )
}
