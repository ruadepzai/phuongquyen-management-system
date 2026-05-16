import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#5b8def',
          borderRadius: 12,
          fontFamily: "'Outfit', 'Inter', sans-serif",
          colorBgContainer: 'rgba(255, 255, 255, 0.4)',
          colorBorderSecondary: 'transparent',
        },
        components: {
          Card: {
            colorBgContainer: 'transparent',
          }
        }
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
)
