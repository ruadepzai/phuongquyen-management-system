import { useState, useMemo } from 'react'
import {
  Tabs, Table, Card, Tag, Space, Typography, Collapse,
  Input, Select, Statistic, Row, Col, Tooltip, Badge, Empty,
  Modal, Form, Button, message, Divider
} from 'antd'
import {
  ShoppingCartOutlined, CalendarOutlined, SearchOutlined,
  InboxOutlined, TeamOutlined, CheckCircleOutlined,
  ExperimentOutlined, BarChartOutlined, CaretRightOutlined, PlusOutlined,
  PhoneOutlined, EnvironmentOutlined, PrinterOutlined, HistoryOutlined,
  FileTextOutlined, SaveOutlined, ImportOutlined, WarningOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text } = Typography

// ==================== MOCK DATA ====================
// Mỗi NL có thể có nhiều NCC
const mockNguyenLieu = [
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

const mockNCC = [
  { ma: 'NCC01', ten: 'Anh Tuấn', sdt: '0901 111 222', diaChi: 'Chợ Đồng Xuân', nhom: 'Thịt & Chả' },
  { ma: 'NCC02', ten: 'Chị Hoa', sdt: '0912 333 444', diaChi: 'Chợ Long Biên', nhom: 'Hải sản' },
  { ma: 'NCC03', ten: 'Bác Hùng', sdt: '0987 555 666', diaChi: 'Chợ Minh Khai', nhom: 'Rau củ & Nấm' },
  { ma: 'NCC04', ten: 'Cô Lan', sdt: '0976 777 888', diaChi: 'Chợ Hàng Da', nhom: 'Khô & Gia vị' },
  { ma: 'NCC05', ten: 'Anh Bình', sdt: '0933 999 000', diaChi: 'Chợ Thành Công', nhom: 'Thịt tươi sống' },
  { ma: 'NCC06', ten: 'Chú Dũng', sdt: '0944 222 333', diaChi: 'Chợ cá Yên Sở', nhom: 'Cá nước ngọt' },
]

// Đơn hàng gom theo ngày
const mockDonHangTheoNgay = {
  '2026-05-14': [
    { maDon: 'DH001', khach: 'Anh Minh', soMam: 10, diaChi: 'Cầu Giấy', trangThai: 'DaChot',
      monAn: [
        { ten: 'Gà luộc lá chanh', nl: [{ ma: 'NL02', sl: 0.5 }, { ma: 'NL06', sl: 0.1 }] },
        { ten: 'Nem rán', nl: [{ ma: 'NL01', sl: 0.3 }, { ma: 'NL09', sl: 0.1 }, { ma: 'NL11', sl: 2 }] },
      ]
    },
  ],
  '2026-05-15': [
    { maDon: 'DH002', khach: 'Chị Hương', soMam: 15, diaChi: 'Thanh Xuân', trangThai: 'DaChot',
      monAn: [
        { ten: 'Tôm hấp bia', nl: [{ ma: 'NL03', sl: 0.4 }] },
        { ten: 'Thịt lợn quay', nl: [{ ma: 'NL01', sl: 0.6 }] },
        { ten: 'Cá chép om dưa', nl: [{ ma: 'NL04', sl: 0.5 }] },
        { ten: 'Rau muống xào', nl: [{ ma: 'NL05', sl: 0.3 }] },
        { ten: 'Giò lụa', nl: [{ ma: 'NL10', sl: 0.2 }] },
      ]
    },
    { maDon: 'DH003', khach: 'Anh Tuấn', soMam: 8, diaChi: 'Hoàng Mai', trangThai: 'DaChot',
      monAn: [
        { ten: 'Gà luộc', nl: [{ ma: 'NL02', sl: 0.5 }, { ma: 'NL06', sl: 0.1 }] },
        { ten: 'Tôm hấp', nl: [{ ma: 'NL03', sl: 0.4 }] },
        { ten: 'Đậu phụ nhồi', nl: [{ ma: 'NL12', sl: 0.3 }, { ma: 'NL01', sl: 0.15 }] },
      ]
    },
  ],
  '2026-05-16': [
    { maDon: 'DH004', khach: 'Bác Thành', soMam: 20, diaChi: 'Ba Đình', trangThai: 'DaChot',
      monAn: [
        { ten: 'Gà luộc', nl: [{ ma: 'NL02', sl: 0.5 }, { ma: 'NL06', sl: 0.1 }] },
        { ten: 'Thịt lợn quay', nl: [{ ma: 'NL01', sl: 0.6 }] },
        { ten: 'Tôm sú hấp', nl: [{ ma: 'NL03', sl: 0.4 }] },
        { ten: 'Xôi gấc', nl: [{ ma: 'NL07', sl: 0.4 }] },
        { ten: 'Giò lụa', nl: [{ ma: 'NL10', sl: 0.2 }] },
      ]
    },
    { maDon: 'DH005', khach: 'Cô Nga', soMam: 12, diaChi: 'Đống Đa', trangThai: 'DaChot',
      monAn: [
        { ten: 'Cá chép om dưa', nl: [{ ma: 'NL04', sl: 0.5 }] },
        { ten: 'Nem rán', nl: [{ ma: 'NL01', sl: 0.3 }, { ma: 'NL09', sl: 0.1 }, { ma: 'NL11', sl: 2 }] },
        { ten: 'Rau muống xào', nl: [{ ma: 'NL05', sl: 0.3 }] },
        { ten: 'Canh miến nấm', nl: [{ ma: 'NL09', sl: 0.15 }, { ma: 'NL08', sl: 0.1 }] },
      ]
    },
  ],
  '2026-05-17': [
    { maDon: 'DH006', khach: 'Anh Phong', soMam: 25, diaChi: 'Long Biên', trangThai: 'DaChot',
      monAn: [
        { ten: 'Gà luộc', nl: [{ ma: 'NL02', sl: 0.5 }, { ma: 'NL06', sl: 0.1 }] },
        { ten: 'Nem rán', nl: [{ ma: 'NL01', sl: 0.3 }, { ma: 'NL09', sl: 0.1 }, { ma: 'NL11', sl: 2 }] },
        { ten: 'Xôi gấc', nl: [{ ma: 'NL07', sl: 0.4 }] },
      ]
    },
  ],
}

// ==================== HELPER ====================
function tinhDuTru(donHangs) {
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
    const info = mockNguyenLieu.find(n => n.ma === ma)
    const nccList = (info?.ncc || []).map(id => mockNCC.find(n => n.ma === id)).filter(Boolean)
    return {
      key: ma, ma, ten: info?.ten || ma, donVi: info?.donVi || '',
      tongSL: Math.round(v.tongSL * 100) / 100,
      nccList, chiTiet: v.chiTiet,
    }
  }).sort((a, b) => b.tongSL - a.tongSL)
}

