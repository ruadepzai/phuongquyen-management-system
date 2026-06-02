import { useState, useMemo } from 'react'
import {
  Tabs, Table, Card, Tag, Space, Typography, Collapse,
  Input, Select, Statistic, Row, Col, Tooltip, Badge, Empty,
  Modal, Form, Button, message, Divider, InputNumber, Popconfirm, DatePicker
} from 'antd'
import {
  ShoppingCartOutlined, CalendarOutlined, SearchOutlined,
  InboxOutlined, TeamOutlined, CheckCircleOutlined,
  ExperimentOutlined, BarChartOutlined, CaretRightOutlined, PlusOutlined,
  PhoneOutlined, EnvironmentOutlined, PrinterOutlined, HistoryOutlined,
  FileTextOutlined, SaveOutlined, ImportOutlined, WarningOutlined,
  EditOutlined, DeleteOutlined, EyeOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text } = Typography

function formatVND(v) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)
}

// ==================== MOCK DATA ====================
const initNguyenLieu = [
  { ma: 'NL01', ten: 'Thịt lợn', donVi: 'kg', ncc: ['NCC01', 'NCC05'] },
  { ma: 'NL02', ten: 'Thịt gà', donVi: 'kg', ncc: ['NCC01', 'NCC05'] },
  { ma: 'NL03', ten: 'Tôm sú', donVi: 'kg', ncc: ['NCC02'] },
  { ma: 'NL04', ten: 'Cá chép', donVi: 'kg', ncc: ['NCC02', 'NCC06'] },
  { ma: 'NL05', ten: 'Rau muống', donVi: 'bó', ncc: ['NCC03'] },
  { ma: 'NL06', ten: 'Hành lá', donVi: 'bó', ncc: ['NCC03'] },
  { ma: 'NL07', ten: 'Gạo nếp', donVi: 'kg', ncc: ['NCC04'] },
  { ma: 'NL08', ten: 'Nấm hương', donVi: 'kg', ncc: ['NCC03', 'NCC04'] },
  { ma: 'NL09', ten: 'Miến dong', donVi: 'kg', ncc: ['NCC04'] },
  { ma: 'NL10', ten: 'Giò lụa', donVi: 'kg', ncc: ['NCC01'] },
  { ma: 'NL11', ten: 'Trứng gà', donVi: 'quả', ncc: ['NCC04', 'NCC03'] },
  { ma: 'NL12', ten: 'Đậu phụ', donVi: 'bìa', ncc: ['NCC04', 'NCC03'] },
]

const initNCC = [
  { ma: 'NCC01', ten: 'Anh Tuấn', sdt: '0901111222', diaChi: 'Chợ Đồng Xuân', nhom: 'Thịt & Chả', congNo: 2500000 },
  { ma: 'NCC02', ten: 'Chị Hoa', sdt: '0912333444', diaChi: 'Chợ Long Biên', nhom: 'Hải sản', congNo: 0 },
  { ma: 'NCC03', ten: 'Bác Hùng', sdt: '0987555666', diaChi: 'Chợ Minh Khai', nhom: 'Rau củ & Nấm', congNo: 800000 },
  { ma: 'NCC04', ten: 'Cô Lan', sdt: '0976777888', diaChi: 'Chợ Hàng Da', nhom: 'Khô & Gia vị', congNo: 0 },
  { ma: 'NCC05', ten: 'Anh Bình', sdt: '0933999000', diaChi: 'Chợ Thành Công', nhom: 'Thịt tươi sống', congNo: 1200000 },
  { ma: 'NCC06', ten: 'Chú Dũng', sdt: '0944222333', diaChi: 'Chợ cá Yên Sở', nhom: 'Cá nước ngọt', congNo: 500000 },
]

