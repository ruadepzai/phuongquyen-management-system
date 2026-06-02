import { useState } from 'react'
import {
  Tabs, Table, Card, Tag, Space, Typography, Collapse,
  Input, Select, Statistic, Row, Col, Tooltip, Empty,
  Modal, Form, Button, message, Divider, InputNumber, Popconfirm, DatePicker
} from 'antd'
import {
  CalendarOutlined, CheckCircleOutlined,
  CaretRightOutlined, ImportOutlined, WarningOutlined,
  EyeOutlined, ExperimentOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text } = Typography

function formatVND(v) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)
}

const glassCard = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }
const statCard = (color) => ({
  background: `linear-gradient(135deg, ${color}22, ${color}08)`,
  border: `1px solid ${color}30`, borderRadius: 14, padding: '16px 20px',
})

// Mock phiếu đặt hàng (đã tách theo NCC) — ban đầu rỗng, sẽ được push từ NguyenLieu
// Giả lập vài phiếu mẫu
const initPhieuDat = [
  {
    key: 'PDH001', maPhieu: 'PDH001', ngay: dayjs().format('YYYY-MM-DD'),
    thoiGian: dayjs().format('DD/MM/YYYY HH:mm'),
    nccMa: 'NCC04', nccTen: 'Cô Lan', nccSdt: '0976777888',
    soNL: 2, trangThai: 'ChoGiaoHang',
    data: [
      { key: 'NL07', ma: 'NL07', ten: 'Gạo nếp', donVi: 'kg', tongSL: 4, slThucNhap: 4, donGiaNhap: 25000 },
      { key: 'NL09', ma: 'NL09', ten: 'Miến dong', donVi: 'kg', tongSL: 1, slThucNhap: 1, donGiaNhap: 80000 },
    ],
  },
  {
    key: 'PDH002', maPhieu: 'PDH002', ngay: dayjs().format('YYYY-MM-DD'),
    thoiGian: dayjs().format('DD/MM/YYYY HH:mm'),
    nccMa: 'NCC01', nccTen: 'Anh Tuấn', nccSdt: '0901111222',
    soNL: 2, trangThai: 'ChoGiaoHang',
    data: [
      { key: 'NL01', ma: 'NL01', ten: 'Thịt lợn', donVi: 'kg', tongSL: 3, slThucNhap: 3, donGiaNhap: 120000 },
      { key: 'NL10', ma: 'NL10', ten: 'Giò lụa', donVi: 'kg', tongSL: 2, slThucNhap: 2, donGiaNhap: 150000 },
    ],
  },
  {
    key: 'PDH003', maPhieu: 'PDH003', ngay: dayjs().format('YYYY-MM-DD'),
    thoiGian: dayjs().format('DD/MM/YYYY HH:mm'),
    nccMa: 'NCC03', nccTen: 'Bác Hùng', nccSdt: '0987555666',
    soNL: 1, trangThai: 'ChoGiaoHang',
    data: [
      { key: 'NL06', ma: 'NL06', ten: 'Hành lá', donVi: 'bó', tongSL: 2, slThucNhap: 2, donGiaNhap: 15000 },
    ],
  },
  {
    key: 'PDH004', maPhieu: 'PDH004', ngay: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    thoiGian: dayjs().format('DD/MM/YYYY HH:mm'),
    nccMa: 'NCC02', nccTen: 'Chị Hoa', nccSdt: '0912333444',
    soNL: 2, trangThai: 'ChoGiaoHang',
    data: [
      { key: 'NL03', ma: 'NL03', ten: 'Tôm sú', donVi: 'kg', tongSL: 9.2, slThucNhap: 9.2, donGiaNhap: 350000 },
      { key: 'NL04', ma: 'NL04', ten: 'Cá chép', donVi: 'kg', tongSL: 7.5, slThucNhap: 7.5, donGiaNhap: 90000 },
    ],
  },
]

