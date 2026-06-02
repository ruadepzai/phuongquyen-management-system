import { Button, Form, Input, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

const { Title, Text } = Typography

export default function Login() {
  const navigate = useNavigate()

  const onFinish = (values) => {
    if (values.username === 'admin' && values.password === '123456') {
      localStorage.setItem('user', JSON.stringify({ name: 'Admin', role: 'QuanLy' }))
      message.success('Đăng nhập thành công!')
      navigate('/')
    } else if (values.username === 'nv' && values.password === '123') {
      localStorage.setItem('user', JSON.stringify({ name: 'Nhân viên', role: 'NhanVien' }))
      message.success('Đăng nhập thành công với quyền Nhân viên!')
      navigate('/')
    } else {
      message.error('Tài khoản hoặc mật khẩu không đúng')
    }
  }

  return (
    <div className="login-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      
      <div className="login-card glass-effect">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="login-logo-container">
            <Logo size={42} color="white" />
          </div>
          <Title level={2} style={{ margin: '16px 0 8px 0', fontWeight: 800 }}>Phượng Quyên</Title>
          <Text type="secondary" style={{ fontSize: 16 }}>Hệ thống Quản lý Đặt cỗ & Đóng gói</Text>
        </div>

        <Form name="login_form" initialValues={{ remember: true }} onFinish={onFinish} size="large" layout="vertical">
          <Form.Item name="username" rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}>
            <Input prefix={<UserOutlined style={{ color: 'var(--text-muted)' }} />} placeholder="Tên đăng nhập" className="login-input" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
            <Input.Password prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />} placeholder="Mật khẩu" className="login-input" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block className="login-btn">Đăng nhập</Button>
          </Form.Item>
          <div style={{ textAlign: 'center', marginTop: 16, background: 'rgba(255,255,255,0.5)', padding: 12, borderRadius: 8 }}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Tài khoản demo:<br/>
              Quản lý: <strong>admin / 123456</strong><br/>
              Nhân viên: <strong>nv / 123</strong>
            </Text>
          </div>
        </Form>
      </div>
    </div>
  )
}
