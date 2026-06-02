import { useState, useMemo } from 'react'
import {
  Tabs, Table, Card, Tag, Space, Typography, Row, Col,
  Modal, Form, Input, InputNumber, Select, Button, Tooltip,
  Popconfirm, message, Empty, Divider, Statistic, Badge
} from 'antd'
import {
  AppstoreOutlined, CoffeeOutlined, TagsOutlined,
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined,
  EyeOutlined, DollarOutlined, UnorderedListOutlined, MinusCircleOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

// Format VNĐ
function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

// ==================== MOCK DATA ====================
const mockDanhMuc = [
  { maDM: 'DM01', tenDanhMuc: 'Khai vị' },
  { maDM: 'DM02', tenDanhMuc: 'Món chính' },
  { maDM: 'DM03', tenDanhMuc: 'Canh / Súp' },
  { maDM: 'DM04', tenDanhMuc: 'Xôi / Cơm' },
  { maDM: 'DM05', tenDanhMuc: 'Tráng miệng' },
  { maDM: 'DM06', tenDanhMuc: 'Đồ uống' },
]

const mockMonAn = [
  { maMon: 'MA01', tenMon: 'Gà luộc lá chanh', donGia: 350000, moTa: 'Gà ta luộc lá chanh tươi', maDM: 'DM02' },
  { maMon: 'MA02', tenMon: 'Nem rán', donGia: 200000, moTa: 'Nem rán giòn truyền thống', maDM: 'DM01' },
  { maMon: 'MA03', tenMon: 'Xôi gấc', donGia: 150000, moTa: 'Xôi gấc đỏ tươi', maDM: 'DM04' },
  { maMon: 'MA04', tenMon: 'Canh măng', donGia: 180000, moTa: 'Canh măng nấu xương', maDM: 'DM03' },
  { maMon: 'MA05', tenMon: 'Giò thủ', donGia: 250000, moTa: 'Giò thủ nhà làm', maDM: 'DM01' },
  { maMon: 'MA06', tenMon: 'Chè sen', donGia: 120000, moTa: 'Chè hạt sen nhãn nhục', maDM: 'DM05' },
  { maMon: 'MA07', tenMon: 'Tôm hấp bia', donGia: 400000, moTa: 'Tôm sú hấp bia tươi', maDM: 'DM02' },
  { maMon: 'MA08', tenMon: 'Thịt lợn quay', donGia: 300000, moTa: 'Lợn quay giòn bì', maDM: 'DM02' },
  { maMon: 'MA09', tenMon: 'Cá chép om dưa', donGia: 280000, moTa: 'Cá chép om dưa chua', maDM: 'DM02' },
  { maMon: 'MA10', tenMon: 'Bò nướng lá lốt', donGia: 400000, moTa: 'Bò cuốn lá lốt nướng than', maDM: 'DM02' },
  { maMon: 'MA11', tenMon: 'Gỏi cuốn', donGia: 200000, moTa: 'Gỏi cuốn tôm thịt', maDM: 'DM01' },
  { maMon: 'MA12', tenMon: 'Cơm chiên', donGia: 180000, moTa: 'Cơm chiên dương châu', maDM: 'DM04' },
  { maMon: 'MA13', tenMon: 'Canh chua cá', donGia: 220000, moTa: 'Canh chua cá lóc miền Tây', maDM: 'DM03' },
  { maMon: 'MA14', tenMon: 'Bò sốt tiêu đen', donGia: 400000, moTa: 'Bò Úc sốt tiêu đen', maDM: 'DM02' },
  { maMon: 'MA15', tenMon: 'Cá chiên giòn', donGia: 300000, moTa: 'Cá chiên giòn sốt chua ngọt', maDM: 'DM02' },
  { maMon: 'MA16', tenMon: 'Gỏi ngó sen', donGia: 200000, moTa: 'Gỏi ngó sen tôm thịt', maDM: 'DM01' },
  { maMon: 'MA17', tenMon: 'Xôi vò', donGia: 150000, moTa: 'Xôi vò hạt sen', maDM: 'DM04' },
  { maMon: 'MA18', tenMon: 'Canh cua', donGia: 200000, moTa: 'Canh cua rau đay mồng tơi', maDM: 'DM03' },
  { maMon: 'MA19', tenMon: 'Chè thập cẩm', donGia: 250000, moTa: 'Chè thập cẩm nhiều topping', maDM: 'DM05' },
  { maMon: 'MA20', tenMon: 'Giò lụa', donGia: 250000, moTa: 'Giò lụa truyền thống', maDM: 'DM01' },
  { maMon: 'MA21', tenMon: 'Chè kho', donGia: 250000, moTa: 'Chè kho đậu xanh', maDM: 'DM05' },
  { maMon: 'MA22', tenMon: 'Bánh kem', donGia: 1750000, moTa: 'Bánh kem 3 tầng cao cấp', maDM: 'DM05' },
  { maMon: 'MA23', tenMon: 'Chè thái', donGia: 150000, moTa: 'Chè thái nhiều màu', maDM: 'DM05' },
  { maMon: 'MA24', tenMon: 'Chè hạt sen', donGia: 200000, moTa: 'Chè hạt sen long nhãn', maDM: 'DM05' },
  { maMon: 'MA25', tenMon: 'Hoa quả dĩa', donGia: 100000, moTa: 'Đĩa hoa quả tươi theo mùa', maDM: 'DM05' },
  { maMon: 'MA26', tenMon: 'Nước ngọt', donGia: 150000, moTa: 'Nước ngọt các loại', maDM: 'DM06' },
  { maMon: 'MA27', tenMon: 'Nước uống', donGia: 300000, moTa: 'Nước suối + nước ngọt + bia', maDM: 'DM06' },
  { maMon: 'MA28', tenMon: 'Gà hấp hành', donGia: 380000, moTa: 'Gà ta hấp hành mỡ', maDM: 'DM02' },
  { maMon: 'MA29', tenMon: 'Nem cuốn', donGia: 220000, moTa: 'Nem cuốn tươi sốt chấm', maDM: 'DM01' },
  { maMon: 'MA30', tenMon: 'Bò xào lúc lắc', donGia: 450000, moTa: 'Bò Úc xào lúc lắc khoai tây', maDM: 'DM02' },
  { maMon: 'MA31', tenMon: 'Canh bóng', donGia: 200000, moTa: 'Canh bóng thập cẩm', maDM: 'DM03' },
]

const mockThucDon = [
  {
    maTD: 'TD01', tenThucDon: 'Thực đơn cưới cao cấp', donGia: 1500000,
    monAn: ['MA01', 'MA02', 'MA03', 'MA04', 'MA05', 'MA06', 'MA25', 'MA27'],
  },
  {
    maTD: 'TD02', tenThucDon: 'Thực đơn giỗ truyền thống', donGia: 1200000,
    monAn: ['MA01', 'MA03', 'MA20', 'MA04', 'MA02', 'MA21'],
  },
  {
    maTD: 'TD03', tenThucDon: 'Thực đơn sinh nhật', donGia: 1500000,
    monAn: ['MA10', 'MA11', 'MA12', 'MA13', 'MA23', 'MA22'],
  },
  {
    maTD: 'TD04', tenThucDon: 'Thực đơn liên hoan', donGia: 1500000,
    monAn: ['MA14', 'MA15', 'MA16', 'MA17', 'MA18', 'MA19'],
  },
]

const dmColorMap = {
  'DM01': 'magenta', 'DM02': 'red', 'DM03': 'blue',
  'DM04': 'orange', 'DM05': 'green', 'DM06': 'cyan',
}

// ==================== COMPONENT ====================
export default function ThucDon() {
  const [danhMucs, setDanhMucs] = useState(mockDanhMuc)
  const [monAns, setMonAns] = useState(mockMonAn)
  const [thucDons, setThucDons] = useState(mockThucDon)
  const [searchMon, setSearchMon] = useState('')
  const [filterDM, setFilterDM] = useState(null)

  // Modal states
  const [tdModal, setTdModal] = useState({ open: false, editing: null })
  const [monModal, setMonModal] = useState({ open: false, editing: null })
  const [dmModal, setDmModal] = useState({ open: false, editing: null })
  const [tdDetailModal, setTdDetailModal] = useState({ open: false, data: null })
  const [tdForm] = Form.useForm()
  const [monForm] = Form.useForm()
  const [dmForm] = Form.useForm()

  // ===== THỰC ĐƠN CRUD =====
  // Auto-calculate đơn giá khi chọn món
  const handleMonAnChange = (selectedMons) => {
    const total = selectedMons.reduce((sum, maMon) => {
      const mon = monAns.find(m => m.maMon === maMon)
      return sum + (mon?.donGia || 0)
    }, 0)
    tdForm.setFieldsValue({ donGia: total })
  }

  const handleSaveTD = () => {
    tdForm.validateFields().then(vals => {
      if (tdModal.editing) {
        setThucDons(prev => prev.map(td => td.maTD === tdModal.editing.maTD ? { ...td, ...vals } : td))
        message.success('Đã cập nhật thực đơn')
      } else {
        const maTD = 'TD' + String(thucDons.length + 1).padStart(2, '0')
        setThucDons(prev => [...prev, { maTD, ...vals }])
        message.success('Đã thêm thực đơn mới')
      }
      setTdModal({ open: false, editing: null })
      tdForm.resetFields()
    })
  }

  const handleDeleteTD = (maTD) => {
    setThucDons(prev => prev.filter(td => td.maTD !== maTD))
    message.success('Đã xóa thực đơn')
  }

  // ===== MÓN ĂN CRUD =====
  const handleSaveMon = () => {
    monForm.validateFields().then(vals => {
      if (monModal.editing) {
        setMonAns(prev => prev.map(m => m.maMon === monModal.editing.maMon ? { ...m, ...vals } : m))
        message.success('Đã cập nhật món ăn')
      } else {
        const maMon = 'MA' + String(monAns.length + 1).padStart(2, '0')
        setMonAns(prev => [...prev, { maMon, ...vals }])
        message.success('Đã thêm món ăn mới')
      }
      setMonModal({ open: false, editing: null })
      monForm.resetFields()
    })
  }

  const handleDeleteMon = (maMon) => {
    setMonAns(prev => prev.filter(m => m.maMon !== maMon))
    message.success('Đã xóa món ăn')
  }

  // ===== DANH MỤC CRUD =====
  const handleSaveDM = () => {
    dmForm.validateFields().then(vals => {
      if (dmModal.editing) {
        setDanhMucs(prev => prev.map(dm => dm.maDM === dmModal.editing.maDM ? { ...dm, ...vals } : dm))
        message.success('Đã cập nhật danh mục')
      } else {
        const maDM = 'DM' + String(danhMucs.length + 1).padStart(2, '0')
        setDanhMucs(prev => [...prev, { maDM, ...vals }])
        message.success('Đã thêm danh mục mới')
      }
      setDmModal({ open: false, editing: null })
      dmForm.resetFields()
    })
  }

  const handleDeleteDM = (maDM) => {
    setDanhMucs(prev => prev.filter(dm => dm.maDM !== maDM))
    message.success('Đã xóa danh mục')
  }

  // ===== FILTERED DATA =====
  const filteredMon = monAns.filter(m => {
    const matchSearch = m.tenMon.toLowerCase().includes(searchMon.toLowerCase()) || m.maMon.toLowerCase().includes(searchMon.toLowerCase())
    const matchDM = filterDM ? m.maDM === filterDM : true
    return matchSearch && matchDM
  })

  // ===== STATS =====
  const statCard = (color) => ({
    background: `linear-gradient(135deg, ${color}22, ${color}08)`,
    border: `1px solid ${color}30`, borderRadius: 14, padding: '16px 20px',
  })

  // ==================== TAB 1: THỰC ĐƠN ====================
  const tabThucDon = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <Text type="secondary">Các bộ thực đơn có sẵn cho khách chọn</Text>
        <Button type="primary" icon={<PlusOutlined />}
          onClick={() => { setTdModal({ open: true, editing: null }); tdForm.resetFields() }}
          style={{ borderRadius: 10 }}>Thêm thực đơn</Button>
      </div>

      <Row gutter={[20, 20]}>
        {thucDons.map(td => {
          const tdMonAns = td.monAn.map(id => monAns.find(m => m.maMon === id)).filter(Boolean)
          return (
            <Col xs={24} sm={12} lg={8} xl={6} key={td.maTD}>
              <Card className="glass-effect" hoverable style={{ borderRadius: 16, height: '100%' }}
                actions={[
                  <Tooltip title="Xem chi tiết" key="view">
                    <EyeOutlined onClick={() => setTdDetailModal({ open: true, data: td })} />
                  </Tooltip>,
                  <Tooltip title="Sửa" key="edit">
                    <EditOutlined onClick={() => { setTdModal({ open: true, editing: td }); tdForm.setFieldsValue(td) }} />
                  </Tooltip>,
                  <Popconfirm title="Xóa thực đơn này?" onConfirm={() => handleDeleteTD(td.maTD)} key="del">
                    <DeleteOutlined style={{ color: '#ff4d4f' }} />
                  </Popconfirm>,
                ]}>
                <div style={{ marginBottom: 8 }}>
                  <Text code style={{ fontSize: 11 }}>{td.maTD}</Text>
                </div>
                <Title level={5} style={{ margin: '0 0 8px 0', color: 'var(--primary)' }}>{td.tenThucDon}</Title>
                <div style={{ marginBottom: 12 }}>
                  <Text strong style={{ fontSize: 18, color: '#52c41a' }}>{formatVND(td.donGia)}</Text>
                  <Text type="secondary"> / mâm</Text>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {tdMonAns.slice(0, 5).map(m => (
                    <Tag key={m.maMon} color={dmColorMap[m.maDM]} style={{ borderRadius: 6, fontSize: 11 }}>{m.tenMon}</Tag>
                  ))}
                  {tdMonAns.length > 5 && <Tag style={{ borderRadius: 6 }}>+{tdMonAns.length - 5} món</Tag>}
                </div>
                <div style={{ marginTop: 8 }}>
                  <Badge count={tdMonAns.length} style={{ backgroundColor: 'var(--primary)' }} />
                  <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>món trong thực đơn</Text>
                </div>
              </Card>
            </Col>
          )
        })}
      </Row>
    </div>
  )

  // ==================== TAB 2: MÓN ĂN ====================
  const monColumns = [
    { title: 'Mã', dataIndex: 'maMon', width: 80, render: v => <Text code style={{ fontSize: 12 }}>{v}</Text> },
    { title: 'Tên món', dataIndex: 'tenMon', render: v => <Text strong>{v}</Text> },
    {
      title: 'Danh mục', dataIndex: 'maDM', width: 140,
      render: v => {
        const dm = danhMucs.find(d => d.maDM === v)
        return <Tag color={dmColorMap[v]} style={{ borderRadius: 8 }}>{dm?.tenDanhMuc || v}</Tag>
      },
    },
    {
      title: 'Đơn giá', dataIndex: 'donGia', width: 130, align: 'right',
      render: v => <Text strong>{formatVND(v)}</Text>,
      sorter: (a, b) => a.donGia - b.donGia,
    },
    { title: 'Mô tả', dataIndex: 'moTa', ellipsis: true, render: v => <Text type="secondary">{v}</Text> },
    {
      title: 'Thao tác', key: 'action', width: 100, align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => { setMonModal({ open: true, editing: record }); monForm.setFieldsValue(record) }} />
          </Tooltip>
          <Popconfirm title="Xóa món này?" onConfirm={() => handleDeleteMon(record.maMon)}>
            <Tooltip title="Xóa"><Button type="text" danger icon={<DeleteOutlined />} /></Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const tabMonAn = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card bordered={false} className="glass-effect" style={{ borderRadius: 16 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={8}>
            <Input placeholder="Tìm món ăn..." prefix={<SearchOutlined style={{ color: '#aaa' }} />}
              value={searchMon} onChange={e => setSearchMon(e.target.value)} allowClear style={{ borderRadius: 10 }} />
          </Col>
          <Col xs={12} sm={6}>
            <Select placeholder="Danh mục" value={filterDM} onChange={v => setFilterDM(v)} allowClear
              style={{ width: '100%', borderRadius: 10 }}
              options={danhMucs.map(dm => ({ value: dm.maDM, label: dm.tenDanhMuc }))} />
          </Col>
          <Col xs={12} sm={10} style={{ textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />}
              onClick={() => { setMonModal({ open: true, editing: null }); monForm.resetFields() }}
              style={{ borderRadius: 10 }}>Thêm món</Button>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} className="glass-effect" style={{ borderRadius: 16 }}>
        <Table columns={monColumns} dataSource={filteredMon.map(m => ({ ...m, key: m.maMon }))}
          pagination={{ pageSize: 10, showTotal: t => `Tổng ${t} món` }} rowClassName="order-row" size="middle" />
      </Card>
    </div>
  )

  // ==================== TAB 3: DANH MỤC ====================
  const dmColumns = [
    { title: 'Mã', dataIndex: 'maDM', width: 80, render: v => <Text code>{v}</Text> },
    {
      title: 'Tên danh mục', dataIndex: 'tenDanhMuc',
      render: (v, r) => <Tag color={dmColorMap[r.maDM]} style={{ borderRadius: 8, fontSize: 14, padding: '2px 12px' }}>{v}</Tag>,
    },
    {
      title: 'Số món', key: 'soMon', width: 100, align: 'center',
      render: (_, r) => <Badge count={monAns.filter(m => m.maDM === r.maDM).length} style={{ backgroundColor: 'var(--primary)' }} />,
    },
    {
      title: 'Thao tác', key: 'action', width: 120, align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => { setDmModal({ open: true, editing: record }); dmForm.setFieldsValue(record) }} />
          </Tooltip>
          <Popconfirm title="Xóa danh mục này?" onConfirm={() => handleDeleteDM(record.maDM)}>
            <Tooltip title="Xóa"><Button type="text" danger icon={<DeleteOutlined />} /></Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const tabDanhMuc = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ textAlign: 'right' }}>
        <Button type="primary" icon={<PlusOutlined />}
          onClick={() => { setDmModal({ open: true, editing: null }); dmForm.resetFields() }}
          style={{ borderRadius: 10 }}>Thêm danh mục</Button>
      </div>
      <Card bordered={false} className="glass-effect" style={{ borderRadius: 16 }}>
        <Table columns={dmColumns} dataSource={danhMucs.map(dm => ({ ...dm, key: dm.maDM }))}
          pagination={false} rowClassName="order-row" size="middle" />
      </Card>
    </div>
  )

  // ==================== RENDER ====================
  return (
    <div>
      <h2 className="dashboard-title">Quản lý Thực đơn</h2>

      {/* Stat cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={8}>
          <div style={statCard('#5b8def')}>
            <Statistic title="Tổng thực đơn" value={thucDons.length} prefix={<AppstoreOutlined />} valueStyle={{ color: '#5b8def' }} />
          </div>
        </Col>
        <Col xs={8}>
          <div style={statCard('#52c41a')}>
            <Statistic title="Tổng món ăn" value={monAns.length} prefix={<CoffeeOutlined />} valueStyle={{ color: '#52c41a' }} />
          </div>
        </Col>
        <Col xs={8}>
          <div style={statCard('#faad14')}>
            <Statistic title="Danh mục" value={danhMucs.length} prefix={<TagsOutlined />} valueStyle={{ color: '#faad14' }} />
          </div>
        </Col>
      </Row>

      <Tabs defaultActiveKey="thucdon" size="large" items={[
        { key: 'thucdon', label: <span><AppstoreOutlined style={{ marginRight: 6 }} />Thực đơn</span>, children: tabThucDon },
        { key: 'monan', label: <span><CoffeeOutlined style={{ marginRight: 6 }} />Món ăn ({monAns.length})</span>, children: tabMonAn },
        { key: 'danhmuc', label: <span><TagsOutlined style={{ marginRight: 6 }} />Danh mục</span>, children: tabDanhMuc },
      ]} tabBarStyle={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '4px 8px', marginBottom: 16 }} />

      {/* Modal Thực đơn */}
      <Modal title={tdModal.editing ? 'Sửa thực đơn' : 'Thêm thực đơn mới'} open={tdModal.open}
        onOk={handleSaveTD} onCancel={() => { setTdModal({ open: false, editing: null }); tdForm.resetFields() }}
        okText={tdModal.editing ? 'Cập nhật' : 'Thêm'} cancelText="Hủy" width={600}>
        <Form form={tdForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="tenThucDon" label="Tên thực đơn" rules={[{ required: true, message: 'Nhập tên thực đơn' }]}>
            <Input placeholder="VD: Thực đơn cưới VIP" style={{ borderRadius: 10 }} />
          </Form.Item>
          <Form.Item name="donGia" label="Đơn giá / mâm" rules={[{ required: true, message: 'Nhập đơn giá' }]}>
            <InputNumber min={0} step={50000} style={{ width: '100%', borderRadius: 10 }}
              formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={v => v.replace(/,/g, '')}
              placeholder="VD: 1500000" addonAfter="VNĐ" />
          </Form.Item>
          <Form.Item name="monAn" label="Chọn món ăn" rules={[{ required: true, message: 'Chọn ít nhất 1 món' }]}>
            <Select mode="multiple" placeholder="Chọn các món trong thực đơn"
              onChange={handleMonAnChange}
              options={monAns.map(m => {
                const dm = danhMucs.find(d => d.maDM === m.maDM)
                return { value: m.maMon, label: `${m.tenMon} — ${dm?.tenDanhMuc || ''} (${formatVND(m.donGia)})` }
              })}
              filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chi tiết thực đơn */}
      <Modal title={tdDetailModal.data && `Chi tiết: ${tdDetailModal.data.tenThucDon}`}
        open={tdDetailModal.open} onCancel={() => setTdDetailModal({ open: false, data: null })}
        footer={[<Button key="close" type="primary" onClick={() => setTdDetailModal({ open: false, data: null })}>Đóng</Button>]}
        width={640}>
        {tdDetailModal.data && (() => {
          const td = tdDetailModal.data
          const tdMonAns = td.monAn.map(id => monAns.find(m => m.maMon === id)).filter(Boolean)
          return (
            <>
              <div style={{ background: 'rgba(91,141,239,0.06)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={12}><Text type="secondary">Đơn giá / mâm</Text><div><Text strong style={{ fontSize: 20, color: '#52c41a' }}>{formatVND(td.donGia)}</Text></div></Col>
                  <Col span={12}><Text type="secondary">Số món</Text><div><Text strong style={{ fontSize: 20, color: 'var(--primary)' }}>{tdMonAns.length}</Text></div></Col>
                </Row>
              </div>
              <Table size="small" pagination={false} dataSource={tdMonAns.map(m => ({ ...m, key: m.maMon }))}
                columns={[
                  { title: 'Tên món', dataIndex: 'tenMon', render: v => <Text strong>{v}</Text> },
                  { title: 'Danh mục', dataIndex: 'maDM', width: 120, render: v => { const dm = danhMucs.find(d => d.maDM === v); return <Tag color={dmColorMap[v]}>{dm?.tenDanhMuc}</Tag> } },
                  { title: 'Đơn giá', dataIndex: 'donGia', width: 130, align: 'right', render: v => formatVND(v) },
                ]} />
            </>
          )
        })()}
      </Modal>

      {/* Modal Món ăn */}
      <Modal title={monModal.editing ? 'Sửa món ăn' : 'Thêm món ăn mới'} open={monModal.open}
        onOk={handleSaveMon} onCancel={() => { setMonModal({ open: false, editing: null }); monForm.resetFields() }}
        okText={monModal.editing ? 'Cập nhật' : 'Thêm'} cancelText="Hủy" width={640}>
        <Form form={monForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="tenMon" label="Tên món" rules={[{ required: true }]}>
            <Input placeholder="VD: Gà luộc lá chanh" style={{ borderRadius: 10 }} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="maDM" label="Danh mục" rules={[{ required: true }]}>
                <Select placeholder="Chọn danh mục" options={danhMucs.map(dm => ({ value: dm.maDM, label: dm.tenDanhMuc }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="donGia" label="Đơn giá / mâm" rules={[{ required: true }]}>
                <InputNumber min={0} step={10000} style={{ width: '100%' }} addonAfter="VNĐ"
                  formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={v => v.replace(/,/g, '')} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="moTa" label="Mô tả">
            <Input.TextArea rows={2} placeholder="Mô tả món ăn..." />
          </Form.Item>
          <Divider orientation="left" style={{ fontSize: 13, margin: '8px 0 12px' }}>Nguyên liệu & Định lượng / mâm</Divider>
          <Form.List name="nguyenLieu">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <Row key={key} gutter={8} align="middle" style={{ marginBottom: 8 }}>
                    <Col span={9}>
                      <Form.Item {...rest} name={[name, 'ten']} rules={[{ required: true, message: 'Chọn NL' }]} style={{ marginBottom: 0 }}>
                        <Select placeholder="Nguyên liệu" showSearch
                          filterOption={(input, opt) => opt.label.toLowerCase().includes(input.toLowerCase())}
                          options={[
                            'Thịt lợn','Thịt gà','Tôm sú','Cá chép','Rau muống','Hành lá',
                            'Gạo nếp','Nấm hương','Miến dong','Giò lụa','Trứng gà','Đậu phụ',
                            'Bò','Bún','Mắc mắm','Dầu ăn','Muối','Đường','Tỏi','Gừng',
                          ].map(v => ({ value: v, label: v }))} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...rest} name={[name, 'dinhLuong']} rules={[{ required: true, message: 'Nhập SL' }]} style={{ marginBottom: 0 }}>
                        <InputNumber min={0} placeholder="Số lượng" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...rest} name={[name, 'donVi']} initialValue="g" style={{ marginBottom: 0 }}>
                        <Select options={[
                          { value: 'g', label: 'gram' },
                          { value: 'kg', label: 'kg' },
                          { value: 'ml', label: 'ml' },
                          { value: 'lít', label: 'lít' },
                          { value: 'quả', label: 'quả' },
                          { value: 'bó', label: 'bó' },
                        ]} />
                      </Form.Item>
                    </Col>
                    <Col span={3} style={{ textAlign: 'center' }}>
                      <MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f', fontSize: 18, cursor: 'pointer' }} />
                    </Col>
                  </Row>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ borderRadius: 10 }}>
                  Thêm nguyên liệu
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* Modal Danh mục */}
      <Modal title={dmModal.editing ? 'Sửa danh mục' : 'Thêm danh mục mới'} open={dmModal.open}
        onOk={handleSaveDM} onCancel={() => { setDmModal({ open: false, editing: null }); dmForm.resetFields() }}
        okText={dmModal.editing ? 'Cập nhật' : 'Thêm'} cancelText="Hủy">
        <Form form={dmForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="tenDanhMuc" label="Tên danh mục" rules={[{ required: true, message: 'Nhập tên danh mục' }]}>
            <Input placeholder="VD: Món chính" style={{ borderRadius: 10 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
