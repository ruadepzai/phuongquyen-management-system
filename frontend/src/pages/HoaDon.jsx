import { useState, useEffect } from 'react'
import {
  Table, Card, Tag, Space, Typography, Row, Col, Statistic,
  Modal, Form, Input, InputNumber, Select, Button, Tooltip,
  message, Descriptions, DatePicker, Divider
} from 'antd'
import {
  FileTextOutlined, DollarOutlined, PrinterOutlined,
  EyeOutlined, PlusOutlined, SearchOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
  BankOutlined, CreditCardOutlined, WalletOutlined
} from '@ant-design/icons'

const { Text, Title } = Typography
const { RangePicker } = DatePicker

// Format VNĐ
function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

// ==================== MOCK DATA ====================
const mockHoaDon = [
  { key: '1', maHD: 'HĐ001', maDH: 'HD1-010526', khachHang: 'Nguyễn Văn An', ngayXuat: '2026-05-05', tongTien: 22500000, vat: 8, hinhThuc: 'ChuyenKhoan', trangThai: 'DaThanhToan',
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
  { key: '2', maHD: 'HĐ002', maDH: 'HD5-050526', khachHang: 'Võ Thị Hương', ngayXuat: '2026-05-07', tongTien: 12000000, vat: 8, hinhThuc: 'TienMat', trangThai: 'DaThanhToan',
    chiTiet: [
      { mon: 'Gà luộc', soLuong: 10, donGia: 350000, thanhTien: 3500000 },
      { mon: 'Xôi gấc', soLuong: 10, donGia: 150000, thanhTien: 1500000 },
      { mon: 'Giò chả', soLuong: 10, donGia: 250000, thanhTien: 2500000 },
      { mon: 'Canh măng', soLuong: 10, donGia: 180000, thanhTien: 1800000 },
      { mon: 'Nem rán', soLuong: 10, donGia: 200000, thanhTien: 2000000 },
      { mon: 'Chè kho', soLuong: 10, donGia: 70000, thanhTien: 700000 },
    ],
  },
  { key: '3', maHD: 'HĐ003', maDH: 'HD2-020526', khachHang: 'Trần Thị Bích', ngayXuat: '2026-05-05', tongTien: 9600000, vat: 8, hinhThuc: 'ChuyenKhoan', trangThai: 'DaThanhToan',
    chiTiet: [
      { mon: 'Gà luộc lá chanh', soLuong: 8, donGia: 350000, thanhTien: 2800000 },
      { mon: 'Xôi gấc', soLuong: 8, donGia: 150000, thanhTien: 1200000 },
      { mon: 'Canh bóng', soLuong: 8, donGia: 200000, thanhTien: 1600000 },
      { mon: 'Giò lụa', soLuong: 8, donGia: 250000, thanhTien: 2000000 },
      { mon: 'Chè kho', soLuong: 8, donGia: 250000, thanhTien: 2000000 },
    ],
  },
  { key: '4', maHD: 'HĐ004', maDH: 'HD4-040526', khachHang: 'Phạm Minh Tuấn', ngayXuat: '2026-05-07', tongTien: 36000000, vat: 8, hinhThuc: 'QuetThe', trangThai: 'ChuaThanhToan',
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
  { key: '5', maHD: 'HĐ005', maDH: 'HD3-030526', khachHang: 'Lê Hoàng Nam', ngayXuat: '2026-05-07', tongTien: 7500000, vat: 8, hinhThuc: 'TienMat', trangThai: 'ChuaThanhToan',
    chiTiet: [
      { mon: 'Bò nướng lá lốt', soLuong: 5, donGia: 400000, thanhTien: 2000000 },
      { mon: 'Gỏi cuốn', soLuong: 5, donGia: 200000, thanhTien: 1000000 },
      { mon: 'Cơm chiên', soLuong: 5, donGia: 180000, thanhTien: 900000 },
      { mon: 'Canh chua cá', soLuong: 5, donGia: 220000, thanhTien: 1100000 },
      { mon: 'Chè thái', soLuong: 5, donGia: 150000, thanhTien: 750000 },
      { mon: 'Bánh kem', soLuong: 1, donGia: 1750000, thanhTien: 1750000 },
    ],
  },
  { key: '6', maHD: 'HĐ006', maDH: 'HD6-060526', khachHang: 'Đặng Quốc Việt', ngayXuat: '2026-05-09', tongTien: 18000000, vat: 8, hinhThuc: 'ChuyenKhoan', trangThai: 'ChuaThanhToan',
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

const hinhThucConfig = {
  TienMat: { text: 'Tiền mặt', color: 'green', icon: <WalletOutlined /> },
  ChuyenKhoan: { text: 'Chuyển khoản', color: 'blue', icon: <BankOutlined /> },
  QuetThe: { text: 'Quẹt thẻ', color: 'purple', icon: <CreditCardOutlined /> },
}

const trangThaiConfig = {
  DaThanhToan: { text: 'Đã thanh toán', color: 'success', icon: <CheckCircleOutlined /> },
  ChuaThanhToan: { text: 'Chờ thanh toán', color: 'warning', icon: <ClockCircleOutlined /> },
}

// ==================== COMPONENT ====================
export default function HoaDon() {
  const [hoaDons, setHoaDons] = useState(mockHoaDon)
  const [searchText, setSearchText] = useState('')
  const [filterTT, setFilterTT] = useState(null)
  const [filterHT, setFilterHT] = useState(null)
  const [detailModal, setDetailModal] = useState({ open: false, data: null })
  const [createModal, setCreateModal] = useState(false)
  const [createForm] = Form.useForm()
  // Modal chọn hình thức thanh toán
  const [payModal, setPayModal] = useState({ open: false, key: null })
  const [payMethod, setPayMethod] = useState(null)

  // Đọc pendingInvoice từ localStorage
  useEffect(() => {
    try {
      const pending = localStorage.getItem('pendingInvoice')
      if (pending) {
        const data = JSON.parse(pending)
        const maHD = 'HĐ' + String(hoaDons.length + 1).padStart(3, '0')
        const newHD = {
          key: String(Date.now()),
          maHD,
          maDH: data.maDH,
          khachHang: data.khachHang,
          ngayXuat: new Date().toISOString().split('T')[0],
          tongTien: data.tongTien,
          vat: 8,
          hinhThuc: null,
          trangThai: 'ChuaThanhToan',
          chiTiet: data.chiTiet || [],
        }
        setHoaDons(prev => [...prev, newHD])
        localStorage.removeItem('pendingInvoice')
        message.success(`Đã tạo hóa đơn ${maHD} từ đơn hàng ${data.maDH}`)
      }
    } catch {}
  }, [])

  // Filter
  const filtered = hoaDons.filter(hd => {
    const matchSearch = hd.maHD.toLowerCase().includes(searchText.toLowerCase()) ||
      hd.maDH.toLowerCase().includes(searchText.toLowerCase()) ||
      hd.khachHang.toLowerCase().includes(searchText.toLowerCase())
    const matchTT = filterTT ? hd.trangThai === filterTT : true
    const matchHT = filterHT ? hd.hinhThuc === filterHT : true
    return matchSearch && matchTT && matchHT
  })

  // Stats
  const tongHD = hoaDons.length
  const daTT = hoaDons.filter(h => h.trangThai === 'DaThanhToan').length
  const chuaTT = hoaDons.filter(h => h.trangThai === 'ChuaThanhToan').length
  const doanhThu = hoaDons.filter(h => h.trangThai === 'DaThanhToan')
    .reduce((s, h) => s + Math.round(h.tongTien * (1 + h.vat / 100)), 0)

  // Xác nhận thanh toán (cần chọn hình thức trước)
  const openPayModal = (key) => {
    setPayModal({ open: true, key })
    setPayMethod(null)
  }
  const handleConfirmPayment = () => {
    if (!payMethod) { message.warning('Vui lòng chọn hình thức thanh toán!'); return }
    setHoaDons(prev => prev.map(h => h.key === payModal.key ? { ...h, trangThai: 'DaThanhToan', hinhThuc: payMethod } : h))
    message.success('Đã xác nhận thanh toán!')
    setPayModal({ open: false, key: null })
    setPayMethod(null)
  }

  // Tạo hóa đơn mới
  const handleCreateHD = () => {
    createForm.validateFields().then(vals => {
      const maHD = 'HĐ' + String(hoaDons.length + 1).padStart(3, '0')
      const newHD = {
        key: String(hoaDons.length + 1),
        maHD,
        maDH: vals.maDH,
        khachHang: vals.khachHang,
        ngayXuat: new Date().toISOString().split('T')[0],
        tongTien: vals.tongTien,
        vat: vals.vat || 8,
        hinhThuc: null,
        trangThai: 'ChuaThanhToan',
        chiTiet: [],
      }
      setHoaDons(prev => [...prev, newHD])
      message.success(`Đã tạo hóa đơn ${maHD}`)
      createForm.resetFields()
      setCreateModal(false)
    })
  }

  const statCard = (color) => ({
    background: `linear-gradient(135deg, ${color}22, ${color}08)`,
    border: `1px solid ${color}30`, borderRadius: 14, padding: '16px 20px',
  })

  // Columns
  const columns = [
    {
      title: 'Mã HĐ', dataIndex: 'maHD', width: 100,
      render: v => <Text strong style={{ color: 'var(--primary)' }}>{v}</Text>,
    },
    {
      title: 'Mã đơn hàng', dataIndex: 'maDH', width: 130,
      render: v => <Text code>{v}</Text>,
    },
    { title: 'Khách hàng', dataIndex: 'khachHang' },
    { title: 'Ngày xuất', dataIndex: 'ngayXuat', width: 110, sorter: (a, b) => new Date(a.ngayXuat) - new Date(b.ngayXuat) },
    {
      title: 'Tổng tiền', dataIndex: 'tongTien', width: 140, align: 'right',
      render: v => <Text>{formatVND(v)}</Text>,
      sorter: (a, b) => a.tongTien - b.tongTien,
    },
    {
      title: 'VAT', dataIndex: 'vat', width: 60, align: 'center',
      render: v => <Tag style={{ borderRadius: 8 }}>{v}%</Tag>,
    },
    {
      title: 'Thành tiền', key: 'thanhTien', width: 150, align: 'right',
      render: (_, r) => <Text strong style={{ color: '#52c41a' }}>{formatVND(Math.round(r.tongTien * (1 + r.vat / 100)))}</Text>,
      sorter: (a, b) => a.tongTien * (1 + a.vat / 100) - b.tongTien * (1 + b.vat / 100),
    },
    {
      title: 'Hình thức', dataIndex: 'hinhThuc', width: 140,
      render: (v, r) => {
        if (r.trangThai === 'ChuaThanhToan' || !v) return <Tag style={{ borderRadius: 12 }} color="default">Chưa chọn</Tag>
        const cfg = hinhThucConfig[v]
        return cfg ? <Tag icon={cfg.icon} color={cfg.color} style={{ borderRadius: 12 }}>{cfg.text}</Tag> : '—'
      },
    },
    {
      title: 'Trạng thái', dataIndex: 'trangThai', width: 150,
      render: v => {
        const cfg = trangThaiConfig[v]
        return <Tag icon={cfg.icon} color={cfg.color} style={{ borderRadius: 12 }}>{cfg.text}</Tag>
      },
    },
    {
      title: 'Thao tác', key: 'action', width: 140, align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} onClick={() => setDetailModal({ open: true, data: record })} />
          </Tooltip>
          <Tooltip title="In hóa đơn">
            <Button type="text" icon={<PrinterOutlined />} onClick={() => message.info('Chức năng in đang phát triển')} />
          </Tooltip>
          {record.trangThai === 'ChuaThanhToan' && (
            <Tooltip title="Xác nhận thanh toán">
              <Button type="text" style={{ color: '#52c41a' }} icon={<CheckCircleOutlined />}
                onClick={() => openPayModal(record.key)} />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  // Detail columns
  const detailColumns = [
    { title: 'Tên món', dataIndex: 'mon', key: 'mon' },
    { title: 'SL', dataIndex: 'soLuong', key: 'soLuong', width: 60, align: 'center' },
    { title: 'Đơn giá', dataIndex: 'donGia', key: 'donGia', width: 130, align: 'right', render: v => formatVND(v) },
    { title: 'Thành tiền', dataIndex: 'thanhTien', key: 'thanhTien', width: 140, align: 'right', render: v => <Text strong>{formatVND(v)}</Text> },
  ]

  return (
    <div>
      <h2 className="dashboard-title">Quản lý Hóa đơn</h2>

      {/* Stats */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <div style={statCard('#5b8def')}>
            <Statistic title="Tổng hóa đơn" value={tongHD} prefix={<FileTextOutlined />} valueStyle={{ color: '#5b8def' }} />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div style={statCard('#52c41a')}>
            <Statistic title="Đã thanh toán" value={daTT} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div style={statCard('#faad14')}>
            <Statistic title="Chờ thanh toán" value={chuaTT} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#faad14' }} />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div style={statCard('#722ed1')}>
            <Statistic title="Doanh thu (đã TT)" value={doanhThu} prefix={<DollarOutlined />} valueStyle={{ color: '#722ed1' }}
              formatter={val => new Intl.NumberFormat('vi-VN').format(val / 1000000) + 'tr'} />
          </div>
        </Col>
      </Row>

      {/* Filter bar */}
      <Card bordered={false} className="glass-effect" style={{ borderRadius: 16, marginBottom: 20 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={6}>
            <Input placeholder="Tìm mã HĐ, mã đơn, KH..."
              prefix={<SearchOutlined style={{ color: '#aaa' }} />}
              value={searchText} onChange={e => setSearchText(e.target.value)}
              allowClear style={{ borderRadius: 10 }} />
          </Col>
          <Col xs={12} sm={4}>
            <Select placeholder="Trạng thái" value={filterTT} onChange={v => setFilterTT(v)}
              allowClear style={{ width: '100%', borderRadius: 10 }}
              options={Object.entries(trangThaiConfig).map(([v, cfg]) => ({ value: v, label: cfg.text }))} />
          </Col>
          <Col xs={12} sm={4}>
            <Select placeholder="Hình thức TT" value={filterHT} onChange={v => setFilterHT(v)}
              allowClear style={{ width: '100%', borderRadius: 10 }}
              options={Object.entries(hinhThucConfig).map(([v, cfg]) => ({ value: v, label: cfg.text }))} />
          </Col>
          <Col xs={24} sm={10} style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => { setSearchText(''); setFilterTT(null); setFilterHT(null) }}
                style={{ borderRadius: 10 }}>Làm mới</Button>
              <Button type="primary" icon={<PlusOutlined />}
                onClick={() => setCreateModal(true)} style={{ borderRadius: 10 }}>Tạo hóa đơn</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card bordered={false} className="glass-effect" style={{ borderRadius: 16 }}>
        <Table columns={columns} dataSource={filtered}
          pagination={{ pageSize: 10, showTotal: t => `Tổng ${t} hóa đơn` }}
          scroll={{ x: 1200 }} rowClassName="order-row" size="middle" />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={detailModal.data && (
          <Space>
            <Text strong style={{ fontSize: 18 }}>Chi tiết {detailModal.data.maHD}</Text>
            <Tag icon={trangThaiConfig[detailModal.data.trangThai].icon}
              color={trangThaiConfig[detailModal.data.trangThai].color}
              style={{ borderRadius: 12 }}>
              {trangThaiConfig[detailModal.data.trangThai].text}
            </Tag>
          </Space>
        )}
        open={detailModal.open} onCancel={() => setDetailModal({ open: false, data: null })}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={() => message.info('Chức năng in đang phát triển')}>In hóa đơn</Button>,
          detailModal.data?.trangThai === 'ChuaThanhToan' && (
            <Button key="pay" type="primary" style={{ background: '#52c41a', borderColor: '#52c41a' }}
              icon={<CheckCircleOutlined />}
              onClick={() => { openPayModal(detailModal.data.key); setDetailModal({ open: false, data: null }) }}>
              Xác nhận thanh toán
            </Button>
          ),
          <Button key="close" type="primary" onClick={() => setDetailModal({ open: false, data: null })}>Đóng</Button>,
        ].filter(Boolean)}
        width={720}>
        {detailModal.data && (() => {
          const hd = detailModal.data
          const thanhTien = Math.round(hd.tongTien * (1 + hd.vat / 100))
          const tienCoc = Math.round(hd.tongTien * 0.15)
          return (
            <>
              <Descriptions bordered size="small" column={2} style={{ marginBottom: 20 }}
                labelStyle={{ fontWeight: 600, background: 'rgba(91,141,239,0.05)' }}>
                <Descriptions.Item label="Mã hóa đơn">{hd.maHD}</Descriptions.Item>
                <Descriptions.Item label="Mã đơn hàng">{hd.maDH}</Descriptions.Item>
                <Descriptions.Item label="Khách hàng">{hd.khachHang}</Descriptions.Item>
                <Descriptions.Item label="Ngày xuất">{hd.ngayXuat}</Descriptions.Item>
                <Descriptions.Item label="Tổng tiền hàng">{formatVND(hd.tongTien)}</Descriptions.Item>
                <Descriptions.Item label="VAT">{hd.vat}%</Descriptions.Item>
                <Descriptions.Item label="Tiền cọc đã TT">
                  <Text style={{ color: '#52c41a' }}>{formatVND(tienCoc)}</Text>
                </Descriptions.Item>
                {hd.trangThai === 'DaThanhToan' && hd.hinhThuc && (
                  <Descriptions.Item label="Hình thức TT">
                    <Tag icon={hinhThucConfig[hd.hinhThuc]?.icon} color={hinhThucConfig[hd.hinhThuc]?.color}
                      style={{ borderRadius: 12 }}>{hinhThucConfig[hd.hinhThuc]?.text}</Tag>
                  </Descriptions.Item>
                )}
                {hd.trangThai === 'ChuaThanhToan' && (
                  <Descriptions.Item label="Hình thức TT">
                    <Tag color="default">Chưa chọn</Tag>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="TỔNG THANH TOÁN" span={2}>
                  <Text strong style={{ fontSize: 18, color: 'var(--primary)' }}>{formatVND(thanhTien)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Còn phải thanh toán" span={2}>
                  <Text strong style={{ fontSize: 16, color: '#ff4d4f' }}>{formatVND(thanhTien - tienCoc)}</Text>
                </Descriptions.Item>
              </Descriptions>

              <Divider orientation="left" style={{ fontSize: 15 }}>Danh sách món</Divider>
              <Table columns={detailColumns}
                dataSource={hd.chiTiet.map((item, i) => ({ ...item, key: i }))}
                pagination={false} size="small"
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={3} align="right">
                        <Text strong style={{ fontSize: 15 }}>TỔNG CỘNG:</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <Text strong style={{ fontSize: 15, color: 'var(--primary)' }}>{formatVND(hd.tongTien)}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={3} align="right">
                        <Text type="secondary">VAT ({hd.vat}%):</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <Text>{formatVND(Math.round(hd.tongTien * hd.vat / 100))}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row style={{ background: 'rgba(91,141,239,0.05)' }}>
                      <Table.Summary.Cell index={0} colSpan={3} align="right">
                        <Text strong style={{ fontSize: 16 }}>THÀNH TIỀN:</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <Text strong style={{ fontSize: 16, color: '#52c41a' }}>{formatVND(thanhTien)}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )} />
            </>
          )
        })()}
      </Modal>

      {/* Create Modal */}
      <Modal title="Tạo hóa đơn mới" open={createModal} width={560}
        onOk={handleCreateHD} onCancel={() => { setCreateModal(false); createForm.resetFields() }}
        okText="Tạo hóa đơn" cancelText="Hủy">
        <Form form={createForm} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="maDH" label="Mã đơn hàng" rules={[{ required: true, message: 'Nhập mã đơn' }]}>
                <Input placeholder="VD: HD7-070526" style={{ borderRadius: 10 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="khachHang" label="Khách hàng" rules={[{ required: true, message: 'Nhập tên KH' }]}>
                <Input placeholder="VD: Nguyễn Văn A" style={{ borderRadius: 10 }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="tongTien" label="Tổng tiền hàng" rules={[{ required: true }]}>
                <InputNumber min={0} step={100000} style={{ width: '100%', borderRadius: 10 }} addonAfter="VNĐ"
                  formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={v => v.replace(/,/g, '')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="vat" label="VAT (%)" initialValue={8}>
                <InputNumber min={0} max={100} style={{ width: '100%', borderRadius: 10 }} addonAfter="%" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Payment Method Modal */}
      <Modal title="Chọn hình thức thanh toán" open={payModal.open}
        onOk={handleConfirmPayment}
        onCancel={() => { setPayModal({ open: false, key: null }); setPayMethod(null) }}
        okText="Xác nhận" cancelText="Hủy"
        okButtonProps={{ style: { background: '#52c41a', borderColor: '#52c41a' } }}>
        <div style={{ marginTop: 16 }}>
          <Text strong>Hình thức thanh toán:</Text>
          <Select placeholder="Chọn hình thức" value={payMethod} onChange={v => setPayMethod(v)}
            style={{ width: '100%', marginTop: 8, borderRadius: 10 }}
            options={Object.entries(hinhThucConfig).map(([v, cfg]) => ({ value: v, label: cfg.text }))} />
        </div>
      </Modal>
    </div>
  )
}