// Đơn hàng theo ngày — chỉ giữ hôm nay + tương lai
const today = dayjs().format('YYYY-MM-DD')
const mockDonHangTheoNgay = {
  [today]: [
    { maDon: 'DH001', khach: 'Anh Minh', soMam: 10, diaChi: 'Cầu Giấy', trangThai: 'DaChot',
      monAn: [
        { ten: 'Gà luộc lá chanh', nl: [{ ma: 'NL02', sl: 0.5 }, { ma: 'NL06', sl: 0.1 }] },
        { ten: 'Nem rán', nl: [{ ma: 'NL01', sl: 0.3 }, { ma: 'NL09', sl: 0.1 }, { ma: 'NL11', sl: 2 }] },
      ]
    },
  ],
  [dayjs().add(1, 'day').format('YYYY-MM-DD')]: [
    { maDon: 'DH002', khach: 'Chị Hương', soMam: 15, diaChi: 'Thanh Xuân', trangThai: 'DaChot',
      monAn: [
        { ten: 'Tôm hấp bia', nl: [{ ma: 'NL03', sl: 0.4 }] },
        { ten: 'Thịt lợn quay', nl: [{ ma: 'NL01', sl: 0.6 }] },
        { ten: 'Cá chép om dưa', nl: [{ ma: 'NL04', sl: 0.5 }] },
      ]
    },
    { maDon: 'DH003', khach: 'Anh Tuấn', soMam: 8, diaChi: 'Hoàng Mai', trangThai: 'DaChot',
      monAn: [
        { ten: 'Gà luộc', nl: [{ ma: 'NL02', sl: 0.5 }, { ma: 'NL06', sl: 0.1 }] },
        { ten: 'Tôm hấp', nl: [{ ma: 'NL03', sl: 0.4 }] },
      ]
    },
  ],
  [dayjs().add(2, 'day').format('YYYY-MM-DD')]: [
    { maDon: 'DH004', khach: 'Bác Thành', soMam: 20, diaChi: 'Ba Đình', trangThai: 'DaChot',
      monAn: [
        { ten: 'Gà luộc', nl: [{ ma: 'NL02', sl: 0.5 }, { ma: 'NL06', sl: 0.1 }] },
        { ten: 'Thịt lợn quay', nl: [{ ma: 'NL01', sl: 0.6 }] },
        { ten: 'Xôi gấc', nl: [{ ma: 'NL07', sl: 0.4 }] },
        { ten: 'Giò lụa', nl: [{ ma: 'NL10', sl: 0.2 }] },
      ]
    },
    { maDon: 'DH005', khach: 'Cô Nga', soMam: 12, diaChi: 'Đống Đa', trangThai: 'DaChot',
      monAn: [
        { ten: 'Cá chép om dưa', nl: [{ ma: 'NL04', sl: 0.5 }] },
        { ten: 'Nem rán', nl: [{ ma: 'NL01', sl: 0.3 }, { ma: 'NL09', sl: 0.1 }, { ma: 'NL11', sl: 2 }] },
      ]
    },
  ],
}

// ==================== HELPER ====================
function tinhDuTru(donHangs, nlList, nccList) {
  const map = {}
  donHangs.forEach(don => {
    don.monAn.forEach(mon => {
      mon.nl.forEach(nl => {
        if (!map[nl.ma]) map[nl.ma] = { tongSL: 0, chiTiet: [] }
        const slCan = nl.sl * don.soMam
        map[nl.ma].tongSL += slCan
        const exist = map[nl.ma].chiTiet.find(c => c.maDon === don.maDon)
        if (exist) exist.sl += slCan
        else map[nl.ma].chiTiet.push({ maDon: don.maDon, khach: don.khach, soMam: don.soMam, sl: slCan })
      })
    })
  })
  return Object.entries(map).map(([ma, v]) => {
    const info = nlList.find(n => n.ma === ma)
    const nccIds = info?.ncc || []
    const nccObjs = nccIds.map(id => nccList.find(n => n.ma === id)).filter(Boolean)
    return {
      key: ma, ma, ten: info?.ten || ma, donVi: info?.donVi || '',
      tongSL: Math.round(v.tongSL * 100) / 100,
      nccList: nccObjs, chiTiet: v.chiTiet,
    }
  }).sort((a, b) => b.tongSL - a.tongSL)
}

// ==================== STYLES ====================
const glassCard = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }
const statCard = (color) => ({
  background: `linear-gradient(135deg, ${color}22, ${color}08)`,
  border: `1px solid ${color}30`, borderRadius: 14, padding: '16px 20px',
})

