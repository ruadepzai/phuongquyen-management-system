import { useState, useMemo } from 'react'
import {
  Table, Tag, Button, Input, Space, Card, Row, Col, Collapse,
  Statistic, Modal, Descriptions, Badge, Select, DatePicker, TimePicker,
  Tooltip, Typography, Divider, message, Form, InputNumber, Popconfirm, Checkbox
} from 'antd'
import {
  SearchOutlined, EyeOutlined, PrinterOutlined,
  ShoppingCartOutlined, CheckCircleOutlined,
  ClockCircleOutlined, SyncOutlined,
  FilterOutlined, ReloadOutlined, CalendarOutlined,
  CaretRightOutlined, PlusOutlined, DollarOutlined,
  InboxOutlined, CarOutlined, TrophyOutlined,
  EditOutlined, DeleteOutlined, UnorderedListOutlined
} from '@ant-design/icons'

const { RangePicker } = DatePicker
const { Text } = Typography

// ==================== MOCK DATA ====================
const mockOrders = [
  {
    key: '1', maDH: 'HD1-010526', khachHang: 'Nguyễn Văn An', sdt: '0901234567',
    diaChiGiao: '45 Lê Lợi, Quận 1, TP.HCM', ngayDat: '2026-05-01', ngayGiao: '2026-05-05',
    thoiGianToChuc: '10:00', loai: 'Cỗ cưới', soMam: 15, tongTien: 22500000,
    tienCoc: 3375000, trangThai: 'HoanThanh', daCoc: true, ghiChu: 'Giao trước 10h sáng',
    chiTiet: [
      { mon: 'Gà luộc lá chanh', soLuong: 15, donGia: 350000, thanhTien: 5250000 },
      { mon: 'Nem rán', soLuong: 15, donGia: 200000, thanhTien: 3000000 },
      { mon: 'Xôi gấc', soLuong: 15, donGia: 150000, thanhTien: 2250000 },
      { mon: 'Canh măng', soLuong: 15, donGia: 180000, thanhTien: 2700000 },
      { mon: 'Giò thủ', soLuong: 15, donGia: 250000, thanhTien: 3750000 },
      { mon: 'Chè sen', soLuong: 15, donGia: 120000, thanhTien: 1800000 },
      { mon: 'Hoa quả dĩa', soLuong: 15, donGia: 100000, thanhTien: 1500000 },
      { mon: 'Nước ngọt', soLuong: 15, donGia: 150000, thanhTien: 2250000 },
    ],
  },
  {
    key: '2', maDH: 'HD2-020526', khachHang: 'Trần Thị Bích', sdt: '0912345678',
    diaChiGiao: '12 Hoàng Diệu, Quận 4, TP.HCM', ngayDat: '2026-05-02', ngayGiao: '2026-05-05',
    thoiGianToChuc: '11:30', loai: 'Cỗ giỗ', soMam: 8, tongTien: 9600000,
    tienCoc: 1440000, trangThai: 'DangGiao', daCoc: true, ghiChu: '',
    chiTiet: [
      { mon: 'Gà luộc lá chanh', soLuong: 8, donGia: 350000, thanhTien: 2800000 },
      { mon: 'Xôi gấc', soLuong: 8, donGia: 150000, thanhTien: 1200000 },
      { mon: 'Canh bóng', soLuong: 8, donGia: 200000, thanhTien: 1600000 },
      { mon: 'Giò lụa', soLuong: 8, donGia: 250000, thanhTien: 2000000 },
      { mon: 'Chè kho', soLuong: 8, donGia: 250000, thanhTien: 2000000 },
    ],
  },
  {
    key: '3', maDH: 'HD3-030526', khachHang: 'Lê Hoàng Nam', sdt: '0987654321',
    diaChiGiao: '78 Nguyễn Trãi, Quận 5, TP.HCM', ngayDat: '2026-05-03', ngayGiao: '2026-05-07',
    thoiGianToChuc: '17:00', loai: 'Tiệc sinh nhật', soMam: 5, tongTien: 7500000,
    tienCoc: 1125000, trangThai: 'ChoDongGoi', daCoc: true, ghiChu: 'Cần thêm bánh kem 3 tầng',
    chiTiet: [
      { mon: 'Bò nướng lá lốt', soLuong: 5, donGia: 400000, thanhTien: 2000000 },
      { mon: 'Gỏi cuốn', soLuong: 5, donGia: 200000, thanhTien: 1000000 },
      { mon: 'Cơm chiên', soLuong: 5, donGia: 180000, thanhTien: 900000 },
      { mon: 'Canh chua cá', soLuong: 5, donGia: 220000, thanhTien: 1100000 },
      { mon: 'Chè thái', soLuong: 5, donGia: 150000, thanhTien: 750000 },
      { mon: 'Bánh kem', soLuong: 1, donGia: 1750000, thanhTien: 1750000 },
    ],
  },
  {
    key: '4', maDH: 'HD4-040526', khachHang: 'Phạm Minh Tuấn', sdt: '0976543210',
    diaChiGiao: '156 CMT8, Quận 3, TP.HCM', ngayDat: '2026-05-04', ngayGiao: '2026-05-07',
    thoiGianToChuc: '11:00', loai: 'Cỗ cưới', soMam: 20, tongTien: 36000000,
    tienCoc: 5400000, trangThai: 'DaThanhToanCoc', daCoc: true, ghiChu: 'Menu VIP, không dùng tôm',
    chiTiet: [
      { mon: 'Gà hấp hành', soLuong: 20, donGia: 380000, thanhTien: 7600000 },
      { mon: 'Nem cuốn', soLuong: 20, donGia: 220000, thanhTien: 4400000 },
      { mon: 'Bò xào lúc lắc', soLuong: 20, donGia: 450000, thanhTien: 9000000 },
      { mon: 'Xôi gấc', soLuong: 20, donGia: 150000, thanhTien: 3000000 },
      { mon: 'Chè hạt sen', soLuong: 20, donGia: 200000, thanhTien: 4000000 },
      { mon: 'Hoa quả dĩa', soLuong: 20, donGia: 100000, thanhTien: 2000000 },
      { mon: 'Nước uống', soLuong: 20, donGia: 300000, thanhTien: 6000000 },
    ],
  },
  {
    key: '5', maDH: 'HD5-050526', khachHang: 'Võ Thị Hương', sdt: '0933111222',
    diaChiGiao: '23 Hai Bà Trưng, Quận 1, TP.HCM', ngayDat: '2026-05-05', ngayGiao: '2026-05-07',
    thoiGianToChuc: '08:00', loai: 'Cỗ giỗ', soMam: 10, tongTien: 12000000,
    tienCoc: 1800000, trangThai: 'DaGiao', daCoc: true, ghiChu: '',
    chiTiet: [
      { mon: 'Gà luộc', soLuong: 10, donGia: 350000, thanhTien: 3500000 },
      { mon: 'Xôi gấc', soLuong: 10, donGia: 150000, thanhTien: 1500000 },
      { mon: 'Giò chả', soLuong: 10, donGia: 250000, thanhTien: 2500000 },
      { mon: 'Canh măng', soLuong: 10, donGia: 180000, thanhTien: 1800000 },
      { mon: 'Nem rán', soLuong: 10, donGia: 200000, thanhTien: 2000000 },
      { mon: 'Chè kho', soLuong: 10, donGia: 70000, thanhTien: 700000 },
    ],
  },
  {
    key: '6', maDH: 'HD6-060526', khachHang: 'Đặng Quốc Việt', sdt: '0909888777',
    diaChiGiao: '90 Điện Biên Phủ, Bình Thạnh, TP.HCM', ngayDat: '2026-05-06', ngayGiao: '2026-05-09',
    thoiGianToChuc: '12:00', loai: 'Tiệc liên hoan', soMam: 12, tongTien: 18000000,
    tienCoc: 2700000, trangThai: 'ChuaThanhToanCoc', daCoc: false, ghiChu: 'Giao tầng 5, có thang máy',
    chiTiet: [
      { mon: 'Bò sốt tiêu đen', soLuong: 12, donGia: 400000, thanhTien: 4800000 },
      { mon: 'Cá chiên giòn', soLuong: 12, donGia: 300000, thanhTien: 3600000 },
      { mon: 'Gỏi ngó sen', soLuong: 12, donGia: 200000, thanhTien: 2400000 },
      { mon: 'Xôi vò', soLuong: 12, donGia: 150000, thanhTien: 1800000 },
      { mon: 'Canh cua', soLuong: 12, donGia: 200000, thanhTien: 2400000 },
      { mon: 'Chè thập cẩm', soLuong: 12, donGia: 250000, thanhTien: 3000000 },
    ],
  },
]