// ==================== STYLES ====================
const glassCard = {
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16,
}
const statCard = (color) => ({
  background: `linear-gradient(135deg, ${color}22, ${color}08)`,
  border: `1px solid ${color}30`, borderRadius: 14, padding: '16px 20px',
})

// ==================== COMPONENT ====================
export default function NguyenLieu() {
  const [searchText, setSearchText] = useState('')
  const [filterNCC, setFilterNCC] = useState('all')
  const [nguyenLieuList, setNguyenLieuList] = useState(mockNguyenLieu)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [form] = Form.useForm()

  const handleAddNL = () => {
    form.validateFields().then(values => {
      const newMa = 'NL' + String(nguyenLieuList.length + 1).padStart(2, '0')
      setNguyenLieuList(prev => [...prev, { ma: newMa, ten: values.ten, donVi: values.donVi, ncc: values.ncc || [] }])
      message.success(`Đã thêm nguyên liệu "${values.ten}"`)
      form.resetFields()
      setAddModalOpen(false)
    })
  }

  // Tất cả ngày có đơn, sắp xếp
  const allDates = Object.keys(mockDonHangTheoNgay).sort()

  // Tính dự trù cho tất cả các ngày
  const allDonHangs = Object.values(mockDonHangTheoNgay).flat()
  const tongDuTru = useMemo(() => tinhDuTru(allDonHangs), [])

  // ===== TAB 1: Tổng hợp nguyên liệu (NL + NCC, 1 NL nhiều NCC) =====
  const columnsNL = [
    { title: 'Mã', dataIndex: 'ma', width: 80, render: v => <Text code style={{ fontSize: 12 }}>{v}</Text> },
    { title: 'Tên nguyên liệu', dataIndex: 'ten', render: v => <Text strong>{v}</Text> },
    { title: 'Đơn vị', dataIndex: 'donVi', width: 80, align: 'center' },
    {
      title: 'Nhà cung cấp', dataIndex: 'ncc', width: 320,
      render: (nccIds) => (
        <Space wrap size={[4, 4]}>
          {nccIds.map(id => {
            const ncc = mockNCC.find(n => n.ma === id)
            return ncc ? (
              <Tooltip key={id} title={`${ncc.sdt} — ${ncc.diaChi}`}>
                <Tag color="geekblue" style={{ borderRadius: 6, cursor: 'pointer' }}>
                  {ncc.ten} <Text type="secondary" style={{ fontSize: 10 }}>({ncc.nhom})</Text>
                </Tag>
              </Tooltip>
            ) : null
          })}
        </Space>
      ),
    },
  ]

  const filteredNL = nguyenLieuList.filter(n =>
    n.ten.toLowerCase().includes(searchText.toLowerCase()) || n.ma.toLowerCase().includes(searchText.toLowerCase())
  )

  const columnsNCC = [
    { title: 'Mã', dataIndex: 'ma', width: 80, render: v => <Text code>{v}</Text> },
    { title: 'Người liên hệ', dataIndex: 'ten', render: v => <Text strong>{v}</Text> },
    { title: 'Nhóm hàng', dataIndex: 'nhom', render: v => <Tag color="blue">{v}</Tag> },
    { title: 'SĐT', dataIndex: 'sdt', width: 140, render: v => <span><PhoneOutlined style={{ marginRight: 4 }} />{v}</span> },
    { title: 'Địa chỉ', dataIndex: 'diaChi', render: v => <span><EnvironmentOutlined style={{ marginRight: 4 }} />{v}</span> },
    {
      title: 'Nguyên liệu cung cấp', width: 240,
      render: (_, r) => {
        const items = nguyenLieuList.filter(nl => nl.ncc.includes(r.ma))
        return <Space wrap size={[4, 4]}>{items.map(i => <Tag key={i.ma}>{i.ten}</Tag>)}</Space>
      }
    },
  ]

  // ===== TAB 2: Dự trù theo ngày (INTERACTIVE) =====
  const [duTruState, setDuTruState] = useState({})

  const [lichSuPhieu, setLichSuPhieu] = useState([])
  const [tiepNhanData, setTiepNhanData] = useState({})
  const [dsPhieuLoi, setDsPhieuLoi] = useState([])

  const handleTinhDuTru = (dateStr) => {
    const dons = mockDonHangTheoNgay[dateStr]
    if (!dons || dons.length === 0) {
      Modal.error({ title: 'Không có đơn hàng', content: `Ngày ${dayjs(dateStr).format('DD/MM/YYYY')} chưa có đơn hàng nào được chốt.` })
      return
    }
    const result = tinhDuTru(dons)
    const dataWithEdit = result.map(r => ({
      ...r, slThucNhap: r.tongSL, nccChon: r.nccList[0]?.ma || '', ghiChu: '',
    }))
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

  const handleTaoPhieu = (dateStr) => {
    setDuTruState(prev => ({ ...prev, [dateStr]: { ...prev[dateStr], status: 'DaPhieu' } }))
    message.success(`Đã tạo phiếu đặt hàng ngày ${dayjs(dateStr).format('DD/MM/YYYY')}!`)
  }

  const handleLuuPhieu = (dateStr) => {
    const state = duTruState[dateStr]
    const maPhieu = 'PDH' + String(lichSuPhieu.length + 1).padStart(3, '0')
    setLichSuPhieu(prev => [...prev, {
      key: maPhieu, maPhieu, ngay: dateStr, thoiGian: dayjs().format('DD/MM/YYYY HH:mm'),
      soNL: state.data.length, data: state.data,
    }])
    setDuTruState(prev => ({ ...prev, [dateStr]: { ...prev[dateStr], status: 'DaLuu' } }))
    message.success(`Đã lưu phiếu ${maPhieu}!`)
  }

  const handleSuaLai = (dateStr) => {
    setDuTruState(prev => ({ ...prev, [dateStr]: { ...prev[dateStr], status: 'DangDuTru' } }))
  }

  const collapseItems = allDates.map(dateStr => {
    const dons = mockDonHangTheoNgay[dateStr]
    const tongMam = dons.reduce((s, d) => s + d.soMam, 0)
    const d = dayjs(dateStr)
    const state = duTruState[dateStr] || { status: 'ChuaTinh', data: [] }
    const isEditable = state.status === 'DangDuTru'
    const isDone = state.status === 'DaDuTru'

    return {
      key: dateStr,
      label: (
        <Space size={16}>
          <Text strong style={{ fontSize: 15, color: '#5b8def' }}>
            <CalendarOutlined style={{ marginRight: 6 }} />{d.format('DD/MM/YYYY')}
          </Text>
          <Tag color="blue">{dons.length} đơn</Tag>
          <Tag color="green">{tongMam} mâm</Tag>
          {isDone && <Tag color="success" icon={<CheckCircleOutlined />}>Đã dự trù</Tag>}
          {isEditable && <Tag color="warning" icon={<ExperimentOutlined />}>Đang nhập</Tag>}
          <Text type="secondary" style={{ fontSize: 12 }}>(chốt từ {d.subtract(1, 'day').format('DD/MM')})</Text>
        </Space>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {dons.map(don => (
              <div key={don.maDon} style={{
                background: 'rgba(91,141,239,0.06)', border: '1px solid rgba(91,141,239,0.15)',
                borderRadius: 12, padding: '12px 16px', minWidth: 240, flex: '1 1 240px',
              }}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Text strong style={{ color: '#5b8def' }}>{don.maDon}</Text>
                    <Tag color="green" style={{ borderRadius: 6 }}>Đã chốt</Tag>
                  </Space>
                  <Text>{don.khach}</Text>
                  <Space>
                    <Tag>{don.soMam} mâm</Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>{don.diaChi}</Text>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 11 }}>{don.monAn.map(m => m.ten).join(' • ')}</Text>
                </Space>
              </div>
            ))}
          </div>

          {state.status === 'ChuaTinh' && (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <Button type="primary" size="large" icon={<ExperimentOutlined />}
                onClick={(e) => { e.stopPropagation(); handleTinhDuTru(dateStr) }}
                style={{ borderRadius: 12, height: 48, paddingInline: 32 }}>
                Tính dự trù nguyên liệu
              </Button>
              <div><Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                Hệ thống sẽ tính SL đề xuất dựa trên định mức × số mâm
              </Text></div>
            </div>
          )}

          {state.status !== 'ChuaTinh' && (
            <Table size="small" pagination={false} dataSource={state.data}
              columns={[
                { title: 'Nguyên liệu', dataIndex: 'ten', width: 140, render: v => <Text strong>{v}</Text> },
                { title: 'Đơn vị', dataIndex: 'donVi', width: 60, align: 'center' },
                { title: 'SL Đề xuất', dataIndex: 'tongSL', width: 100, align: 'center',
                  render: v => <Tag color="blue" style={{ borderRadius: 8 }}>{v}</Tag> },
                { title: 'SL Thực nhập', dataIndex: 'slThucNhap', width: 130, align: 'center',
                  render: (v, r) => (state.status === 'DaPhieu' || state.status === 'DaLuu')
                    ? <Tag color="red" style={{ fontWeight: 700, borderRadius: 8 }}>{v} {r.donVi}</Tag>
                    : <Input type="number" value={v} size="small" style={{ width: 90, textAlign: 'center' }}
                        onChange={e => handleUpdateRow(dateStr, r.ma, 'slThucNhap', parseFloat(e.target.value) || 0)} />
                },
                { title: 'NCC', dataIndex: 'nccChon', width: 200,
                  render: (v, r) => (isDone || state.status === 'DaPhieu' || state.status === 'DaLuu')
                    ? <Tag color="geekblue">{(() => { const n = mockNCC.find(x => x.ma === v); return n ? `${n.ten} - ${n.sdt}` : '—' })()}</Tag>
                    : <Select size="small" value={v} style={{ width: 190 }}
                        onChange={val => handleUpdateRow(dateStr, r.ma, 'nccChon', val)}
                        options={r.nccList.map(n => ({ value: n.ma, label: `${n.ten} - ${n.sdt}` }))} />
                },
                { title: 'Ghi chú', dataIndex: 'ghiChu',
                  render: (v, r) => (state.status === 'DaPhieu' || state.status === 'DaLuu')
                    ? <Text type="secondary">{v || '—'}</Text>
                    : <Input size="small" value={v} placeholder="VD: dư phòng..."
                        onChange={e => handleUpdateRow(dateStr, r.ma, 'ghiChu', e.target.value)} />
                },
              ]} />
          )}

          {isEditable && (
            <div style={{ textAlign: 'right' }}>
              <Button type="primary" icon={<FileTextOutlined />} size="large"
                onClick={() => handleTaoPhieu(dateStr)} style={{ borderRadius: 12, height: 44, paddingInline: 28 }}>
                Tạo phiếu đặt hàng
              </Button>
            </div>
          )}
          {state.status === 'DaPhieu' && (
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button icon={<ExperimentOutlined />} onClick={() => handleSuaLai(dateStr)} style={{ borderRadius: 12 }}>Sửa lại</Button>
                <Button type="primary" icon={<SaveOutlined />} onClick={() => handleLuuPhieu(dateStr)} style={{ borderRadius: 12 }}>Xác nhận đặt hàng</Button>
                <Button icon={<PrinterOutlined />} onClick={() => message.info('Chức năng in đang phát triển')} style={{ borderRadius: 12 }}>In phiếu</Button>
              </Space>
            </div>
          )}
          {state.status === 'DaLuu' && (
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Tag color="warning" style={{ fontSize: 14, padding: '4px 12px' }}>⏳ Chờ giao hàng</Tag>
                <Button icon={<PrinterOutlined />} onClick={() => message.info('Chức năng in đang phát triển')} style={{ borderRadius: 12 }}>In phiếu</Button>
              </Space>
            </div>
          )}
        </div>
      ),
    }
  })

  // Stats tổng
  const tongDon = allDonHangs.length
  const tongMam = allDonHangs.reduce((s, d) => s + d.soMam, 0)

  // ===== RENDER =====
  const tabItems = [
    {
      key: 'tonghop',
      label: <span><InboxOutlined style={{ marginRight: 6 }} />Tổng hợp nguyên liệu</span>,
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Row gutter={16}>
            <Col span={8}>
              <div style={statCard('#5b8def')}>
                <Statistic title="Tổng nguyên liệu" value={nguyenLieuList.length}
                  prefix={<ExperimentOutlined />} valueStyle={{ color: '#5b8def' }} />
              </div>
            </Col>
            <Col span={8}>
              <div style={statCard('#52c41a')}>
                <Statistic title="Nhà cung cấp" value={mockNCC.length}
                  prefix={<TeamOutlined />} valueStyle={{ color: '#52c41a' }} />
              </div>
            </Col>
            <Col span={8}>
              <div style={statCard('#faad14')}>
                <Statistic title="NL có ≥2 NCC" value={nguyenLieuList.filter(n => n.ncc.length >= 2).length}
                  prefix={<CheckCircleOutlined />} valueStyle={{ color: '#faad14' }} />
              </div>
            </Col>
          </Row>

          <Tabs defaultActiveKey="nl" size="small" items={[
            { key: 'nl', label: <span><ExperimentOutlined /> Danh sách nguyên liệu</span>,
              children: (
                <Card style={glassCard} styles={{ header: { borderBottom: '1px solid rgba(255,255,255,0.08)' } }}
                  extra={
                    <Space>
                      <Input placeholder="Tìm nguyên liệu..." prefix={<SearchOutlined />}
                        style={{ width: 220 }} allowClear
                        onChange={e => setSearchText(e.target.value)} value={searchText} />
                      <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)}>Thêm NL</Button>
                    </Space>
                  }>
                  <Table columns={columnsNL} dataSource={filteredNL.map(n => ({ ...n, key: n.ma }))}
                    pagination={false} size="middle" />
                </Card>
              ),
            },
            { key: 'ncc', label: <span><TeamOutlined /> Nhà cung cấp</span>,
              children: (
                <Card style={glassCard} styles={{ header: { borderBottom: '1px solid rgba(255,255,255,0.08)' } }}>
                  <Table columns={columnsNCC} dataSource={mockNCC.map(n => ({ ...n, key: n.ma }))}
                    pagination={false} size="middle" />
                </Card>
              ),
            },
          ]} />
        </div>
      ),
    },
    {
      key: 'dutru',
      label: <span><CalendarOutlined style={{ marginRight: 6 }} />Dự trù theo ngày</span>,
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Stats tổng */}
          <Row gutter={16}>
            <Col span={6}>
              <div style={statCard('#5b8def')}>
                <Statistic title="Tổng đơn" value={tongDon}
                  prefix={<ShoppingCartOutlined />} valueStyle={{ color: '#5b8def' }} />
              </div>
            </Col>
            <Col span={6}>
              <div style={statCard('#52c41a')}>
                <Statistic title="Tổng mâm" value={tongMam}
                  prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
              </div>
            </Col>
            <Col span={6}>
              <div style={statCard('#fa541c')}>
                <Statistic title="Ngày có đơn" value={allDates.length}
                  prefix={<CalendarOutlined />} valueStyle={{ color: '#fa541c' }} />
              </div>
            </Col>
            <Col span={6}>
              <div style={statCard('#722ed1')}>
                <Statistic title="Loại NL tổng" value={tongDuTru.length}
                  prefix={<ExperimentOutlined />} valueStyle={{ color: '#722ed1' }} />
              </div>
            </Col>
          </Row>

          {/* Collapse theo ngày */}
          <Card style={glassCard} styles={{ body: { padding: 12 } }}>
            <Collapse items={collapseItems} defaultActiveKey={[allDates[allDates.length - 1]]}
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              style={{ background: 'transparent', border: 'none' }}
              size="large" />
          </Card>
        </div>
      ),
    },
    {
      key: 'lichsu',
      label: <span><HistoryOutlined style={{ marginRight: 6 }} />Lịch sử phiếu đặt</span>,
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {lichSuPhieu.length === 0 ? (
            <Card style={glassCard}><Empty description="Chưa có phiếu đặt hàng nào" /></Card>
          ) : (
            <Card style={glassCard}>
              <Table size="middle" pagination={false}
                dataSource={lichSuPhieu}
                columns={[
                  { title: 'Mã phiếu', dataIndex: 'maPhieu', width: 120, render: v => <Text strong style={{ color: '#5b8def' }}>{v}</Text> },
                  { title: 'Ngày giao', dataIndex: 'ngay', width: 120, render: v => dayjs(v).format('DD/MM/YYYY') },
                  { title: 'Thời gian tạo', dataIndex: 'thoiGian', width: 160 },
                  { title: 'Số NL', dataIndex: 'soNL', width: 80, align: 'center', render: v => <Tag color="blue">{v}</Tag> },
                  { title: 'Thao tác', width: 100, render: () => <Button size="small" icon={<PrinterOutlined />}>In</Button> },
                ]} />
            </Card>
          )}
        </div>
      ),
    },
    {
      key: 'tiepnhan',
      label: <span><ImportOutlined style={{ marginRight: 6 }} />Tiếp nhận NL</span>,
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {lichSuPhieu.length === 0 ? (
            <Card style={glassCard}><Empty description="Chưa có phiếu đặt hàng nào để tiếp nhận" /></Card>
          ) : (
            lichSuPhieu.map(phieu => {
              const tn = tiepNhanData[phieu.maPhieu] || { status: 'ChuaNhan' }
              return (
                <Card key={phieu.maPhieu} style={glassCard}
                  title={<Space><Text strong style={{ color: '#5b8def' }}>{phieu.maPhieu}</Text>
                    <Tag color="blue">Ngày giao: {dayjs(phieu.ngay).format('DD/MM/YYYY')}</Tag>
                    <Tag>{phieu.soNL} loại NL</Tag>
                    {tn.status === 'ChuaNhan' && <Tag color="warning">⏳ Chờ giao hàng</Tag>}
                    {tn.status === 'DangNhan' && <Tag color="processing">📋 Đang đối chiếu</Tag>}
                    {tn.status === 'DaNhapKho' && <Tag color="success" icon={<CheckCircleOutlined />}>Đã nhập kho</Tag>}
                    {tn.status === 'CoLoi' && <Tag color="error" icon={<WarningOutlined />}>Có phiếu lỗi</Tag>}
                  </Space>}>

                  {/* Xem chi tiết phiếu đặt */}
                  <Text strong style={{ marginBottom: 8, display: 'block' }}>Chi tiết phiếu đặt:</Text>
                  <Table size="small" pagination={false} style={{ marginBottom: 12 }}
                    dataSource={phieu.data.map(r => ({ ...r, key: r.ma }))}
                    columns={[
                      { title: 'Nguyên liệu', dataIndex: 'ten', render: v => <Text strong>{v}</Text> },
                      { title: 'Đơn vị', dataIndex: 'donVi', width: 60 },
                      { title: 'SL đặt', dataIndex: 'slThucNhap', width: 90, align: 'center',
                        render: v => <Tag color="blue">{v}</Tag> },
                      { title: 'NCC', dataIndex: 'nccChon', width: 160,
                        render: v => { const n = mockNCC.find(x => x.ma === v); return n ? <Tag color="geekblue">{n.ten} - {n.sdt}</Tag> : '—' } },
                    ]} />

                  {tn.status === 'ChuaNhan' && (
                    <div style={{ textAlign: 'center' }}>
                      <Button type="primary" icon={<ImportOutlined />}
                        onClick={() => setTiepNhanData(prev => ({ ...prev, [phieu.maPhieu]: { status: 'DangNhan', rows: {} } }))}
                        style={{ borderRadius: 12 }}>
                        Bắt đầu kiểm hàng
                      </Button>
                    </div>
                  )}

                  {tn.status === 'DangNhan' && (
                    <div>
                      <Divider style={{ margin: '8px 0' }}>Nhập SL thực nhận</Divider>
                      <Table size="small" pagination={false}
                        dataSource={phieu.data.map(r => ({ ...r, key: r.ma }))}
                        columns={[
                          { title: 'Nguyên liệu', dataIndex: 'ten', render: v => <Text strong>{v}</Text> },
                          { title: 'SL đặt', dataIndex: 'slThucNhap', width: 90, align: 'center',
                            render: v => <Tag color="blue">{v}</Tag> },
                          { title: 'SL thực nhận', width: 120, align: 'center',
                            render: (_, r) => <Input type="number" size="small" style={{ width: 80 }}
                              defaultValue={r.slThucNhap}
                              onChange={e => {
                                const val = parseFloat(e.target.value) || 0
                                setTiepNhanData(prev => {
                                  const cur = prev[phieu.maPhieu] || { status: 'DangNhan', rows: {} }
                                  return { ...prev, [phieu.maPhieu]: { ...cur, rows: { ...cur.rows, [r.ma]: val } } }
                                })
                              }} />
                          },
                        ]} />
                      <div style={{ textAlign: 'right', marginTop: 12 }}>
                        <Button type="primary" icon={<CheckCircleOutlined />}
                          onClick={() => {
                            const rows = tiepNhanData[phieu.maPhieu]?.rows || {}
                            const hasError = phieu.data.some(r => {
                              const actual = rows[r.ma] ?? r.slThucNhap
                              return actual !== r.slThucNhap
                            })
                            if (hasError) {
                              const loiItems = phieu.data.filter(r => (rows[r.ma] ?? r.slThucNhap) !== r.slThucNhap)
                                .map(r => ({ ...r, slNhan: rows[r.ma] ?? r.slThucNhap, chenhLech: r.slThucNhap - (rows[r.ma] ?? r.slThucNhap), loai: 'Thiếu' }))
                              const maLoi = 'PBL' + String(dsPhieuLoi.length + 1).padStart(3, '0')
                              setDsPhieuLoi(prev => [...prev, { key: maLoi, maLoi, maPhieu: phieu.maPhieu, ngay: dayjs().format('DD/MM/YYYY HH:mm'), items: loiItems }])
                              setTiepNhanData(prev => ({ ...prev, [phieu.maPhieu]: { status: 'CoLoi' } }))
                              message.warning(`Phát hiện chênh lệch! Đã tạo phiếu báo lỗi ${maLoi}`)
                            } else {
                              setTiepNhanData(prev => ({ ...prev, [phieu.maPhieu]: { status: 'DaNhapKho' } }))
                              message.success('Khớp 100%! Đã xác nhận nhập kho.')
                            }
                          }} style={{ borderRadius: 12 }}>
                          Xác nhận nhập kho
                        </Button>
                      </div>
                    </div>
                  )}

                  {tn.status === 'DaNhapKho' && <Tag color="success" style={{ fontSize: 14, padding: '6px 16px' }}>✅ Đã nhập kho thành công</Tag>}
                  {tn.status === 'CoLoi' && <Tag color="error" style={{ fontSize: 14, padding: '6px 16px' }}>⚠️ Đã lập phiếu báo lỗi</Tag>}
                </Card>
              )
            })
          )}

          {dsPhieuLoi.length > 0 && (
            <Card title={<span><WarningOutlined style={{ color: '#ff4d4f' }} /> Phiếu báo lỗi</span>} style={glassCard}>
              {dsPhieuLoi.map(pl => (
                <Card key={pl.maLoi} size="small" style={{ marginBottom: 8, background: 'rgba(255,77,79,0.04)', border: '1px solid rgba(255,77,79,0.15)', borderRadius: 12 }}
                  title={<Space><Text strong style={{ color: '#ff4d4f' }}>{pl.maLoi}</Text><Tag>{pl.maPhieu}</Tag><Text type="secondary">{pl.ngay}</Text></Space>}>
                  <Table size="small" pagination={false} dataSource={pl.items.map((it,i) => ({ ...it, key: i }))}
                    columns={[
                      { title: 'NL', dataIndex: 'ten' },
                      { title: 'SL đặt', dataIndex: 'slThucNhap', width: 80, align: 'center' },
                      { title: 'SL nhận', dataIndex: 'slNhan', width: 80, align: 'center' },
                      { title: 'Chênh lệch', dataIndex: 'chenhLech', width: 90, align: 'center',
                        render: v => <Tag color="red">-{v}</Tag> },
                      { title: 'Phân loại', dataIndex: 'loai', width: 100,
                        render: () => <Select size="small" defaultValue="Thiếu" style={{ width: 90 }}
                          options={[{ value: 'Thiếu', label: 'Thiếu' }, { value: 'Hỏng', label: 'Hỏng' }]} /> },
                    ]} />
                </Card>
              ))}
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
          <ExperimentOutlined style={{ marginRight: 10, color: '#5b8def' }} />
          Quản lý Nguyên liệu
        </Title>
        <Text type="secondary">Tổng hợp nguyên liệu và dự trù nhập hàng theo ngày</Text>
      </div>

      <Tabs items={tabItems} defaultActiveKey="dutru" size="large"
        tabBarStyle={{
          background: 'rgba(255,255,255,0.04)', borderRadius: 12,
          padding: '4px 8px', marginBottom: 16,
        }} />

      {/* Modal thêm nguyên liệu */}
      <Modal title="Thêm nguyên liệu mới" open={addModalOpen}
        onOk={handleAddNL} onCancel={() => { setAddModalOpen(false); form.resetFields() }}
        okText="Thêm" cancelText="Hủy">
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="ten" label="Tên nguyên liệu" rules={[{ required: true, message: 'Nhập tên nguyên liệu' }]}>
            <Input placeholder="VD: Thịt bò Úc" />
          </Form.Item>
          <Form.Item name="donVi" label="Đơn vị tính" rules={[{ required: true, message: 'Chọn đơn vị' }]}>
            <Select placeholder="Chọn đơn vị" options={[
              { value: 'kg', label: 'kg' },
              { value: 'bó', label: 'bó' },
              { value: 'quả', label: 'quả' },
              { value: 'bìa', label: 'bìa' },
              { value: 'lít', label: 'lít' },
              { value: 'chai', label: 'chai' },
              { value: 'gói', label: 'gói' },
              { value: 'hộp', label: 'hộp' },
            ]} />
          </Form.Item>
          <Form.Item name="ncc" label="Nhà cung cấp">
            <Select mode="multiple" placeholder="Chọn NCC (có thể nhiều)"
              options={mockNCC.map(n => ({ value: n.ma, label: `${n.ten} (${n.nhom})` }))} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
