import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Typography, Tag } from 'antd'
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  BookOutlined,
  DatabaseOutlined,
  TeamOutlined,
  BarChartOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FireOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import Logo from '../components/Logo'

const { Header, Sider, Content } = Layout
const { Text } = Typography

// Fake user — sau này lấy từ API/JWT
const currentUser = {
  name: 'Lương',
  role: 'QuanLy' ,
}

// Menu items với phân quyền
const allMenuItems = [
  { key: '/', icon: <DashboardOutlined />, label: 'Tổng quan', roles: ['QuanLy'] },
  { key: '/don-hang', icon: <ShoppingCartOutlined />, label: 'Đơn hàng', roles: ['QuanLy', 'NVDongGoi', 'ThuNgan'] },
  { key: '/dong-goi', icon: <InboxOutlined />, label: 'Đóng gói', roles: ['QuanLy', 'NVDongGoi'] },
  { key: '/bep', icon: <FireOutlined />, label: 'Bếp', roles: ['QuanLy', 'Bep'] },
  { key: '/thuc-don', icon: <BookOutlined />, label: 'Thực đơn', roles: ['QuanLy'] },
  { key: '/nguyen-lieu', icon: <DatabaseOutlined />, label: 'Nguyên liệu', roles: ['QuanLy'] },
  { key: '/hoa-don', icon: <FileTextOutlined />, label: 'Hóa đơn', roles: ['QuanLy', 'ThuNgan'] },
  { key: '/nhan-vien', icon: <TeamOutlined />, label: 'Nhân viên', roles: ['QuanLy'] },
  { key: '/bao-cao', icon: <BarChartOutlined />, label: 'Báo cáo', roles: ['QuanLy'] },
]

const roleLabels = {
  QuanLy: { text: 'Quản lý', color: 'blue' },
  NVDongGoi: { text: 'NV Đóng gói', color: 'green' },
  Bep: { text: 'Bếp', color: 'orange' },
  ThuNgan: { text: 'Thu ngân', color: 'purple' },
}

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Lọc menu theo role
  const visibleMenuItems = allMenuItems
    .filter((item) => item.roles.includes(currentUser.role))
    .map(({ key, icon, label }) => ({ key, icon, label }))

  const userMenuItems = [
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        className="custom-sider"
        style={{
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid var(--glass-border)',
            gap: 10,
          }}
        >
          <Logo size={32} color="var(--primary)" />
          {!collapsed && (
            <span className="brand-logo">Phượng Quyên</span>
          )}
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={visibleMenuItems}
          onClick={({ key }) => navigate(key)}
          style={{ marginTop: 12 }}
        />
      </Sider>

      {/* Main area */}
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)', background: 'transparent' }}>
        {/* Header */}
        <Header
          className="custom-header"
          style={{
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 9,
          }}
        >
          {/* Toggle sidebar */}
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 20, cursor: 'pointer', color: 'var(--text-dark)', transition: 'color 0.3s' }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>

          {/* User info */}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'background 0.3s' }} className="hover-bg">
              <Tag color={roleLabels[currentUser.role].color} style={{ borderRadius: 12, padding: '0 10px' }}>
                {roleLabels[currentUser.role].text}
              </Tag>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: 'var(--primary)' }} />
              <Text strong style={{ color: 'var(--text-dark)' }}>{currentUser.name}</Text>
            </div>
          </Dropdown>
        </Header>

        {/* Page content */}
        <Content style={{ margin: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
