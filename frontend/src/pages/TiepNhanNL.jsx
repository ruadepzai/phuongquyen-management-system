import { useState } from 'react'
import {
  Tabs, Table, Card, Tag, Space, Typography, Collapse,
  Input, Select, Statistic, Row, Col, Tooltip, Empty,
  Modal, Form, Button, message, Divider, InputNumber, Popconfirm, DatePicker
} from 'antd'
import {
  CalendarOutlined, CheckCircleOutlined,
  CaretRightOutlined, ImportOutlined, WarningOutlined,
  EyeOutlined, ExperimentOutlined, PlusOutlined, MinusCircleOutlined,
  EditOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text } = Typography

function formatVND(v) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)
}

// Làm tròn số thập phân tránh lỗi floating point
function roundNum(v) {
  return parseFloat(Number(v).toFixed(4))
}

const glassCard = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }
const statCard = (color) => ({
  background: `linear-gradient(135deg, ${color}22, ${color}08)`,
  border: `1px solid ${color}30`, borderRadius: 14, padding: '16px 20px',
})

// Mock phiếu đặt hàng
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

  // Modal kiểm hàng
  const [kiemHangModal, setKiemHangModal] = useState({ open: false, phieu: null })
  const [kiemHangRows, setKiemHangRows] = useState({}) // { maNL: slNhan }

  // Phiếu báo lỗi
  const [dsPhieuLoi, setDsPhieuLoi] = useState([])
  const [pblModalOpen, setPblModalOpen] = useState(false)
  const [pblContext, setPblContext] = useState(null)
  const [pblDetailVisible, setPblDetailVisible] = useState(false)
  const [pblDetailData, setPblDetailData] = useState(null)
  const [pblRows, setPblRows] = useState([])
  // Bộ lọc ngày
  const [filterDate, setFilterDate] = useState(null)
  // Preview phiếu nhập kho
  const [previewModal, setPreviewModal] = useState({ open: false, phieu: null })

  // ===== MỞ MODAL KIỂM HÀNG =====
  const handleBatDauKiem = (phieu) => {
    // Init rows với SL đặt làm default
    const rows = {}
    phieu.data.forEach(r => { rows[r.ma] = r.slThucNhap })
    setKiemHangRows(rows)
    setKiemHangModal({ open: true, phieu })
  }

  // ===== XÁC NHẬN TỪ MODAL KIỂM HÀNG =====
  const handleXacNhanKiemHang = () => {
    const phieu = kiemHangModal.phieu
    if (!phieu) return

    const hasError = phieu.data.some(r => {
      const actual = kiemHangRows[r.ma] ?? r.slThucNhap
      return actual !== r.slThucNhap
    })

    if (hasError) {
      // Có chênh lệch → mở PBL modal
      const loiItems = phieu.data.filter(r => (kiemHangRows[r.ma] ?? r.slThucNhap) !== r.slThucNhap)
        .map(r => ({
          ...r,
          slNhan: kiemHangRows[r.ma] ?? r.slThucNhap,
          chenhLech: roundNum(r.slThucNhap - (kiemHangRows[r.ma] ?? r.slThucNhap)),
        }))
      setPblContext({ maPhieu: phieu.maPhieu, nccTen: phieu.nccTen, items: loiItems })
      setPblRows(loiItems.map(it => ({
        nguyenLieu: it.ma, loaiLoi: '', soLuong: null, ghiChu: '',
      })))
      setKiemHangModal({ open: false, phieu: null })
      setPblModalOpen(true)
    } else {
      // Khớp 100% → đóng modal kiểm → hiện preview
      setTiepNhanData(prev => ({ ...prev, [phieu.maPhieu]: { status: 'DaNhapKho' } }))
      setLichSuPhieu(prev => prev.map(p => p.maPhieu === phieu.maPhieu ? { ...p, trangThai: 'HoanThanh' } : p))
      message.success('Khớp 100%! Đã xác nhận nhập kho.')
      setKiemHangModal({ open: false, phieu: null })
      setPreviewModal({ open: true, phieu })
    }
  }

  // ===== BÁO LỖI TỪ MODAL KIỂM HÀNG =====
  const handleBaoLoiFromKiem = () => {
    const phieu = kiemHangModal.phieu
    if (!phieu) return

    // Tính chênh lệch dựa trên SL đã nhập
    const loiItems = phieu.data.filter(r => {
      const actual = kiemHangRows[r.ma] ?? r.slThucNhap
      return actual !== r.slThucNhap
    }).map(r => ({
      ...r,
      slNhan: kiemHangRows[r.ma] ?? r.slThucNhap,
      chenhLech: roundNum(r.slThucNhap - (kiemHangRows[r.ma] ?? r.slThucNhap)),
    }))

    if (loiItems.length === 0) {
      message.info('Không có chênh lệch nào để báo lỗi. Hãy điều chỉnh SL thực nhận trước.')
      return
    }

    setPblContext({ maPhieu: phieu.maPhieu, nccTen: phieu.nccTen, items: loiItems })
    setPblRows(loiItems.map(it => ({
      nguyenLieu: it.ma, loaiLoi: '', soLuong: null, ghiChu: '',
    })))
    setKiemHangModal({ open: false, phieu: null })
    setPblModalOpen(true)
  }

  // ===== PHIẾU BÁO LỖI — ROW-BASED =====
  const loaiLoiOptions = [
    { value: 'ThieuHang', label: 'Thiếu hàng' },
    { value: 'HangHong', label: 'Hàng hỏng' },
    { value: 'LoiKhac', label: 'Lỗi khác' },
  ]

  const handleAddPblRow = () => {
    setPblRows(prev => [...prev, { nguyenLieu: '', loaiLoi: '', soLuong: null, ghiChu: '' }])
  }

  const handleRemovePblRow = (idx) => {
    setPblRows(prev => prev.filter((_, i) => i !== idx))
  }

  const handlePblRowChange = (idx, field, value) => {
    setPblRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }

  const handleXacNhanPBL = () => {
    if (!pblRows.length) {
      message.warning('Vui lòng thêm ít nhất 1 dòng lỗi!')
      return
    }
    let valid = true
    for (let i = 0; i < pblRows.length; i++) {
      const row = pblRows[i]
      if (!row.nguyenLieu) { valid = false; break }
      if (!row.loaiLoi) { valid = false; break }
      if (!row.soLuong || row.soLuong <= 0) { valid = false; break }
      const item = pblContext.items.find(it => it.ma === row.nguyenLieu)
      if (item) {
        const maxSL = Math.abs(item.chenhLech)
        const tongSLCungNL = pblRows
          .filter(r => r.nguyenLieu === row.nguyenLieu)
          .reduce((s, r) => s + (r.soLuong || 0), 0)
        if (tongSLCungNL > maxSL) {
          message.error(`${item.ten}: Tổng SL lỗi (${roundNum(tongSLCungNL)}) vượt quá chênh lệch (${roundNum(maxSL)})!`)
          return
        }
      }
    }
    if (!valid) {
      message.warning('Vui lòng chọn nguyên liệu, loại lỗi và nhập số lượng hợp lệ!')
      return
    }

    const maLoi = 'PBL' + String(dsPhieuLoi.length + 1).padStart(3, '0')
    const items = pblRows.map(row => {
      const item = pblContext.items.find(it => it.ma === row.nguyenLieu)
      return {
        ma: row.nguyenLieu,
        ten: item?.ten || '',
        donVi: item?.donVi || '',
        slThucNhap: item?.slThucNhap || 0,
        chenhLech: item?.chenhLech || 0,
        loaiLoi: row.loaiLoi,
        soLuong: roundNum(row.soLuong),
        ghiChuLoi: row.ghiChu,
      }
    })
    setDsPhieuLoi(prev => [...prev, {
      key: maLoi, maLoi, maPhieu: pblContext.maPhieu, nccTen: pblContext.nccTen,
      ngay: dayjs().format('DD/MM/YYYY HH:mm'), items, trangThai: 'ChoXuLy',
    }])
    setTiepNhanData(prev => ({ ...prev, [pblContext.maPhieu]: { status: 'CoLoi' } }))
    message.warning(`Đã tạo phiếu báo lỗi ${maLoi}`)
    setPblModalOpen(false)
    setPblRows([])
  }

  const handleXuLyPBL = (maLoi) => {
    const pbl = dsPhieuLoi.find(p => p.maLoi === maLoi)
    setDsPhieuLoi(prev => prev.map(p => p.maLoi === maLoi ? { ...p, trangThai: 'DaXuLy' } : p))
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
                                    { title: 'SL đặt', dataIndex: 'slThucNhap', width: 90, align: 'center', render: v => <Tag color="blue">{roundNum(v)}</Tag> },
                                    { title: 'Đơn giá', dataIndex: 'donGiaNhap', width: 120, align: 'right', render: v => v ? formatVND(v) : '—' },
                                  ]} />

                                {tn.status === 'ChuaNhan' && (
                                  <div style={{ textAlign: 'center' }}>
                                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleBatDauKiem(phieu)} style={{ borderRadius: 12 }}>Bắt đầu kiểm hàng</Button>
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

      {/* ===== Modal Kiểm hàng (giống preview nhưng có input) ===== */}
      <Modal
        title={kiemHangModal.phieu && (
          <Space>
            <EditOutlined style={{ color: '#5b8def', fontSize: 20 }} />
            <span style={{ fontSize: 17 }}>Kiểm hàng — {kiemHangModal.phieu?.maPhieu}</span>
            <Tag color="processing">Đang đối chiếu</Tag>
          </Space>
        )}
        open={kiemHangModal.open}
        onCancel={() => setKiemHangModal({ open: false, phieu: null })}
        width={700}
        footer={[
          <Button key="cancel" onClick={() => setKiemHangModal({ open: false, phieu: null })}>Hủy</Button>,
          <Button key="baoloi" danger icon={<WarningOutlined />} onClick={handleBaoLoiFromKiem}>Báo lỗi</Button>,
          <Button key="ok" type="primary" icon={<CheckCircleOutlined />} onClick={handleXacNhanKiemHang}>Xác nhận nhập kho</Button>,
        ]}
      >
        {kiemHangModal.phieu && (() => {
          const p = kiemHangModal.phieu
          return (
            <>
              {/* Header info giống preview */}
              <div style={{ background: 'rgba(91,141,239,0.06)', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid rgba(91,141,239,0.15)' }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text type="secondary">Mã phiếu</Text>
                    <div><Text strong style={{ fontSize: 18, color: '#5b8def' }}>{p.maPhieu}</Text></div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Thời gian tạo</Text>
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

              <Divider orientation="left" style={{ fontSize: 14, margin: '8px 0 12px' }}>Đối chiếu nguyên liệu</Divider>
              <Table size="small" pagination={false}
                dataSource={p.data.map(r => ({ ...r, key: r.ma }))}
                columns={[
                  { title: 'Nguyên liệu', dataIndex: 'ten', render: v => <Text strong>{v}</Text> },
                  { title: 'Đơn vị', dataIndex: 'donVi', width: 65, align: 'center' },
                  { title: 'SL đặt', dataIndex: 'slThucNhap', width: 85, align: 'center', render: v => <Tag color="blue">{roundNum(v)}</Tag> },
                  { title: 'Đơn giá', dataIndex: 'donGiaNhap', width: 120, align: 'right', render: v => v ? formatVND(v) : '—' },
                  {
                    title: 'SL thực nhận', width: 130, align: 'center',
                    render: (_, r) => (
                      <InputNumber
                        size="small"
                        style={{ width: 100 }}
                        min={0}
                        step={0.1}
                        value={kiemHangRows[r.ma] ?? r.slThucNhap}
                        onChange={val => setKiemHangRows(prev => ({ ...prev, [r.ma]: val ?? 0 }))}
                      />
                    ),
                  },
                  {
                    title: 'Chênh lệch', width: 100, align: 'center',
                    render: (_, r) => {
                      const actual = kiemHangRows[r.ma] ?? r.slThucNhap
                      const diff = roundNum(r.slThucNhap - actual)
                      if (diff === 0) return <Tag color="success">Khớp</Tag>
                      return <Tag color="red">{diff > 0 ? `-${diff}` : `+${Math.abs(diff)}`}</Tag>
                    },
                  },
                ]} />

              <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(250,173,20,0.06)', borderRadius: 8, border: '1px solid rgba(250,173,20,0.15)' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  💡 Nhập SL thực nhận cho từng nguyên liệu. Nếu khớp 100% → nhập kho luôn. Nếu có chênh lệch → hệ thống sẽ yêu cầu lập phiếu báo lỗi.
                </Text>
              </div>
            </>
          )
        })()}
      </Modal>

      {/* ===== Modal tạo phiếu báo lỗi — dạng thêm dòng ===== */}
      <Modal title="Lập phiếu báo lỗi" open={pblModalOpen} width={750}
        onOk={handleXacNhanPBL} onCancel={() => { setPblModalOpen(false); setPblRows([]) }}
        okText="Xác nhận phiếu báo lỗi" cancelText="Hủy">
        {pblContext && (
          <div style={{ marginTop: 12 }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
              Phiếu đặt: <Text strong>{pblContext.maPhieu}</Text> — NCC: <Text strong>{pblContext.nccTen}</Text>
            </Text>

            {/* Tóm tắt chênh lệch */}
            <div style={{ background: 'rgba(255,77,79,0.04)', border: '1px solid rgba(255,77,79,0.15)', borderRadius: 10, padding: '8px 14px', marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Nguyên liệu có chênh lệch:</Text>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                {pblContext.items.map(it => (
                  <Tag key={it.ma} color="red">{it.ten} ({it.donVi}) — chênh lệch: {roundNum(Math.abs(it.chenhLech))}</Tag>
                ))}
              </div>
            </div>

            <Divider orientation="left" style={{ margin: '8px 0 16px', fontSize: 13 }}>Danh sách lỗi</Divider>

            {pblRows.map((row, idx) => {
              const selectedItem = pblContext.items.find(it => it.ma === row.nguyenLieu)
              const maxSL = selectedItem ? roundNum(Math.abs(selectedItem.chenhLech)) : 999
              return (
                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
                  <Select
                    placeholder="Nguyên liệu"
                    style={{ width: 160 }}
                    value={row.nguyenLieu || undefined}
                    onChange={v => handlePblRowChange(idx, 'nguyenLieu', v)}
                    options={pblContext.items.map(it => ({
                      value: it.ma,
                      label: `${it.ten} (${it.donVi})`,
                    }))}
                  />
                  <Select
                    placeholder="Loại lỗi"
                    style={{ width: 140 }}
                    value={row.loaiLoi || undefined}
                    onChange={v => handlePblRowChange(idx, 'loaiLoi', v)}
                    options={loaiLoiOptions}
                  />
                  <InputNumber
                    placeholder="Số lượng"
                    style={{ width: 110 }}
                    min={0.01}
                    max={maxSL}
                    step={0.1}
                    value={row.soLuong}
                    onChange={v => handlePblRowChange(idx, 'soLuong', v)}
                  />
                  <Input
                    placeholder="Ghi chú..."
                    style={{ flex: 1 }}
                    value={row.ghiChu}
                    onChange={e => handlePblRowChange(idx, 'ghiChu', e.target.value)}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={() => handleRemovePblRow(idx)}
                    style={{ marginTop: 4 }}
                  />
                </div>
              )
            })}

            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddPblRow}
              style={{ width: '100%', borderRadius: 10, marginTop: 4 }}>
              Thêm dòng lỗi
            </Button>
          </div>
        )}
      </Modal>

      {/* ===== Modal chi tiết PBL ===== */}
      <Modal title={pblDetailData && `Chi tiết phiếu ${pblDetailData.maLoi}`} open={pblDetailVisible}
        onCancel={() => setPblDetailVisible(false)} footer={null} width={700}>
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
                { title: 'Đơn vị', dataIndex: 'donVi', width: 70, align: 'center' },
                {
                  title: 'Loại lỗi', dataIndex: 'loaiLoi', width: 130,
                  render: v => {
                    if (v === 'ThieuHang') return <Tag color="orange">Thiếu hàng</Tag>
                    if (v === 'HangHong') return <Tag color="red">Hàng hỏng</Tag>
                    if (v === 'LoiKhac') return <Tag color="purple">Lỗi khác</Tag>
                    return '—'
                  },
                },
                { title: 'Số lượng', dataIndex: 'soLuong', width: 90, align: 'center', render: v => <Text strong style={{ color: '#ff4d4f' }}>{roundNum(v)}</Text> },
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
                  { title: 'SL nhập', dataIndex: 'slThucNhap', width: 80, align: 'center', render: v => <Tag color="green">{roundNum(v)}</Tag> },
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