// ==================== COMPONENT ====================
export default function NguyenLieu() {
  const [searchText, setSearchText] = useState('')
  const [nguyenLieuList, setNguyenLieuList] = useState(initNguyenLieu)
  const [nccList, setNccList] = useState(initNCC)

  // NL CRUD
  const [nlModalOpen, setNlModalOpen] = useState(false)
  const [editingNL, setEditingNL] = useState(null)
  const [nlForm] = Form.useForm()

  // NCC CRUD
  const [nccModalOpen, setNccModalOpen] = useState(false)
  const [editingNCC, setEditingNCC] = useState(null)
  const [nccForm] = Form.useForm()

  // Dự trù
  const [duTruState, setDuTruState] = useState({})
  const [lichSuPhieu, setLichSuPhieu] = useState([])
  const [filterDuTruDate, setFilterDuTruDate] = useState(null)

  // Nhóm hàng NCC - cho phép thêm mới
  const [nhomHangList, setNhomHangList] = useState([
    'Thịt & Chả', 'Hải sản', 'Rau củ & Nấm', 'Khô & Gia vị', 'Thịt tươi sống', 'Cá nước ngọt',
  ])
  const [newNhomHang, setNewNhomHang] = useState('')
  // Preview phiếu dự trù
  const [duTruPreview, setDuTruPreview] = useState({ open: false, phieus: [] })



  // ===== NL CRUD =====
  const openNlModal = (record = null) => {
    setEditingNL(record)
    if (record) nlForm.setFieldsValue(record)
    else nlForm.resetFields()
    setNlModalOpen(true)
  }
  const handleSaveNL = () => {
    nlForm.validateFields().then(vals => {
      if (editingNL) {
        setNguyenLieuList(prev => prev.map(n => n.ma === editingNL.ma ? { ...n, ...vals } : n))
        message.success('Đã cập nhật nguyên liệu!')
      } else {
        const newMa = 'NL' + String(nguyenLieuList.length + 1).padStart(2, '0')
        setNguyenLieuList(prev => [...prev, { ma: newMa, ...vals, ncc: vals.ncc || [] }])
        message.success('Đã thêm nguyên liệu!')
      }
      setNlModalOpen(false)
    })
  }
  const handleDeleteNL = (ma) => {
    setNguyenLieuList(prev => prev.filter(n => n.ma !== ma))
    message.success('Đã xóa nguyên liệu!')
  }

  // ===== NCC CRUD =====
  const openNccModal = (record = null) => {
    setEditingNCC(record)
    if (record) nccForm.setFieldsValue(record)
    else nccForm.resetFields()
    setNccModalOpen(true)
  }
  const handleSaveNCC = () => {
    nccForm.validateFields().then(vals => {
      if (editingNCC) {
        setNccList(prev => prev.map(n => n.ma === editingNCC.ma ? { ...n, ...vals } : n))
        message.success('Đã cập nhật NCC!')
      } else {
        const newMa = 'NCC' + String(nccList.length + 1).padStart(2, '0')
        setNccList(prev => [...prev, { ma: newMa, ...vals, congNo: vals.congNo || 0 }])
        message.success('Đã thêm NCC!')
      }
      setNccModalOpen(false)
    })
  }
  const handleDeleteNCC = (ma) => {
    setNccList(prev => prev.filter(n => n.ma !== ma))
    message.success('Đã xóa NCC!')
  }

  // ===== DỰ TRÙ =====
  const allDates = Object.keys(mockDonHangTheoNgay).sort()
  const allDonHangs = Object.values(mockDonHangTheoNgay).flat()
  const tongDuTru = useMemo(() => tinhDuTru(allDonHangs, nguyenLieuList, nccList), [nguyenLieuList, nccList])

  const handleTinhDuTru = (dateStr) => {
    const dons = mockDonHangTheoNgay[dateStr]
    if (!dons?.length) { Modal.error({ title: 'Không có đơn hàng', content: `Ngày ${dayjs(dateStr).format('DD/MM/YYYY')} chưa có đơn nào.` }); return }
    const result = tinhDuTru(dons, nguyenLieuList, nccList)
    const dataWithEdit = result.map(r => ({ ...r, slThucNhap: r.tongSL, nccChon: r.nccList[0]?.ma || '', ghiChu: '', donGiaNhap: 0 }))
    setDuTruState(prev => ({ ...prev, [dateStr]: { status: 'DangDuTru', data: dataWithEdit } }))
    message.info(`Đã tính dự trù cho ngày ${dayjs(dateStr).format('DD/MM/YYYY')}`)
  }

  const handleUpdateRow = (dateStr, maNL, field, value) => {
    setDuTruState(prev => {
      const state = { ...prev[dateStr] }
      state.data = state.data.map(r => r.ma === maNL ? { ...r, [field]: value } : r)
      return { ...prev, [dateStr]: state }
    })
  }

  // Tạo phiếu đặt → tách theo NCC
  const handleTaoPhieu = (dateStr) => {
    const state = duTruState[dateStr]
    // Gom NL theo NCC
    const nccGroups = {}
    state.data.forEach(r => {
      const nccMa = r.nccChon || 'UNKNOWN'
      if (!nccGroups[nccMa]) nccGroups[nccMa] = []
      nccGroups[nccMa].push(r)
    })
    const newPhieus = Object.entries(nccGroups).map(([nccMa, items], idx) => {
      const nccInfo = nccList.find(n => n.ma === nccMa)
      const maPhieu = `PDH${String(lichSuPhieu.length + idx + 1).padStart(3, '0')}`
      return {
        key: maPhieu, maPhieu, ngay: dateStr,
        thoiGian: dayjs().format('DD/MM/YYYY HH:mm'),
        nccMa, nccTen: nccInfo?.ten || '—', nccSdt: nccInfo?.sdt || '',
        soNL: items.length, data: items, trangThai: 'ChoGiaoHang',
      }
    })
    setLichSuPhieu(prev => [...prev, ...newPhieus])
    setDuTruState(prev => ({ ...prev, [dateStr]: { ...prev[dateStr], status: 'DaLuu' } }))
    message.success(`Đã tạo ${newPhieus.length} phiếu đặt hàng (theo NCC) cho ngày ${dayjs(dateStr).format('DD/MM/YYYY')}!`)
    setDuTruPreview({ open: true, phieus: newPhieus })
  }

  // ===== TIẾP NHẬN =====


  // ===== FILTERED DATA =====
  const filteredNL = nguyenLieuList.filter(n =>
    n.ten.toLowerCase().includes(searchText.toLowerCase()) || n.ma.toLowerCase().includes(searchText.toLowerCase())
  )

  const tongDon = allDonHangs.length
  const tongMam = allDonHangs.reduce((s, d) => s + d.soMam, 0)

  // ============================================================
  // TAB ITEMS
  // ============================================================
  const tabItems = [
    // ===== TAB 1: Danh sách Nguyên liệu =====
    {
      key: 'nguyenlieu',
      label: <span><ExperimentOutlined style={{ marginRight: 6 }} />Nguyên liệu</span>,
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card style={glassCard} extra={
            <Space>
              <Input placeholder="Tìm nguyên liệu..." prefix={<SearchOutlined />} style={{ width: 220 }} allowClear
                onChange={e => setSearchText(e.target.value)} value={searchText} />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openNlModal()}>Thêm NL</Button>
            </Space>
          }>
            <Table columns={[
              { title: 'Mã', dataIndex: 'ma', width: 80, render: v => <Text code style={{ fontSize: 12 }}>{v}</Text> },
              { title: 'Tên nguyên liệu', dataIndex: 'ten', render: v => <Text strong>{v}</Text> },
              { title: 'Đơn vị', dataIndex: 'donVi', width: 80, align: 'center' },
              {
                title: 'Nhà cung cấp', dataIndex: 'ncc', width: 320,
                render: (ids) => <Space wrap size={[4, 4]}>{ids.map(id => {
                  const ncc = nccList.find(n => n.ma === id)
                  return ncc ? <Tooltip key={id} title={`${ncc.sdt} — ${ncc.diaChi}`}><Tag color="geekblue" style={{ borderRadius: 6 }}>{ncc.ten}</Tag></Tooltip> : null
                })}</Space>,
              },
              {
                title: 'Thao tác', width: 100, align: 'center',
                render: (_, r) => (
                  <Space>
                    <Tooltip title="Sửa"><Button type="text" icon={<EditOutlined />} onClick={() => openNlModal(r)} /></Tooltip>
                    <Popconfirm title="Xóa nguyên liệu này?" onConfirm={() => handleDeleteNL(r.ma)} okText="Xóa" cancelText="Hủy">
                      <Tooltip title="Xóa"><Button type="text" danger icon={<DeleteOutlined />} /></Tooltip>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]} dataSource={filteredNL.map(n => ({ ...n, key: n.ma }))} pagination={false} size="middle" />
          </Card>
        </div>
      ),
    },

    // ===== TAB 2: Nhà cung cấp =====
    {
      key: 'nhacungcap',
      label: <span><TeamOutlined style={{ marginRight: 6 }} />Nhà cung cấp</span>,
      children: (
        <Card style={glassCard} extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openNccModal()}>Thêm NCC</Button>}>
          <Table columns={[
            { title: 'Mã', dataIndex: 'ma', width: 80, render: v => <Text code>{v}</Text> },
            { title: 'Người liên hệ', dataIndex: 'ten', render: v => <Text strong>{v}</Text> },
            { title: 'Nhóm hàng', dataIndex: 'nhom', render: v => <Tag color="blue">{v}</Tag> },
            { title: 'SĐT', dataIndex: 'sdt', width: 130, render: v => <span><PhoneOutlined style={{ marginRight: 4 }} />{v}</span> },
            { title: 'Địa chỉ', dataIndex: 'diaChi', render: v => <span><EnvironmentOutlined style={{ marginRight: 4 }} />{v}</span> },
            {
              title: 'Công nợ', dataIndex: 'congNo', width: 140, align: 'right',
              render: v => v > 0 ? <Text strong style={{ color: '#ff4d4f' }}>{formatVND(v)}</Text> : <Tag color="success">Hết nợ</Tag>,
              sorter: (a, b) => a.congNo - b.congNo,
            },
            {
              title: 'Thao tác', width: 100, align: 'center',
              render: (_, r) => (
                <Space>
                  <Tooltip title="Sửa"><Button type="text" icon={<EditOutlined />} onClick={() => openNccModal(r)} /></Tooltip>
                  <Popconfirm title="Xóa NCC này?" onConfirm={() => handleDeleteNCC(r.ma)} okText="Xóa" cancelText="Hủy">
                    <Tooltip title="Xóa"><Button type="text" danger icon={<DeleteOutlined />} /></Tooltip>
                  </Popconfirm>
                </Space>
              ),
            },
          ]} dataSource={nccList.map(n => ({ ...n, key: n.ma }))} pagination={false} size="middle" />
        </Card>
      ),
    },

    // ===== TAB 3: Dự trù theo ngày =====
    {
      key: 'dutru',
      label: <span><CalendarOutlined style={{ marginRight: 6 }} />Dự trù theo ngày</span>,
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card style={glassCard} styles={{ body: { padding: '12px 16px' } }}>
            <Space>
              <Text type="secondary">Lọc ngày:</Text>
              <DatePicker
                placeholder="Tất cả ngày"
                onChange={(date) => setFilterDuTruDate(date ? date.format('YYYY-MM-DD') : null)}
                allowClear style={{ borderRadius: 10, width: 160 }} />
            </Space>
          </Card>
          <Card style={glassCard} styles={{ body: { padding: 12 } }}>
            <Collapse
              items={(filterDuTruDate ? allDates.filter(d => d === filterDuTruDate) : allDates).map(dateStr => {
                const dons = mockDonHangTheoNgay[dateStr]
                const tongMamNgay = dons.reduce((s, d) => s + d.soMam, 0)
                const state = duTruState[dateStr] || { status: 'ChuaTinh', data: [] }
                const isEditable = state.status === 'DangDuTru'

                return {
                  key: dateStr,
                  label: (
                    <Space size={16}>
                      <Text strong style={{ fontSize: 15, color: '#5b8def' }}><CalendarOutlined style={{ marginRight: 6 }} />{dayjs(dateStr).format('DD/MM/YYYY')}</Text>
                      <Tag color="blue">{dons.length} đơn</Tag>
                      <Tag color="green">{tongMamNgay} mâm</Tag>
                      {state.status === 'DaLuu' && <Tag color="success" icon={<CheckCircleOutlined />}>Đã tạo phiếu</Tag>}
                      {isEditable && <Tag color="warning" icon={<ExperimentOutlined />}>Đang nhập</Tag>}
                    </Space>
                  ),
                  children: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {/* Đơn hàng cards */}
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {dons.map(don => (
                          <div key={don.maDon} style={{ background: 'rgba(91,141,239,0.06)', border: '1px solid rgba(91,141,239,0.15)', borderRadius: 12, padding: '12px 16px', minWidth: 240, flex: '1 1 240px' }}>
                            <Space direction="vertical" size={4} style={{ width: '100%' }}>
                              <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                                <Text strong style={{ color: '#5b8def' }}>{don.maDon}</Text>
                                <Tag color="green" style={{ borderRadius: 6 }}>Đã chốt</Tag>
                              </Space>
                              <Text>{don.khach}</Text>
                              <Space><Tag>{don.soMam} mâm</Tag><Text type="secondary" style={{ fontSize: 12 }}>{don.diaChi}</Text></Space>
                              <Text type="secondary" style={{ fontSize: 11 }}>{don.monAn.map(m => m.ten).join(' • ')}</Text>
                            </Space>
                          </div>
                        ))}
                      </div>

                      {state.status === 'ChuaTinh' && (
                        <div style={{ textAlign: 'center', padding: 20 }}>
                          <Button type="primary" size="large" icon={<ExperimentOutlined />}
                            onClick={(e) => { e.stopPropagation(); handleTinhDuTru(dateStr) }}
                            style={{ borderRadius: 12, height: 48, paddingInline: 32 }}>Tính dự trù nguyên liệu</Button>
                        </div>
                      )}

                      {state.status !== 'ChuaTinh' && (
                        <Table size="small" pagination={false} dataSource={state.data}
                          columns={[
                            { title: 'Nguyên liệu', dataIndex: 'ten', width: 140, render: v => <Text strong>{v}</Text> },
                            { title: 'Đơn vị', dataIndex: 'donVi', width: 60, align: 'center' },
                            { title: 'SL Đề xuất', dataIndex: 'tongSL', width: 100, align: 'center', render: v => <Tag color="blue" style={{ borderRadius: 8 }}>{v}</Tag> },
                            {
                              title: 'SL Đặt', dataIndex: 'slThucNhap', width: 120, align: 'center',
                              render: (v, r) => state.status === 'DaLuu'
                                ? <Tag color="red" style={{ fontWeight: 700, borderRadius: 8 }}>{v} {r.donVi}</Tag>
                                : <Input type="number" value={v} size="small" style={{ width: 90 }} onChange={e => handleUpdateRow(dateStr, r.ma, 'slThucNhap', parseFloat(e.target.value) || 0)} />,
                            },
                            {
                              title: 'Đơn giá nhập', dataIndex: 'donGiaNhap', width: 130,
                              render: (v, r) => state.status === 'DaLuu'
                                ? <Text>{v ? formatVND(v) : '—'}</Text>
                                : <InputNumber value={v} size="small" style={{ width: 110 }} min={0} step={1000}
                                    formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    onChange={val => handleUpdateRow(dateStr, r.ma, 'donGiaNhap', val || 0)} />,
                            },
                            {
                              title: 'NCC', dataIndex: 'nccChon', width: 200,
                              render: (v, r) => state.status === 'DaLuu'
                                ? <Tag color="geekblue">{(() => { const n = nccList.find(x => x.ma === v); return n ? `${n.ten}` : '—' })()}</Tag>
                                : <Select size="small" value={v} style={{ width: 190 }}
                                    onChange={val => handleUpdateRow(dateStr, r.ma, 'nccChon', val)}
                                    options={r.nccList.map(n => ({ value: n.ma, label: `${n.ten} - ${n.sdt}` }))} />,
                            },
                          ]} />
                      )}

                      {isEditable && (
                        <div style={{ textAlign: 'right' }}>
                          <Button type="primary" icon={<FileTextOutlined />} size="large"
                            onClick={() => handleTaoPhieu(dateStr)} style={{ borderRadius: 12, height: 44, paddingInline: 28 }}>
                            Lập phiếu đặt hàng (tách theo NCC)
                          </Button>
                        </div>
                      )}
                      {state.status === 'DaLuu' && (
                        <div style={{ textAlign: 'right' }}><Tag color="success" style={{ fontSize: 14, padding: '4px 12px' }}>✅ Đã tạo phiếu đặt hàng</Tag></div>
                      )}
                    </div>
                  ),
                }
              })}
              defaultActiveKey={[allDates[0]]}
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              style={{ background: 'transparent', border: 'none' }}
              size="large"
            />
          </Card>
        </div>
      ),
    },


  ]

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Title level={2} style={{ margin: 0 }}>
          <ExperimentOutlined style={{ marginRight: 10, color: '#5b8def' }} />
          Quản lý Nguyên liệu
        </Title>
        <Text type="secondary">Tổng hợp nguyên liệu, nhà cung cấp và dự trù nhập hàng</Text>
      </div>

      <Tabs items={tabItems} defaultActiveKey="nguyenlieu" size="large"
        tabBarStyle={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '4px 8px', marginBottom: 16 }} />

      {/* ===== Modal NL ===== */}
      <Modal title={editingNL ? 'Sửa nguyên liệu' : 'Thêm nguyên liệu mới'} open={nlModalOpen}
        onOk={handleSaveNL} onCancel={() => { setNlModalOpen(false); nlForm.resetFields() }}
        okText={editingNL ? 'Lưu' : 'Thêm'} cancelText="Hủy">
        <Form form={nlForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="ten" label="Tên nguyên liệu" rules={[{ required: true, message: 'Nhập tên NL' }]}>
            <Input placeholder="VD: Thịt bò Úc" />
          </Form.Item>
          <Form.Item name="donVi" label="Đơn vị tính" rules={[{ required: true, message: 'Chọn đơn vị' }]}>
            <Select placeholder="Chọn" options={[
              { value: 'kg' }, { value: 'bó' }, { value: 'quả' }, { value: 'bìa' },
              { value: 'lít' }, { value: 'chai' }, { value: 'gói' }, { value: 'hộp' },
            ]} />
          </Form.Item>
          <Form.Item name="ncc" label="Nhà cung cấp">
            <Select mode="multiple" placeholder="Chọn NCC"
              options={nccList.map(n => ({ value: n.ma, label: `${n.ten} (${n.nhom})` }))} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ===== Modal NCC ===== */}
      <Modal title={editingNCC ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'} open={nccModalOpen}
        onOk={handleSaveNCC} onCancel={() => { setNccModalOpen(false); nccForm.resetFields() }}
        okText={editingNCC ? 'Lưu' : 'Thêm'} cancelText="Hủy">
        <Form form={nccForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="ten" label="Tên người đại diện" rules={[{ required: true }]}>
            <Input placeholder="VD: Anh Tuấn" />
          </Form.Item>
          <Form.Item name="sdt" label="SĐT" rules={[{ required: true }, { pattern: /^[0-9]+$/, message: 'Chỉ nhập số' }]}>
            <Input placeholder="0901111222" />
          </Form.Item>
          <Form.Item name="diaChi" label="Địa chỉ" rules={[{ required: true }]}>
            <Input placeholder="Chợ Đồng Xuân" />
          </Form.Item>
          <Form.Item name="nhom" label="Nhóm hàng" rules={[{ required: true }]}>
            <Select placeholder="Chọn hoặc thêm mới" showSearch
              filterOption={(input, opt) => opt.label?.toLowerCase().includes(input.toLowerCase())}
              options={nhomHangList.map(v => ({ value: v, label: v }))}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', gap: 8, padding: '0 8px 8px' }}>
                    <Input placeholder="Nhóm mới..." value={newNhomHang}
                      onChange={e => setNewNhomHang(e.target.value)}
                      onKeyDown={e => e.stopPropagation()} style={{ borderRadius: 8 }} />
                    <Button type="primary" size="small" style={{ borderRadius: 8 }}
                      onClick={() => {
                        if (newNhomHang && !nhomHangList.includes(newNhomHang)) {
                          setNhomHangList(prev => [...prev, newNhomHang])
                          nccForm.setFieldsValue({ nhom: newNhomHang })
                          setNewNhomHang('')
                          message.success(`Đã thêm nhóm "${newNhomHang}"`)
                        }
                      }}>Thêm</Button>
                  </div>
                </>
              )} />
          </Form.Item>
          <Form.Item name="congNo" label="Công nợ hiện tại">
            <InputNumber style={{ width: '100%' }} min={0} step={100000}
              formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          </Form.Item>
        </Form>
      </Modal>


      {/* ===== Preview phiếu dự trù ===== */}
      <Modal
        title={<Space><CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} /><span style={{ fontSize: 17 }}>Phiếu đặt hàng đã tạo</span><Tag color="success">{duTruPreview.phieus.length} phiếu</Tag></Space>}
        open={duTruPreview.open}
        onCancel={() => setDuTruPreview({ open: false, phieus: [] })}
        footer={[<Button key="close" type="primary" onClick={() => setDuTruPreview({ open: false, phieus: [] })}>Đóng</Button>]}
        width={700}
      >
        {duTruPreview.phieus.map((p, idx) => {
          const tongTien = p.data.reduce((s, r) => s + (r.donGiaNhap || 0) * r.slThucNhap, 0)
          return (
            <div key={p.maPhieu} style={{ marginBottom: idx < duTruPreview.phieus.length - 1 ? 20 : 0 }}>
              <div style={{ background: 'rgba(91,141,239,0.06)', borderRadius: 12, padding: 14, marginBottom: 12, border: '1px solid rgba(91,141,239,0.12)' }}>
                <Row gutter={16}>
                  <Col span={8}><Text type="secondary">Mã phiếu</Text><div><Text strong style={{ color: '#5b8def' }}>{p.maPhieu}</Text></div></Col>
                  <Col span={8}><Text type="secondary">NCC</Text><div><Text strong>{p.nccTen}</Text></div></Col>
                  <Col span={8}><Text type="secondary">SĐT</Text><div><Text>{p.nccSdt || '—'}</Text></div></Col>
                </Row>
              </div>
              <Table size="small" pagination={false}
                dataSource={p.data.map(r => ({ ...r, key: r.ma, thanhTien: (r.donGiaNhap || 0) * r.slThucNhap }))}
                columns={[
                  { title: 'Nguyên liệu', dataIndex: 'ten', render: v => <Text strong>{v}</Text> },
                  { title: 'ĐV', dataIndex: 'donVi', width: 50, align: 'center' },
                  { title: 'SL đặt', dataIndex: 'slThucNhap', width: 80, align: 'center', render: v => <Tag color="blue">{v}</Tag> },
                  { title: 'Đơn giá', dataIndex: 'donGiaNhap', width: 110, align: 'right', render: v => v ? formatVND(v) : '—' },
                  { title: 'Thành tiền', dataIndex: 'thanhTien', width: 120, align: 'right', render: v => <Text strong>{formatVND(v)}</Text> },
                ]}
                summary={() => (
                  <Table.Summary.Row style={{ background: 'rgba(91,141,239,0.05)' }}>
                    <Table.Summary.Cell index={0} colSpan={4} align="right"><Text strong>Tổng:</Text></Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right"><Text strong style={{ color: '#52c41a' }}>{formatVND(tongTien)}</Text></Table.Summary.Cell>
                  </Table.Summary.Row>
                )} />
              {idx < duTruPreview.phieus.length - 1 && <Divider />}
            </div>
          )
        })}
      </Modal>

    </div>
  )
}