// Mapping trạng thái
const statusConfig = {
  ChuaThanhToanCoc: { text: 'Chưa TT cọc', color: 'volcano', icon: <ClockCircleOutlined /> },
  DaThanhToanCoc: { text: 'Đã TT cọc', color: 'cyan', icon: <DollarOutlined /> },
  ChoXuLy: { text: 'Chờ xử lý', color: 'gold', icon: <ClockCircleOutlined /> },
  ChoDongGoi: { text: 'Chờ đóng gói', color: 'blue', icon: <InboxOutlined /> },
  DangDongGoi: { text: 'Đang đóng gói', color: 'processing', icon: <SyncOutlined spin /> },
  DaDongGoi: { text: 'Đã đóng gói', color: 'lime', icon: <CheckCircleOutlined /> },
  DangGiao: { text: 'Đang giao', color: 'geekblue', icon: <CarOutlined /> },
  DaGiao: { text: 'Đã giao', color: 'success', icon: <CheckCircleOutlined /> },
  HoanThanh: { text: 'Hoàn thành', color: 'success', icon: <TrophyOutlined /> },
}

function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

// ==================== COMPONENT ====================
export default function DonHang() {
  // Đọc role từ localStorage
  const userRole = (() => { try { return JSON.parse(localStorage.getItem('user'))?.role } catch { return 'NhanVien' } })()
  const isAdmin = userRole === 'QuanLy'

  const [searchText, setSearchText] = useState('')
  const [filterStatus, setFilterStatus] = useState(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orders, setOrders] = useState(mockOrders)
  const [createVisible, setCreateVisible] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewData, setPreviewData] = useState(null)
  const [editVisible, setEditVisible] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [tongHopVisible, setTongHopVisible] = useState(false)
  const [tongHopData, setTongHopData] = useState([])
  const [tongHopDate, setTongHopDate] = useState('')
  const [createForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const menuOptions = [
    { value: 'Gà luộc lá chanh', don: 350000 },
    { value: 'Nem rán', don: 200000 },
    { value: 'Xôi gấc', don: 150000 },
    { value: 'Canh măng', don: 180000 },
    { value: 'Giò thủ', don: 250000 },
    { value: 'Chè sen', don: 120000 },
    { value: 'Tôm hấp bia', don: 400000 },
    { value: 'Thịt lợn quay', don: 300000 },
    { value: 'Cá chép om dưa', don: 280000 },
    { value: 'Bò nướng lá lốt', don: 400000 },
    { value: 'Bò sốt tiêu đen', don: 400000 },
    { value: 'Bánh kem', don: 1750000 },
  ]

  // ===== TẠO ĐƠN - bước 1: validate -> preview =====
  const handleCreateStep1 = () => {
    createForm.validateFields().then(vals => {
      const monChon = vals.thucDon || []
      const soMam = vals.soMam || 1
      const chiTiet = monChon.map(ten => {
        const m = menuOptions.find(x => x.value === ten)
        return { mon: ten, soLuong: soMam, donGia: m?.don || 0, thanhTien: (m?.don || 0) * soMam }
      })
      const tongTien = chiTiet.reduce((s, c) => s + c.thanhTien, 0)
      const tienCoc = Math.round(tongTien * 0.15)
      const newOrder = {
        key: String(orders.length + 1),
        maDH: `HD${orders.length + 1}-${new Date().toLocaleDateString('vi', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '')}`,
        khachHang: vals.khachHang,
        sdt: vals.sdt,
        diaChiGiao: vals.diaChiGiao,
        ngayDat: new Date().toISOString().split('T')[0],
        ngayGiao: vals.ngayGiao?.format('YYYY-MM-DD') || '',
        thoiGianToChuc: vals.thoiGianToChuc?.format('HH:mm') || '',
        loai: vals.loai || 'Cỗ khác',
        soMam,
        tongTien,
        tienCoc,
        daCoc: false,
        trangThai: 'ChuaThanhToanCoc',
        ghiChu: vals.ghiChu || '',
        chiTiet,
      }
      setPreviewData(newOrder)
      setPreviewVisible(true)
    })
  }

  // ===== TẠO ĐƠN - bước 2: lưu sau preview =====
  const handleConfirmCreate = () => {
    setOrders(prev => [...prev, previewData])
    message.success('Đã thêm đơn hàng thành công!')
    createForm.resetFields()
    setCreateVisible(false)
    setPreviewVisible(false)
    setPreviewData(null)
  }

  // ===== SỬA ĐƠN =====
  const handleEdit = (record) => {
    setEditingOrder(record)
    editForm.setFieldsValue({
      khachHang: record.khachHang,
      sdt: record.sdt,
      diaChiGiao: record.diaChiGiao,
      loai: record.loai,
      soMam: record.soMam,
      ghiChu: record.ghiChu,
    })
    setEditVisible(true)
  }

  const handleSaveEdit = () => {
    editForm.validateFields().then(vals => {
      setOrders(prev => prev.map(o => o.key === editingOrder.key ? { ...o, ...vals } : o))
      message.success('Cập nhật đơn hàng thành công!')
      setEditVisible(false)
    })
  }

  // ===== XÓA ĐƠN =====
  const handleDelete = (key) => {
    setOrders(prev => prev.filter(o => o.key !== key))
    message.success('Đã xóa đơn hàng!')
  }

  // ===== TỔNG HỢP MÓN =====
  const handleTongHop = (date) => {
    const ordersInDate = orders.filter(o => o.ngayGiao === date)
    const monMap = {}
    ordersInDate.forEach(o => {
      o.chiTiet.forEach(ct => {
        if (!monMap[ct.mon]) monMap[ct.mon] = { mon: ct.mon, tongSL: 0, donHang: [] }
        monMap[ct.mon].tongSL += ct.soLuong
        monMap[ct.mon].donHang.push(o.maDH)
      })
    })
    setTongHopData(Object.values(monMap).map((m, i) => ({ ...m, key: i })))
    setTongHopDate(date)
    setTongHopVisible(true)
  }

  // Lọc
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.maDH.toLowerCase().includes(searchText.toLowerCase()) ||
      order.khachHang.toLowerCase().includes(searchText.toLowerCase()) ||
      order.sdt.includes(searchText)
    const matchStatus = filterStatus ? order.trangThai === filterStatus : true
    return matchSearch && matchStatus
  })

  const showDetail = (record) => { setSelectedOrder(record); setDetailVisible(true) }

  const totalOrders = orders.length
  const pending = orders.filter(o => ['ChoXuLy', 'ChuaThanhToanCoc', 'DaThanhToanCoc'].includes(o.trangThai)).length
  const packing = orders.filter(o => ['DangDongGoi', 'ChoDongGoi'].includes(o.trangThai)).length
  const delivered = orders.filter(o => ['DaGiao', 'HoanThanh'].includes(o.trangThai)).length

  const columns = [
    { title: 'Mã đơn', dataIndex: 'maDH', width: 140, render: t => <Text strong style={{ color: 'var(--primary)' }}>{t}</Text> },
    {
      title: 'Khách hàng', dataIndex: 'khachHang',
      render: (t, r) => <div><Text strong>{t}</Text><br /><Text type="secondary" style={{ fontSize: 13 }}>{r.sdt}</Text></div>,
    },
    { title: 'Loại tiệc', dataIndex: 'loai', width: 130, render: t => <Tag style={{ borderRadius: 12 }}>{t}</Tag> },
    { title: 'Số mâm', dataIndex: 'soMam', width: 90, align: 'center', sorter: (a, b) => a.soMam - b.soMam },
    { title: 'Ngày giao', dataIndex: 'ngayGiao', width: 120, sorter: (a, b) => new Date(a.ngayGiao) - new Date(b.ngayGiao) },
    { title: 'Tổng tiền', dataIndex: 'tongTien', width: 150, align: 'right', render: v => <Text strong>{formatVND(v)}</Text>, sorter: (a, b) => a.tongTien - b.tongTien },
    {
      title: 'Trạng thái', dataIndex: 'trangThai', width: 160,
      render: s => { const c = statusConfig[s]; return <Tag icon={c?.icon} color={c?.color} style={{ borderRadius: 12 }}>{c?.text}</Tag> },
    },
    {
      title: 'Thao tác', key: 'action', width: 140, align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem"><Button type="text" icon={<EyeOutlined />} onClick={(e) => { e.stopPropagation(); showDetail(record) }} /></Tooltip>
          {isAdmin && <Tooltip title="Sửa"><Button type="text" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); handleEdit(record) }} /></Tooltip>}
          {isAdmin && <Popconfirm title="Xóa đơn hàng này?" onConfirm={() => handleDelete(record.key)} okText="Xóa" cancelText="Hủy">
            <Tooltip title="Xóa"><Button type="text" danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} /></Tooltip>
          </Popconfirm>}
        </Space>
      ),
    },
  ]

  const detailColumns = [
    { title: 'Tên món', dataIndex: 'mon' },
    { title: 'SL', dataIndex: 'soLuong', width: 60, align: 'center' },
    { title: 'Đơn giá', dataIndex: 'donGia', width: 130, align: 'right', render: v => formatVND(v) },
    { title: 'Thành tiền', dataIndex: 'thanhTien', width: 140, align: 'right', render: v => <Text strong>{formatVND(v)}</Text> },
  ]

  // Helper: compute đã thu / phải thu
  const getDaThu = (order) => order.daCoc ? (order.tienCoc || 0) : 0
  const getPhaiThu = (order) => order.tongTien - getDaThu(order)

  return (
    <div>
      <h2 className="dashboard-title">Quản lý Đơn hàng</h2>

      {/* Stats */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="glass-effect stat-card" style={{ borderRadius: 16 }}>
            <Statistic title="Tổng đơn" value={totalOrders} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="glass-effect stat-card" style={{ borderRadius: 16 }}>
            <Statistic title="Chờ xử lý" value={pending} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="glass-effect stat-card" style={{ borderRadius: 16 }}>
            <Statistic title="Đang đóng gói" value={packing} prefix={<SyncOutlined />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} className="glass-effect stat-card" style={{ borderRadius: 16 }}>
            <Statistic title="Đã giao" value={delivered} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
      </Row>

      {/* Filter bar */}
      <Card bordered={false} className="glass-effect" style={{ borderRadius: 16, marginBottom: 20 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={6}>
            <Input placeholder="Tìm mã đơn, KH, SĐT..." prefix={<SearchOutlined style={{ color: '#aaa' }} />}
              value={searchText} onChange={e => setSearchText(e.target.value)} allowClear style={{ borderRadius: 10 }} />
          </Col>
          <Col xs={12} sm={4}>
            <Select placeholder="Trạng thái" value={filterStatus} onChange={v => setFilterStatus(v)} allowClear
              style={{ width: '100%', borderRadius: 10 }}
              options={Object.entries(statusConfig).map(([value, cfg]) => ({ value, label: cfg.text }))} />
          </Col>
          <Col xs={12} sm={6}>
            <RangePicker style={{ width: '100%', borderRadius: 10 }} placeholder={['Từ ngày', 'Đến ngày']} />
          </Col>
          <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => { setSearchText(''); setFilterStatus(null) }} style={{ borderRadius: 10 }}>Làm mới</Button>
              {isAdmin && <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateVisible(true)} style={{ borderRadius: 10 }}>Tạo đơn mới</Button>}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Orders grouped by date */}
      <Card bordered={false} className="glass-effect" style={{ borderRadius: 16 }}>
        {(() => {
          const grouped = {}
          filteredOrders.forEach(o => { if (!grouped[o.ngayGiao]) grouped[o.ngayGiao] = []; grouped[o.ngayGiao].push(o) })
          const sortedDates = Object.keys(grouped).sort()

          if (sortedDates.length === 0) return <div style={{ textAlign: 'center', padding: 40 }}><Text type="secondary">Không tìm thấy đơn hàng</Text></div>

          return (
            <Collapse defaultActiveKey={sortedDates}
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              style={{ background: 'transparent', border: 'none' }}
              items={sortedDates.map(date => {
                const dateOrders = grouped[date]
                const tongMam = dateOrders.reduce((s, o) => s + o.soMam, 0)
                const tongTien = dateOrders.reduce((s, o) => s + o.tongTien, 0)
                return {
                  key: date,
                  label: (
                    <Space size={16}>
                      <Text strong style={{ fontSize: 15, color: '#5b8def' }}><CalendarOutlined style={{ marginRight: 6 }} />{date}</Text>
                      <Tag color="blue">{dateOrders.length} đơn</Tag>
                      <Tag color="green">{tongMam} mâm</Tag>
                      <Tag color="orange">{formatVND(tongTien)}</Tag>
                    </Space>
                  ),
                  children: (
                    <div>
                      <Table columns={columns} dataSource={dateOrders} pagination={false} scroll={{ x: 900 }}
                        rowClassName="order-row" size="middle"
                        onRow={record => ({ onClick: () => showDetail(record), style: { cursor: 'pointer' } })} />
                      <div style={{ textAlign: 'right', marginTop: 10 }}>
                        <Button icon={<UnorderedListOutlined />} onClick={() => handleTongHop(date)}
                          style={{ borderRadius: 10 }}>Tổng hợp món ăn</Button>
                      </div>
                    </div>
                  ),
                }
              })}
            />
          )
        })()}
      </Card>

      {/* ===== Modal chi tiết ===== */}
      <Modal
        title={selectedOrder && (
          <Space>
            <Text strong style={{ fontSize: 18 }}>Chi tiết đơn {selectedOrder.maDH}</Text>
            <Tag icon={statusConfig[selectedOrder.trangThai]?.icon} color={statusConfig[selectedOrder.trangThai]?.color} style={{ borderRadius: 12 }}>
              {statusConfig[selectedOrder.trangThai]?.text}
            </Tag>
          </Space>
        )}
        open={detailVisible} onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={() => message.info('Chức năng in đang phát triển')}>In phiếu</Button>,
          isAdmin && <Button key="invoice" type="default" style={{ borderColor: '#52c41a', color: '#52c41a', borderRadius: 10 }}
            onClick={() => {
              const invoiceData = {
                maDH: selectedOrder.maDH,
                khachHang: selectedOrder.khachHang,
                tongTien: selectedOrder.tongTien,
                chiTiet: selectedOrder.chiTiet,
              }
              localStorage.setItem('pendingInvoice', JSON.stringify(invoiceData))
              message.success('Đã tạo hóa đơn! Chuyển sang tab Hóa đơn để xem.')
              setDetailVisible(false)
            }}>Tạo hóa đơn</Button>,
          <Button key="close" type="primary" onClick={() => setDetailVisible(false)}>Đóng</Button>,
        ].filter(Boolean)}
        width={720}
      >
        {selectedOrder && (
          <>
            <Descriptions bordered size="small" column={2} style={{ marginBottom: 20 }}
              labelStyle={{ fontWeight: 600, background: 'rgba(91,141,239,0.05)' }}>
              <Descriptions.Item label="Khách hàng">{selectedOrder.khachHang}</Descriptions.Item>
              <Descriptions.Item label="SĐT">{selectedOrder.sdt}</Descriptions.Item>
              <Descriptions.Item label="Loại tiệc">{selectedOrder.loai}</Descriptions.Item>
              <Descriptions.Item label="Số mâm">{selectedOrder.soMam}</Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">{selectedOrder.ngayDat}</Descriptions.Item>
              <Descriptions.Item label="Ngày giao">{selectedOrder.ngayGiao}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao" span={2}>{selectedOrder.diaChiGiao || '—'}</Descriptions.Item>
              <Descriptions.Item label="Thời gian tổ chức">{selectedOrder.thoiGianToChuc || '—'}</Descriptions.Item>
              <Descriptions.Item label="Tiền cọc (15%)">
                <Text strong style={{ color: '#52c41a' }}>{formatVND(selectedOrder.tienCoc || Math.round(selectedOrder.tongTien * 0.15))}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái cọc" span={2}>
                {(!selectedOrder.daCoc && selectedOrder.trangThai === 'ChuaThanhToanCoc') ? (
                  <Button size="small" type="primary" style={{ borderRadius: 8 }}
                    onClick={() => {
                      setOrders(prev => prev.map(o => o.key === selectedOrder.key ? { ...o, trangThai: 'DaThanhToanCoc', daCoc: true } : o))
                      setSelectedOrder(prev => ({ ...prev, trangThai: 'DaThanhToanCoc', daCoc: true }))
                      message.success('Đã cập nhật trạng thái thanh toán cọc!')
                    }}>✅ Xác nhận đã cọc</Button>
                ) : (
                  <Tag color="cyan">Đã thanh toán cọc</Tag>
                )}
              </Descriptions.Item>
              {selectedOrder.ghiChu && (
                <Descriptions.Item label="Ghi chú" span={2}><Text type="warning">{selectedOrder.ghiChu}</Text></Descriptions.Item>
              )}
            </Descriptions>

            <Divider orientation="left" style={{ fontSize: 15 }}>Danh sách món</Divider>

            <Table columns={detailColumns} dataSource={selectedOrder.chiTiet.map((item, i) => ({ ...item, key: i }))}
              pagination={false} size="small"
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} align="right"><Text strong style={{ fontSize: 15 }}>TỔNG CỘNG:</Text></Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right"><Text strong style={{ fontSize: 15, color: 'var(--primary)' }}>{formatVND(selectedOrder.tongTien)}</Text></Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} align="right"><Text style={{ color: '#52c41a' }}>Đã thu:</Text></Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right"><Text strong style={{ color: '#52c41a' }}>{formatVND(getDaThu(selectedOrder))}</Text></Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} align="right"><Text style={{ color: '#ff4d4f' }}>Phải thu:</Text></Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right"><Text strong style={{ color: '#ff4d4f' }}>{formatVND(getPhaiThu(selectedOrder))}</Text></Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </>
        )}
      </Modal>

      {/* ===== Modal tạo đơn ===== */}
      <Modal title="Tạo đơn hàng mới" open={createVisible} width={640}
        onOk={handleCreateStep1} onCancel={() => { setCreateVisible(false); createForm.resetFields() }}
        okText="Xác nhận đơn" cancelText="Hủy">
        <Form form={createForm} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="khachHang" label="Tên khách hàng" rules={[{ required: true, message: 'Nhập tên KH' }]}>
                <Input placeholder="VD: Nguyễn Văn A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sdt" label="SĐT" rules={[
                { required: true, message: 'Nhập SĐT' },
                { pattern: /^[0-9]+$/, message: 'SĐT chỉ được chứa số' },
              ]}>
                <Input placeholder="0901234567" maxLength={11} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="diaChiGiao" label="Địa chỉ giao" rules={[{ required: true, message: 'Nhập địa chỉ' }]}>
            <Input placeholder="45 Lê Lợi, Q.1" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="loai" label="Loại tiệc" rules={[{ required: true }]}>
                <Select placeholder="Chọn" options={[
                  { value: 'Cỗ cưới' }, { value: 'Cỗ giỗ' }, { value: 'Tiệc sinh nhật' },
                  { value: 'Liên hoan' }, { value: 'Cỗ khác' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="soMam" label="Số mâm" rules={[{ required: true }]}>
                <InputNumber min={1} max={200} style={{ width: '100%' }} placeholder="10" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="ngayGiao" label="Ngày giao" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="thoiGianToChuc" label="Giờ tổ chức" rules={[{ required: true, message: 'Chọn giờ' }]}>
                <TimePicker style={{ width: '100%' }} format="HH:mm" placeholder="HH:mm" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="thucDon" label="Thực đơn" rules={[{ required: true, message: 'Chọn ít nhất 1 món' }]}>
            <Select mode="multiple" placeholder="Chọn món"
              options={menuOptions.map(m => ({ value: m.value, label: `${m.value} (${formatVND(m.don)}/mâm)` }))} />
          </Form.Item>
          <Form.Item name="ghiChu" label="Ghi chú">
            <Input.TextArea rows={2} placeholder="Ghi chú thêm..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* ===== Modal preview trước khi lưu ===== */}
      <Modal title="Xác nhận thông tin đơn hàng" open={previewVisible} width={680}
        onOk={handleConfirmCreate} onCancel={() => setPreviewVisible(false)}
        okText="Lưu đơn hàng" cancelText="Quay lại sửa">
        {previewData && (
          <>
            <Descriptions bordered size="small" column={2} style={{ marginBottom: 16 }}
              labelStyle={{ fontWeight: 600, background: 'rgba(91,141,239,0.05)' }}>
              <Descriptions.Item label="Khách hàng">{previewData.khachHang}</Descriptions.Item>
              <Descriptions.Item label="SĐT">{previewData.sdt}</Descriptions.Item>
              <Descriptions.Item label="Loại tiệc">{previewData.loai}</Descriptions.Item>
              <Descriptions.Item label="Số mâm">{previewData.soMam}</Descriptions.Item>
              <Descriptions.Item label="Ngày giao">{previewData.ngayGiao}</Descriptions.Item>
              <Descriptions.Item label="Giờ tổ chức">{previewData.thoiGianToChuc}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao" span={2}>{previewData.diaChiGiao}</Descriptions.Item>
              <Descriptions.Item label="Tiền cọc (15%)" span={2}>
                <Text strong style={{ color: '#52c41a' }}>{formatVND(previewData.tienCoc)}</Text>
              </Descriptions.Item>
            </Descriptions>
            <Table columns={detailColumns} dataSource={previewData.chiTiet.map((c, i) => ({ ...c, key: i }))}
              pagination={false} size="small"
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} align="right"><Text strong>TỔNG CỘNG:</Text></Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right"><Text strong style={{ color: 'var(--primary)' }}>{formatVND(previewData.tongTien)}</Text></Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )} />
          </>
        )}
      </Modal>

      {/* ===== Modal sửa đơn ===== */}
      <Modal title="Sửa đơn hàng" open={editVisible} width={500}
        onOk={handleSaveEdit} onCancel={() => setEditVisible(false)} okText="Lưu" cancelText="Hủy">
        <Form form={editForm} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item name="khachHang" label="Tên KH" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sdt" label="SĐT" rules={[{ required: true }, { pattern: /^[0-9]+$/, message: 'Chỉ nhập số' }]}>
            <Input maxLength={11} />
          </Form.Item>
          <Form.Item name="diaChiGiao" label="Địa chỉ giao" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="loai" label="Loại tiệc"><Select options={[
                { value: 'Cỗ cưới' }, { value: 'Cỗ giỗ' }, { value: 'Tiệc sinh nhật' }, { value: 'Liên hoan' }, { value: 'Cỗ khác' },
              ]} /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="soMam" label="Số mâm"><InputNumber min={1} max={200} style={{ width: '100%' }} /></Form.Item>
            </Col>
          </Row>
          <Form.Item name="ghiChu" label="Ghi chú"><Input.TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>

      {/* ===== Modal tổng hợp món ===== */}
      <Modal title={`Tổng hợp món ăn — ${tongHopDate}`} open={tongHopVisible}
        onCancel={() => setTongHopVisible(false)} footer={null} width={600}>
        <Table dataSource={tongHopData} pagination={false} size="small" columns={[
          { title: 'Tên món', dataIndex: 'mon', render: v => <Text strong>{v}</Text> },
          { title: 'Tổng SL', dataIndex: 'tongSL', width: 80, align: 'center', render: v => <Tag color="blue" style={{ fontWeight: 700 }}>{v}</Tag> },
          { title: 'Từ đơn', dataIndex: 'donHang', render: v => v.map(d => <Tag key={d} style={{ borderRadius: 8 }}>{d}</Tag>) },
        ]} />
      </Modal>
    </div>
  )
}
