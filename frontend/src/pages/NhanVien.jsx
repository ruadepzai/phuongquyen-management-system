import { useState } from 'react'
import {
  Table, Button, Tag, Space, Card, Modal, Form,
  Input, Select, message, Tooltip, Typography, Avatar, Popconfirm
} from 'antd'
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  UserOutlined, SearchOutlined
} from '@ant-design/icons'

const { Text } = Typography

// ==================== MOCK DATA ====================
const initialStaff = [
  { key: '1', maNV: 'NV001', hoTen: 'Nguyễn Văn Lương', sdt: '0901 234 567', role: 'QuanLy', taiKhoan: 'admin', matKhau: '123456', trangThai: 'active' },
  { key: '2', maNV: 'NV002', hoTen: 'Trần Thị Mai', sdt: '0912 345 678', role: 'NVDongGoi', taiKhoan: 'nv', matKhau: '123', trangThai: 'active' },
  { key: '3', maNV: 'NV003', hoTen: 'Lê Hoàng Phúc', sdt: '0987 654 321', role: 'NVDongGoi', taiKhoan: 'phuc.lh', matKhau: '123', trangThai: 'active' },
  { key: '4', maNV: 'NV004', hoTen: 'Phạm Minh Đức', sdt: '0976 543 210', role: 'Bep', taiKhoan: 'duc.pm', matKhau: '123', trangThai: 'active' },
  { key: '5', maNV: 'NV005', hoTen: 'Võ Thị Hồng', sdt: '0933 111 222', role: 'Bep', taiKhoan: 'hong.vt', matKhau: '123', trangThai: 'active' },
  { key: '6', maNV: 'NV006', hoTen: 'Đặng Quốc Huy', sdt: '0909 888 777', role: 'ThuNgan', taiKhoan: 'huy.dq', matKhau: '123', trangThai: 'active' },
  { key: '7', maNV: 'NV007', hoTen: 'Bùi Thanh Tâm', sdt: '0977 222 333', role: 'ThuNgan', taiKhoan: 'tam.bt', matKhau: '123', trangThai: 'inactive' },
]

const roleConfig = {
  QuanLy:       { text: 'Quản lý',        color: 'blue' },
  NVDongGoi:    { text: 'NV Đóng gói',    color: 'green' },
  Bep:          { text: 'Bếp',            color: 'orange' },
  ThuNgan:      { text: 'Thu ngân',       color: 'purple' },
}

// ==================== COMPONENT ====================
export default function NhanVien() {
  const [staff, setStaff] = useState(initialStaff)
  const [searchText, setSearchText] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingKey, setEditingKey] = useState(null)
  const [form] = Form.useForm()

  // Lọc
  const filtered = staff.filter((s) =>
    s.hoTen.toLowerCase().includes(searchText.toLowerCase()) ||
    s.maNV.toLowerCase().includes(searchText.toLowerCase()) ||
    s.sdt.includes(searchText)
  )

  // Mở modal thêm
  const handleAdd = () => {
    setEditingKey(null)
    form.resetFields()
    form.setFieldsValue({ maNV: 'NV' + String(staff.length + 1).padStart(3, '0'), trangThai: 'active' })
    setModalOpen(true)
  }

  // Mở modal sửa
  const handleEdit = (record) => {
    setEditingKey(record.key)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  // Xóa
  const handleDelete = (key) => {
    setStaff((prev) => prev.filter((s) => s.key !== key))
    message.success('Đã xóa nhân viên')
  }

  // Lưu (thêm hoặc sửa)
  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingKey) {
        setStaff((prev) => prev.map((s) => s.key === editingKey ? { ...s, ...values } : s))
        message.success('Đã cập nhật thông tin')
      } else {
        const newItem = { ...values, key: String(Date.now()) }
        setStaff((prev) => [...prev, newItem])
        message.success('Đã thêm nhân viên mới')
      }
      setModalOpen(false)
    })
  }

  // Cột bảng
  const columns = [
    {
      title: 'Mã NV',
      dataIndex: 'maNV',
      key: 'maNV',
      width: 100,
      render: (text) => <Text strong style={{ color: 'var(--primary)' }}>{text}</Text>,
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      render: (text) => (
        <Space>
          <Avatar style={{ backgroundColor: 'var(--primary)' }} icon={<UserOutlined />} size="small" />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'SĐT',
      dataIndex: 'sdt',
      key: 'sdt',
      width: 140,
    },
    {
      title: 'Tài khoản',
      dataIndex: 'taiKhoan',
      key: 'taiKhoan',
      width: 120,
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 150,
      render: (role) => {
        const cfg = roleConfig[role]
        return <Tag color={cfg.color} style={{ borderRadius: 12 }}>{cfg.text}</Tag>
      },
      filters: Object.entries(roleConfig).map(([value, cfg]) => ({ text: cfg.text, value })),
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'} style={{ borderRadius: 12 }}>
          {status === 'active' ? 'Đang làm' : 'Nghỉ việc'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm title="Xóa nhân viên này?" onConfirm={() => handleDelete(record.key)} okText="Xóa" cancelText="Hủy">
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <h2 className="dashboard-title">Quản lý Nhân viên</h2>

      {/* Thanh công cụ */}
      <Card bordered={false} className="glass-effect" style={{ borderRadius: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Input
            placeholder="Tìm tên, mã NV, SĐT..."
            prefix={<SearchOutlined style={{ color: '#aaa' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ maxWidth: 320, borderRadius: 10 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ borderRadius: 10, height: 40, fontWeight: 600 }}>
            Thêm nhân viên
          </Button>
        </div>
      </Card>

      {/* Bảng */}
      <Card bordered={false} className="glass-effect" style={{ borderRadius: 16 }}>
        <Table
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} nhân viên` }}
          rowClassName="order-row"
        />
      </Card>

      {/* Modal Thêm / Sửa */}
      <Modal
        title={editingKey ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText={editingKey ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="maNV" label="Mã nhân viên" rules={[{ required: true, message: 'Nhập mã NV' }]}>
            <Input disabled={!!editingKey} style={{ borderRadius: 10 }} />
          </Form.Item>
          <Form.Item name="hoTen" label="Họ và tên" rules={[{ required: true, message: 'Nhập họ tên' }]}>
            <Input style={{ borderRadius: 10 }} />
          </Form.Item>
          <Form.Item name="sdt" label="Số điện thoại" rules={[{ required: true, message: 'Nhập SĐT' }]}>
            <Input style={{ borderRadius: 10 }} />
          </Form.Item>
          <Form.Item name="taiKhoan" label="Tên đăng nhập" rules={[{ required: true, message: 'Nhập tài khoản' }]}>
            <Input style={{ borderRadius: 10 }} disabled={!!editingKey} placeholder="VD: nguyenvan.a" />
          </Form.Item>
          <Form.Item name="matKhau" label="Mật khẩu" rules={[{ required: !editingKey, message: 'Nhập mật khẩu' }]}>
            <Input.Password style={{ borderRadius: 10 }} placeholder={editingKey ? 'Bỏ trống nếu không đổi' : ''} />
          </Form.Item>
          <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: 'Chọn vai trò' }]}>
            <Select
              style={{ borderRadius: 10 }}
              options={Object.entries(roleConfig).map(([value, cfg]) => ({ value, label: cfg.text }))}
            />
          </Form.Item>
          <Form.Item name="trangThai" label="Trạng thái">
            <Select
              options={[
                { value: 'active', label: 'Đang làm' },
                { value: 'inactive', label: 'Nghỉ việc' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