// ==================== COMPONENT ====================
export default function TiepNhanNL() {
  const [lichSuPhieu, setLichSuPhieu] = useState(initPhieuDat)
  const [tiepNhanData, setTiepNhanData] = useState({})

  // Phiếu báo lỗi
  const [dsPhieuLoi, setDsPhieuLoi] = useState([])
  const [pblModalOpen, setPblModalOpen] = useState(false)
  const [pblForm] = Form.useForm()
  const [pblContext, setPblContext] = useState(null)
  const [pblDetailVisible, setPblDetailVisible] = useState(false)
  const [pblDetailData, setPblDetailData] = useState(null)
  // Track loại lỗi đã chọn cho mỗi item trong PBL form
  const [pblLoaiLoi, setPblLoaiLoi] = useState({})
  // Bộ lọc ngày
  const [filterDate, setFilterDate] = useState(null)
  // Preview phiếu nhập kho
  const [previewModal, setPreviewModal] = useState({ open: false, phieu: null })

  // ===== TIẾP NHẬN =====
  const handleBatDauKiem = (maPhieu) => {
    setTiepNhanData(prev => ({ ...prev, [maPhieu]: { status: 'DangNhan', rows: {} } }))
  }

  const handleXacNhanNhapKho = (phieu) => {
    const rows = tiepNhanData[phieu.maPhieu]?.rows || {}
    const hasError = phieu.data.some(r => {
      const actual = rows[r.ma]?.slNhan ?? r.slThucNhap
      return actual !== r.slThucNhap
    })
    if (hasError) {
      const loiItems = phieu.data.filter(r => (rows[r.ma]?.slNhan ?? r.slThucNhap) !== r.slThucNhap)
        .map(r => ({
          ...r,
          slNhan: rows[r.ma]?.slNhan ?? r.slThucNhap,
          chenhLech: r.slThucNhap - (rows[r.ma]?.slNhan ?? r.slThucNhap),
        }))
      setPblContext({ maPhieu: phieu.maPhieu, nccTen: phieu.nccTen, items: loiItems })
      setPblLoaiLoi({})
      setPblModalOpen(true)
    } else {
      setTiepNhanData(prev => ({ ...prev, [phieu.maPhieu]: { status: 'DaNhapKho' } }))
      setLichSuPhieu(prev => prev.map(p => p.maPhieu === phieu.maPhieu ? { ...p, trangThai: 'HoanThanh' } : p))
      message.success('Khớp 100%! Đã xác nhận nhập kho.')
      setPreviewModal({ open: true, phieu })
    }
  }

  // ===== PHIẾU BÁO LỖI =====
  const handleLoaiLoiChange = (idx, value) => {
    setPblLoaiLoi(prev => ({ ...prev, [idx]: value }))
    // Reset giá trị SL khi đổi loại lỗi
    pblForm.setFieldsValue({
      items: {
        ...pblForm.getFieldsValue().items,
        [idx]: {
          ...pblForm.getFieldsValue().items?.[idx],
          loaiLoi: value,
          slThieu: value === 'ThieuHang' || value === 'ThieuVaHong' ? pblForm.getFieldValue(['items', idx, 'slThieu']) : 0,
          slHong: value === 'HangHong' || value === 'ThieuVaHong' ? pblForm.getFieldValue(['items', idx, 'slHong']) : 0,
        },
      },
    })
  }

  const handleXacNhanPBL = () => {
    pblForm.validateFields().then(vals => {
      // Validate: phải có ít nhất 1 SL > 0
      let valid = true
      pblContext.items.forEach((_, i) => {
        const loai = vals.items?.[i]?.loaiLoi
        const slT = vals.items?.[i]?.slThieu || 0
        const slH = vals.items?.[i]?.slHong || 0
        if (!loai) { valid = false }
        if (loai === 'ThieuHang' && slT <= 0) valid = false
        if (loai === 'HangHong' && slH <= 0) valid = false
        if (loai === 'ThieuVaHong' && slT <= 0 && slH <= 0) valid = false
      })
      if (!valid) {
        message.warning('Vui lòng chọn loại lỗi và nhập số lượng tương ứng!')
        return
      }

      const maLoi = 'PBL' + String(dsPhieuLoi.length + 1).padStart(3, '0')
      const items = pblContext.items.map((it, i) => ({
        ...it,
        loaiLoi: vals.items?.[i]?.loaiLoi || '',
        slThieu: vals.items?.[i]?.slThieu || 0,
        slHong: vals.items?.[i]?.slHong || 0,
        ghiChuLoi: vals.items?.[i]?.ghiChuLoi || '',
      }))
      setDsPhieuLoi(prev => [...prev, {
        key: maLoi, maLoi, maPhieu: pblContext.maPhieu, nccTen: pblContext.nccTen,
        ngay: dayjs().format('DD/MM/YYYY HH:mm'), items, trangThai: 'ChoXuLy',
      }])
      setTiepNhanData(prev => ({ ...prev, [pblContext.maPhieu]: { status: 'CoLoi' } }))
      message.warning(`Đã tạo phiếu báo lỗi ${maLoi}`)
      setPblModalOpen(false)
      pblForm.resetFields()
      setPblLoaiLoi({})
    })
  }

  const handleXuLyPBL = (maLoi) => {
    const pbl = dsPhieuLoi.find(p => p.maLoi === maLoi)
    setDsPhieuLoi(prev => prev.map(p => p.maLoi === maLoi ? { ...p, trangThai: 'DaXuLy' } : p))
    // Cập nhật trạng thái tiếp nhận: CoLoi → DaNhapKho
    if (pbl) {
      setTiepNhanData(prev => ({ ...prev, [pbl.maPhieu]: { status: 'DaNhapKho' } }))
    }
    message.success(`Đã xử lý phiếu ${maLoi} — Phiếu tiếp nhận đã chuyển sang "Đã nhập kho"`)
  }

  // Stats
  const tongPhieu = lichSuPhieu.length
  const choGiao = lichSuPhieu.filter(p => (tiepNhanData[p.maPhieu]?.status || 'ChuaNhan') === 'ChuaNhan').length
  const daNhapKho = lichSuPhieu.filter(p => tiepNhanData[p.maPhieu]?.status === 'DaNhapKho').length
  const coLoi = dsPhieuLoi.filter(p => p.trangThai === 'ChoXuLy').length

  // ============================================================
  // TAB ITEMS
  // ============================================================
  const tabItems = [
    // ===== TAB 1: Tiếp nhận =====
    {
      key: 'tiepnhan',
      label: <span><ImportOutlined style={{ marginRight: 6 }} />Tiếp nhận hàng</span>,
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card style={glassCard} styles={{ body: { padding: '12px 16px' } }}>
            <Space>
              <Text type="secondary">Lọc theo ngày:</Text>
              <DatePicker placeholder="Tất cả ngày"
                onChange={(date) => setFilterDate(date ? date.format('YYYY-MM-DD') : null)}
                allowClear style={{ borderRadius: 10, width: 160 }} />
            </Space>
          </Card>
          {lichSuPhieu.length === 0 ? (
            <Card style={glassCard}><Empty description="Chưa có phiếu đặt hàng nào để tiếp nhận" /></Card>
          ) : (() => {
            const filteredPhieu = filterDate ? lichSuPhieu.filter(p => p.ngay === filterDate) : lichSuPhieu
            if (filteredPhieu.length === 0) return <Card style={glassCard}><Empty description="Không có phiếu nào trong ngày này" /></Card>
            const phieuByDate = {}
            filteredPhieu.forEach(p => {
              if (!phieuByDate[p.ngay]) phieuByDate[p.ngay] = []
              phieuByDate[p.ngay].push(p)
            })
            const sortedDates = Object.keys(phieuByDate).sort()

            return (
              <Collapse
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                style={{ background: 'transparent', border: 'none' }}
                defaultActiveKey={sortedDates}
                items={sortedDates.map(dateStr => {
                  const phieus = phieuByDate[dateStr]
                  const tongNCC = phieus.length
                  const tongNL = phieus.reduce((s, p) => s + p.soNL, 0)
                  return {
                    key: dateStr,
                    label: (
                      <Space size={16}>
                        <Text strong style={{ fontSize: 15, color: '#5b8def' }}>
                          <CalendarOutlined style={{ marginRight: 6 }} />{dayjs(dateStr).format('DD/MM/YYYY')}
                        </Text>
                        <Tag color="geekblue">{tongNCC} NCC</Tag>
                        <Tag color="blue">{tongNL} NL</Tag>
                      </Space>
                    ),
                    children: (
                      <Collapse
                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                        style={{ background: 'transparent', border: 'none' }}
                        items={phieus.map(phieu => {
                          const tn = tiepNhanData[phieu.maPhieu] || { status: 'ChuaNhan' }
                          return {
                            key: phieu.maPhieu,
                            label: (
                              <Space>
                                <Text strong style={{ color: '#5b8def' }}>{phieu.maPhieu}</Text>
                                <Tag color="geekblue">NCC: {phieu.nccTen}</Tag>
                                <Tag>{phieu.soNL} NL</Tag>
                                {tn.status === 'ChuaNhan' && <Tag color="warning">⏳ Chờ giao</Tag>}
                                {tn.status === 'DangNhan' && <Tag color="processing">📋 Đang đối chiếu</Tag>}
                                {tn.status === 'DaNhapKho' && <Tag color="success" icon={<CheckCircleOutlined />}>Đã nhập kho</Tag>}
                                {tn.status === 'CoLoi' && <Tag color="error" icon={<WarningOutlined />}>Có phiếu lỗi</Tag>}
                              </Space>
                            ),
                            children: (
                              <div>
                                <Table size="small" pagination={false} style={{ marginBottom: 12 }}
                                  dataSource={phieu.data.map(r => ({ ...r, key: r.ma }))}
                                  columns={[
                                    { title: 'Nguyên liệu', dataIndex: 'ten', render: v => <Text strong>{v}</Text> },
                                    { title: 'Đơn vị', dataIndex: 'donVi', width: 60 },
                                    { title: 'SL đặt', dataIndex: 'slThucNhap', width: 90, align: 'center', render: v => <Tag color="blue">{v}</Tag> },
                                    { title: 'Đơn giá', dataIndex: 'donGiaNhap', width: 120, align: 'right', render: v => v ? formatVND(v) : '—' },
                                    ...(tn.status === 'DangNhan' ? [{
                                      title: 'SL thực nhận', width: 120, align: 'center',
                                      render: (_, r) => <InputNumber size="small" style={{ width: 90 }} min={0}
                                        defaultValue={r.slThucNhap}
                                        onChange={val => {
                                          setTiepNhanData(prev => {
                                            const cur = prev[phieu.maPhieu] || { status: 'DangNhan', rows: {} }
                                            return { ...prev, [phieu.maPhieu]: { ...cur, rows: { ...cur.rows, [r.ma]: { slNhan: val || 0 } } } }
                                          })
                                        }} />,
                                    }] : []),
                                  ]} />

                                {tn.status === 'ChuaNhan' && (
                                  <div style={{ textAlign: 'center' }}>
                                    <Button type="primary" icon={<ImportOutlined />} onClick={() => handleBatDauKiem(phieu.maPhieu)} style={{ borderRadius: 12 }}>Bắt đầu kiểm hàng</Button>
                                  </div>
                                )}
                                {tn.status === 'DangNhan' && (
                                  <div style={{ textAlign: 'right', marginTop: 12 }}>
                                    <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleXacNhanNhapKho(phieu)} style={{ borderRadius: 12 }}>Xác nhận nhập kho</Button>
                                  </div>
                                )}
                                {tn.status === 'DaNhapKho' && <Tag color="success" style={{ fontSize: 14, padding: '6px 16px' }}>✅ Đã nhập kho thành công</Tag>}
                                {tn.status === 'CoLoi' && <Tag color="error" style={{ fontSize: 14, padding: '6px 16px' }}>⚠️ Đã lập phiếu báo lỗi</Tag>}
                              </div>
                            ),
                          }
                        })}
                      />
                    ),
                  }
                })}
              />
            )
          })()}
        </div>
      ),
    },

    // ===== TAB 2: Lịch sử phiếu báo lỗi =====
    {
      key: 'lichsuPBL',
      label: <span><WarningOutlined style={{ marginRight: 6, color: '#ff4d4f' }} />Phiếu báo lỗi ({dsPhieuLoi.length})</span>,
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {dsPhieuLoi.length === 0 ? (
            <Card style={glassCard}><Empty description="Chưa có phiếu báo lỗi nào" /></Card>
          ) : (
            <Card style={glassCard}>
              <Table size="middle" pagination={false} dataSource={dsPhieuLoi}
                columns={[
                  { title: 'Mã PBL', dataIndex: 'maLoi', width: 110, render: v => <Text strong style={{ color: '#ff4d4f' }}>{v}</Text> },
                  { title: 'Mã phiếu đặt', dataIndex: 'maPhieu', width: 120 },
                  { title: 'NCC', dataIndex: 'nccTen', width: 120 },
                  { title: 'Ngày tạo', dataIndex: 'ngay', width: 160 },
                  { title: 'Số NL lỗi', width: 90, align: 'center', render: (_, r) => <Tag color="red">{r.items.length}</Tag> },
                  {
                    title: 'Trạng thái', dataIndex: 'trangThai', width: 130,
                    render: v => v === 'DaXuLy' ? <Tag color="success">Đã xử lý</Tag> : <Tag color="warning">Chờ xử lý</Tag>,
                  },
                  {
                    title: 'Thao tác', width: 150, align: 'center',
                    render: (_, r) => (
                      <Space>
                        <Tooltip title="Xem chi tiết">
                          <Button type="text" icon={<EyeOutlined />} onClick={() => { setPblDetailData(r); setPblDetailVisible(true) }} />
                        </Tooltip>
                        {r.trangThai === 'ChoXuLy' && (
                          <Popconfirm title="Xác nhận đã xử lý phiếu này?" onConfirm={() => handleXuLyPBL(r.maLoi)} okText="Xác nhận" cancelText="Hủy">
                            <Button type="primary" size="small" style={{ borderRadius: 8 }}>Đã xử lý</Button>
                          </Popconfirm>
                        )}
                      </Space>
                    ),
                  },
                ]} />
            </Card>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Title level={2} style={{ margin: 0 }}>
          <ImportOutlined style={{ marginRight: 10, color: '#5b8def' }} />
          Tiếp nhận Nguyên liệu
        </Title>
        <Text type="secondary">Kiểm tra, đối chiếu và nhập kho nguyên liệu từ nhà cung cấp</Text>
      </div>

      <Tabs items={tabItems} defaultActiveKey="tiepnhan" size="large"
        tabBarStyle={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '4px 8px', marginBottom: 16 }} />

      {/* ===== Modal tạo phiếu báo lỗi ===== */}
      <Modal title="Lập phiếu báo lỗi" open={pblModalOpen} width={700}
        onOk={handleXacNhanPBL} onCancel={() => { setPblModalOpen(false); pblForm.resetFields(); setPblLoaiLoi({}) }}
        okText="Xác nhận phiếu báo lỗi" cancelText="Hủy">
        {pblContext && (
          <Form form={pblForm} layout="vertical" style={{ marginTop: 12 }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
              Phiếu đặt: <Text strong>{pblContext.maPhieu}</Text> — NCC: <Text strong>{pblContext.nccTen}</Text>
            </Text>
            {pblContext.items.map((item, idx) => {
              const loai = pblLoaiLoi[idx]
              const maxSL = Math.abs(item.chenhLech)
              const thEnabled = loai === 'ThieuHang' || loai === 'ThieuVaHong'
              const hoEnabled = loai === 'HangHong' || loai === 'ThieuVaHong'
              return (
                <Card key={idx} size="small" style={{ marginBottom: 12, background: 'rgba(255,77,79,0.04)', border: '1px solid rgba(255,77,79,0.15)', borderRadius: 12 }}
                  title={<Space><Text strong>{item.ten}</Text><Tag>SL đặt: {item.slThucNhap}</Tag><Tag color="red">Chênh lệch: {maxSL}</Tag></Space>}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item name={['items', idx, 'loaiLoi']} label="Loại lỗi" rules={[{ required: true, message: 'Chọn loại lỗi' }]}>
                        <Select placeholder="— Chọn —" onChange={(v) => handleLoaiLoiChange(idx, v)} options={[
                          { value: 'ThieuHang', label: 'Thiếu hàng' },
                          { value: 'HangHong', label: 'Hàng hỏng' },
                          { value: 'ThieuVaHong', label: 'Thiếu và hỏng' },
                        ]} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name={['items', idx, 'slThieu']} label="SL thiếu"
                        rules={thEnabled ? [{ required: true, message: 'Nhập SL' }] : []}>
                        <InputNumber min={0} max={maxSL} style={{ width: '100%' }} placeholder="0"
                          disabled={!thEnabled} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name={['items', idx, 'slHong']} label="SL hỏng"
                        rules={hoEnabled ? [{ required: true, message: 'Nhập SL' }] : []}>
                        <InputNumber min={0} max={maxSL} style={{ width: '100%' }} placeholder="0"
                          disabled={!hoEnabled} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name={['items', idx, 'ghiChuLoi']} label="Ghi chú">
                    <Input placeholder="Mô tả tình trạng thực tế..." />
                  </Form.Item>
                </Card>
              )
            })}
          </Form>
        )}
      </Modal>

      {/* ===== Modal chi tiết PBL ===== */}
      <Modal title={pblDetailData && `Chi tiết phiếu ${pblDetailData.maLoi}`} open={pblDetailVisible}
        onCancel={() => setPblDetailVisible(false)} footer={null} width={650}>
        {pblDetailData && (
          <>
            <Divider style={{ margin: '8px 0' }}>Thông tin</Divider>
            <Row gutter={16} style={{ marginBottom: 12 }}>
              <Col span={8}><Text type="secondary">Mã phiếu đặt:</Text> <Text strong>{pblDetailData.maPhieu}</Text></Col>
              <Col span={8}><Text type="secondary">NCC:</Text> <Text strong>{pblDetailData.nccTen}</Text></Col>
              <Col span={8}><Text type="secondary">Ngày tạo:</Text> <Text>{pblDetailData.ngay}</Text></Col>
            </Row>
            <Divider style={{ margin: '8px 0' }}>Chi tiết lỗi</Divider>
            <Table size="small" pagination={false} dataSource={pblDetailData.items.map((it, i) => ({ ...it, key: i }))}
              columns={[
                { title: 'Nguyên liệu', dataIndex: 'ten', render: v => <Text strong>{v}</Text> },
                {
                  title: 'Loại lỗi', dataIndex: 'loaiLoi', width: 130,
                  render: v => {
                    if (v === 'ThieuHang') return <Tag color="orange">Thiếu hàng</Tag>
                    if (v === 'HangHong') return <Tag color="red">Hàng hỏng</Tag>
                    if (v === 'ThieuVaHong') return <Tag color="volcano">Thiếu & Hỏng</Tag>
                    return '—'
                  },
                },
                { title: 'SL thiếu', dataIndex: 'slThieu', width: 80, align: 'center' },
                { title: 'SL hỏng', dataIndex: 'slHong', width: 80, align: 'center' },
                { title: 'Ghi chú', dataIndex: 'ghiChuLoi' },
              ]} />
          </>
        )}
      </Modal>

      {/* ===== Preview phiếu nhập kho ===== */}
      <Modal
        title={previewModal.phieu && (
          <Space>
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
            <span style={{ fontSize: 17 }}>Phiếu nhập kho — {previewModal.phieu?.maPhieu}</span>
            <Tag color="success">Đã nhập kho</Tag>
          </Space>
        )}
        open={previewModal.open}
        onCancel={() => setPreviewModal({ open: false, phieu: null })}
        footer={[
          <Button key="close" type="primary" onClick={() => setPreviewModal({ open: false, phieu: null })}>Đóng</Button>,
        ]}
        width={650}
      >
        {previewModal.phieu && (() => {
          const p = previewModal.phieu
          const tongTien = p.data.reduce((s, r) => s + (r.donGiaNhap || 0) * r.slThucNhap, 0)
          return (
            <>
              <div style={{ background: 'rgba(82,196,26,0.06)', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid rgba(82,196,26,0.15)' }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text type="secondary">Mã phiếu</Text>
                    <div><Text strong style={{ fontSize: 18, color: '#5b8def' }}>{p.maPhieu}</Text></div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Thời gian nhập</Text>
                    <div><Text strong>{p.thoiGian}</Text></div>
                  </Col>
                </Row>
                <Divider style={{ margin: '12px 0' }} />
                <Row gutter={16}>
                  <Col span={8}>
                    <Text type="secondary">Nhà cung cấp</Text>
                    <div><Text strong>{p.nccTen}</Text></div>
                  </Col>
                  <Col span={8}>
                    <Text type="secondary">SĐT</Text>
                    <div><Text>{p.nccSdt}</Text></div>
                  </Col>
                  <Col span={8}>
                    <Text type="secondary">Số nguyên liệu</Text>
                    <div><Tag color="blue">{p.data.length} NL</Tag></div>
                  </Col>
                </Row>
              </div>

              <Divider orientation="left" style={{ fontSize: 14, margin: '8px 0 12px' }}>Chi tiết nguyên liệu</Divider>
              <Table size="small" pagination={false}
                dataSource={p.data.map(r => ({ ...r, key: r.ma, thanhTien: (r.donGiaNhap || 0) * r.slThucNhap }))}
                columns={[
                  { title: 'Nguyên liệu', dataIndex: 'ten', render: v => <Text strong>{v}</Text> },
                  { title: 'Đơn vị', dataIndex: 'donVi', width: 60, align: 'center' },
                  { title: 'SL nhập', dataIndex: 'slThucNhap', width: 80, align: 'center', render: v => <Tag color="green">{v}</Tag> },
                  { title: 'Đơn giá', dataIndex: 'donGiaNhap', width: 120, align: 'right', render: v => v ? formatVND(v) : '—' },
                  { title: 'Thành tiền', dataIndex: 'thanhTien', width: 130, align: 'right', render: v => <Text strong>{formatVND(v)}</Text> },
                ]}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row style={{ background: 'rgba(91,141,239,0.05)' }}>
                      <Table.Summary.Cell index={0} colSpan={4} align="right">
                        <Text strong style={{ fontSize: 15 }}>TỔNG CỘNG:</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <Text strong style={{ fontSize: 15, color: '#52c41a' }}>{formatVND(tongTien)}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )} />
            </>
          )
        })()}
      </Modal>
    </div>
  )
}
