import { useState } from 'react'
import {
  Card, Row, Col, Tag, Button, Badge, Checkbox, InputNumber, Select, Radio,
  Modal, Input, Space, Typography, Divider, message, Empty, Tooltip
} from 'antd'
import {
  CheckCircleOutlined, ExclamationCircleOutlined, PrinterOutlined,
  InboxOutlined, ClockCircleOutlined, SyncOutlined,
  WarningOutlined, CheckOutlined, ArrowLeftOutlined,
  ReloadOutlined
} from '@ant-design/icons'

const { Text, Title } = Typography
const { TextArea } = Input

// Format VNĐ
function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

// ==================== MOCK DATA ====================
const mockPackOrders = [
  {
    key: '1',
    maDH: 'HD1-010526',
    khachHang: 'Nguyễn Văn An',
    loai: 'Cỗ cưới',
    soMam: 15,
    ngayGiao: '03/05/2026',
    gioGiao: '10:00',
    diaChi: '45 Lê Lợi, Q.1',
    ghiChu: 'Giao trước 10h sáng',
    trangThai: 'ChoXuLy',
    items: [
      { id: 1, mon: 'Gà luộc lá chanh', slYeuCau: 15, slThucTe: null, checked: false },
      { id: 2, mon: 'Nem rán', slYeuCau: 15, slThucTe: null, checked: false },
      { id: 3, mon: 'Xôi gấc', slYeuCau: 15, slThucTe: null, checked: false },
      { id: 4, mon: 'Canh măng', slYeuCau: 15, slThucTe: null, checked: false },
      { id: 5, mon: 'Giò thủ', slYeuCau: 15, slThucTe: null, checked: false },
      { id: 6, mon: 'Chè sen', slYeuCau: 15, slThucTe: null, checked: false },
    ],
    dungCu: [
      { id: 101, ten: 'Đĩa tròn lớn', slYeuCau: 15, slThucTe: null, checked: false },
      { id: 102, ten: 'Bát canh', slYeuCau: 15, slThucTe: null, checked: false },
      { id: 103, ten: 'Đũa + Thìa', slYeuCau: 15, slThucTe: null, checked: false },
      { id: 104, ten: 'Ly thủy tinh', slYeuCau: 15, slThucTe: null, checked: false },
      { id: 105, ten: 'Khăn ướt', slYeuCau: 15, slThucTe: null, checked: false },
    ],
  },
  {
    key: '2',
    maDH: 'HD2-020526',
    khachHang: 'Trần Thị Bích',
    loai: 'Cỗ giỗ',
    soMam: 8,
    ngayGiao: '05/05/2026',
    gioGiao: '08:30',
    diaChi: '12 Hoàng Diệu, Q.4',
    ghiChu: '',
    trangThai: 'ChoXuLy',
    items: [
      { id: 1, mon: 'Gà luộc lá chanh', slYeuCau: 8, slThucTe: null, checked: false },
      { id: 2, mon: 'Xôi gấc', slYeuCau: 8, slThucTe: null, checked: false },
      { id: 3, mon: 'Canh bóng', slYeuCau: 8, slThucTe: null, checked: false },
      { id: 4, mon: 'Giò lụa', slYeuCau: 8, slThucTe: null, checked: false },
      { id: 5, mon: 'Chè kho', slYeuCau: 8, slThucTe: null, checked: false },
    ],
    dungCu: [
      { id: 101, ten: 'Đĩa tròn lớn', slYeuCau: 8, slThucTe: null, checked: false },
      { id: 102, ten: 'Bát canh', slYeuCau: 8, slThucTe: null, checked: false },
      { id: 103, ten: 'Đũa + Thìa', slYeuCau: 8, slThucTe: null, checked: false },
      { id: 104, ten: 'Khăn ướt', slYeuCau: 8, slThucTe: null, checked: false },
    ],
  },
  {
    key: '3',
    maDH: 'HD3-030526',
    khachHang: 'Lê Hoàng Nam',
    loai: 'Sinh nhật',
    soMam: 5,
    ngayGiao: '06/05/2026',
    gioGiao: '17:00',
    diaChi: '78 Nguyễn Trãi, Q.5',
    ghiChu: 'Cần thêm bánh kem 3 tầng',
    trangThai: 'DangDongGoi',
    items: [
      { id: 1, mon: 'Bò nướng lá lốt', slYeuCau: 5, slThucTe: 5, checked: true },
      { id: 2, mon: 'Gỏi cuốn', slYeuCau: 5, slThucTe: 5, checked: true },
      { id: 3, mon: 'Cơm chiên', slYeuCau: 5, slThucTe: null, checked: false },
      { id: 4, mon: 'Canh chua cá', slYeuCau: 5, slThucTe: null, checked: false },
      { id: 5, mon: 'Bánh kem', slYeuCau: 1, slThucTe: null, checked: false },
    ],
    dungCu: [
      { id: 101, ten: 'Đĩa tròn nhỏ', slYeuCau: 5, slThucTe: null, checked: false },
      { id: 102, ten: 'Bát canh', slYeuCau: 5, slThucTe: null, checked: false },
      { id: 103, ten: 'Đũa + Thìa', slYeuCau: 5, slThucTe: null, checked: false },
      { id: 104, ten: 'Dao + Nĩa', slYeuCau: 5, slThucTe: null, checked: false },
    ],
  },
  {
    key: '4',
    maDH: 'HD6-060526',
    khachHang: 'Đặng Quốc Việt',
    loai: 'Liên hoan',
    soMam: 12,
    ngayGiao: '09/05/2026',
    gioGiao: '11:30',
    diaChi: '90 ĐBP, Bình Thạnh',
    ghiChu: 'Giao tầng 5, có thang máy',
    trangThai: 'DangDongGoi',
    items: [
      { id: 1, mon: 'Bò sốt tiêu đen', slYeuCau: 12, slThucTe: 12, checked: true },
      { id: 2, mon: 'Cá chiên giòn', slYeuCau: 12, slThucTe: 10, checked: true, thieu: 2, lyDo: 'Bếp chưa chiên kịp', trangThaiBoSung: 'ChuaBoSung' },
      { id: 3, mon: 'Gỏi ngó sen', slYeuCau: 12, slThucTe: 12, checked: true },
      { id: 4, mon: 'Xôi vò', slYeuCau: 12, slThucTe: null, checked: false },
      { id: 5, mon: 'Canh cua', slYeuCau: 12, slThucTe: null, checked: false },
      { id: 6, mon: 'Chè thập cẩm', slYeuCau: 12, slThucTe: null, checked: false },
    ],
    dungCu: [
      { id: 101, ten: 'Đĩa tròn lớn', slYeuCau: 12, slThucTe: null, checked: false },
      { id: 102, ten: 'Bát canh', slYeuCau: 12, slThucTe: null, checked: false },
      { id: 103, ten: 'Đũa + Thìa', slYeuCau: 12, slThucTe: null, checked: false },
      { id: 104, ten: 'Ly thủy tinh', slYeuCau: 12, slThucTe: null, checked: false },
      { id: 105, ten: 'Khăn ướt', slYeuCau: 12, slThucTe: null, checked: false },
    ],
  },
]

const statusMap = {
  ChoXuLy: { text: 'Chờ đóng gói', color: 'gold', icon: <ClockCircleOutlined /> },
  DangDongGoi: { text: 'Đang đóng', color: 'processing', icon: <SyncOutlined spin /> },
  HoanThanh: { text: 'Hoàn thành', color: 'success', icon: <CheckCircleOutlined /> },
}

// ==================== COMPONENT ====================
export default function DongGoi() {
  const [orders, setOrders] = useState(mockPackOrders)
  const [selectedKey, setSelectedKey] = useState(null)
  const [theuModal, setThieuModal] = useState({ open: false, itemId: null })
  const [theuSL, setThieuSL] = useState(0)
  const [theuLyDo, setThieuLyDo] = useState('')
  const [labelModal, setLabelModal] = useState({ open: false, order: null })
  const [labelType, setLabelType] = useState(null) // 'monAn' | 'doDung' | 'caHai'
  const [labelQty, setLabelQty] = useState(1)
  const [labelQtyDC, setLabelQtyDC] = useState(1)
  const [labelStep, setLabelStep] = useState(1) // 1: chon loai, 2: nhap SL, 3: preview
  const [thieuDCModal, setThieuDCModal] = useState({ open: false, dcId: null })
  const [thieuDCSL, setThieuDCSL] = useState(0)
  const [thieuDCLyDo, setThieuDCLyDo] = useState('')

  const selectedOrder = orders.find((o) => o.key === selectedKey)

  // Tính tiến độ
  const getProgress = (order) => {
    const done = order.items.filter((i) => i.checked).length
    return { done, total: order.items.length }
  }

  // UC4: Xác nhận 1 món đã đủ số lượng
  const confirmItem = (itemId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.key !== selectedKey) return o
        return {
          ...o,
          trangThai: 'DangDongGoi',
          items: o.items.map((item) => {
            if (item.id !== itemId) return item
            return { ...item, checked: true, slThucTe: item.slYeuCau }
          }),
        }
      })
    )
    message.success('Đã xác nhận ✓')
  }

  // UC6: Mở modal báo thiếu
  const openBaoThieu = (itemId) => {
    setThieuModal({ open: true, itemId })
    setThieuSL(0)
    setThieuLyDo('')
  }

  // UC6: Xác nhận báo thiếu
  const submitBaoThieu = () => {
    if (theuSL <= 0) {
      message.warning('Vui lòng nhập số lượng thực tế')
      return
    }
    setOrders((prev) =>
      prev.map((o) => {
        if (o.key !== selectedKey) return o
        return {
          ...o,
          trangThai: 'DangDongGoi',
          items: o.items.map((item) => {
            if (item.id !== theuModal.itemId) return item
            return {
              ...item,
              checked: true,
              slThucTe: theuSL,
              thieu: item.slYeuCau - theuSL,
              lyDo: theuLyDo,
              thoiGianBao: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              trangThaiBoSung: 'ChuaBoSung',
            }
          }),
        }
      })
    )
    setThieuModal({ open: false, itemId: null })
    message.warning('Đã ghi nhận thiếu món')
  }

  // Xác nhận đã bổ sung món thiếu
  const confirmBoSung = (itemId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.key !== selectedKey) return o
        return {
          ...o,
          items: o.items.map((item) => {
            if (item.id !== itemId) return item
            return { ...item, trangThaiBoSung: 'DaBoSung', slThucTe: item.slYeuCau, thieu: 0 }
          }),
        }
      })
    )
    message.success('Đã bổ sung món thành công!')
  }

  // ==== Dụng cụ: xác nhận đủ ====
  const confirmDungCu = (dcId) => {
    setOrders(prev => prev.map(o => {
      if (o.key !== selectedKey) return o
      return { ...o, dungCu: o.dungCu.map(dc => dc.id !== dcId ? dc : { ...dc, checked: true, slThucTe: dc.slYeuCau }) }
    }))
    message.success('Đã xác nhận dụng cụ ✓')
  }
  // ==== Dụng cụ: báo thiếu ====
  const openBaoThieuDC = (dcId) => { setThieuDCModal({ open: true, dcId }); setThieuDCSL(0); setThieuDCLyDo('') }
  const submitBaoThieuDC = () => {
    if (thieuDCSL <= 0) { message.warning('Vui lòng nhập số lượng thực tế'); return }
    setOrders(prev => prev.map(o => {
      if (o.key !== selectedKey) return o
      return { ...o, dungCu: o.dungCu.map(dc => {
        if (dc.id !== thieuDCModal.dcId) return dc
        return { ...dc, checked: true, slThucTe: thieuDCSL, thieu: dc.slYeuCau - thieuDCSL, lyDo: thieuDCLyDo, trangThaiBoSung: 'ChuaBoSung' }
      }) }
    }))
    setThieuDCModal({ open: false, dcId: null })
    message.warning('Đã ghi nhận thiếu dụng cụ')
  }
  const confirmBoSungDC = (dcId) => {
    setOrders(prev => prev.map(o => {
      if (o.key !== selectedKey) return o
      return { ...o, dungCu: o.dungCu.map(dc => dc.id !== dcId ? dc : { ...dc, trangThaiBoSung: 'DaBoSung', slThucTe: dc.slYeuCau, thieu: 0 }) }
    }))
    message.success('Đã bổ sung dụng cụ!')
  }

  // UC5: Xác nhận hoàn thành đóng gói toàn bộ đơn
  const completeOrder = () => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.key !== selectedKey) return o
        return { ...o, trangThai: 'HoanThanh' }
      })
    )
    message.success('🎉 Đã hoàn thành đóng gói đơn ' + selectedOrder.maDH)
    setSelectedKey(null)
  }

  // UC3: In nhãn — mở modal chọn loại
  const printLabel = (order) => {
    setLabelModal({ open: true, order })
    setLabelType(null)
    setLabelQty(1)
    setLabelQtyDC(1)
    setLabelStep(1)
  }

  // ==================== RENDER ====================
  // Nếu chưa chọn đơn → hiển thị danh sách đơn cần đóng gói (UC1)
  if (!selectedOrder) {
    const pendingOrders = orders.filter((o) => o.trangThai !== 'HoanThanh')
    return (
      <div className="pack-container">
        <h2 className="dashboard-title">Đóng gói đơn hàng</h2>

        {pendingOrders.length === 0 ? (
          <Card className="glass-effect" style={{ borderRadius: 16, textAlign: 'center', padding: 40 }}>
            <Empty description="Không có đơn nào cần đóng gói 🎉" />
          </Card>
        ) : (
          <Row gutter={[20, 20]}>
            {pendingOrders.map((order) => {
              const { done, total } = getProgress(order)
              const status = statusMap[order.trangThai]
              return (
                <Col xs={24} sm={12} lg={8} key={order.key}>
                  <Card
                    className="glass-effect pack-order-card"
                    hoverable
                    onClick={() => setSelectedKey(order.key)}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <Text strong style={{ fontSize: 18, color: 'var(--primary)' }}>{order.maDH}</Text>
                      <Tag icon={status.icon} color={status.color} style={{ borderRadius: 12 }}>{status.text}</Tag>
                    </div>

                    {/* Info */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{order.khachHang}</div>
                      <Text type="secondary">{order.loai} • {order.soMam} mâm</Text>
                    </div>

                    {/* Giao hàng */}
                    <div style={{ background: 'rgba(91,141,239,0.06)', borderRadius: 10, padding: '8px 12px', marginBottom: 12 }}>
                      <Text type="secondary">🕐 Giao: </Text>
                      <Text strong>{order.ngayGiao} lúc {order.gioGiao}</Text>
                    </div>

                    {/* Tiến độ */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text type="secondary">Tiến độ: </Text>
                        <Text strong style={{ color: done === total ? '#52c41a' : '#faad14' }}>
                          {done}/{total} món
                        </Text>
                      </div>

                      {/* Progress bar mini */}
                      <div style={{ width: 80, height: 6, borderRadius: 3, background: '#eee', overflow: 'hidden' }}>
                        <div style={{
                          width: `${(done / total) * 100}%`,
                          height: '100%',
                          borderRadius: 3,
                          background: done === total ? '#52c41a' : 'var(--primary)',
                          transition: 'width 0.3s ease',
                        }} />
                      </div>
                    </div>
                  </Card>
                </Col>
              )
            })}
          </Row>
        )}
      </div>
    )
  }

  // ==================== ĐÃ CHỌN ĐƠN → Hiển thị chi tiết (UC2 + UC4 + UC6) ====================
  const { done, total } = getProgress(selectedOrder)
  const dcDone = (selectedOrder.dungCu || []).filter(d => d.checked).length
  const dcTotal = (selectedOrder.dungCu || []).length
  const allChecked = done === total && dcDone === dcTotal
  const status = statusMap[selectedOrder.trangThai]
  const hasThieu = selectedOrder.items.some((i) => i.thieu > 0)
  const hasUnresolvedThieu = selectedOrder.items.some((i) => i.thieu > 0 && i.trangThaiBoSung !== 'DaBoSung')
    || (selectedOrder.dungCu || []).some((d) => d.thieu > 0 && d.trangThaiBoSung !== 'DaBoSung')

  return (
    <div className="pack-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <Space size="middle" wrap>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => setSelectedKey(null)}
            className="pack-btn-back"
          >
            Quay lại
          </Button>
          <Title level={3} style={{ margin: 0 }}>{selectedOrder.maDH}</Title>
          <Tag icon={status.icon} color={status.color} style={{ borderRadius: 12, fontSize: 14, padding: '2px 12px' }}>
            {status.text}
          </Tag>
        </Space>

        <Space wrap>
          <Button
            icon={<PrinterOutlined />}
            onClick={() => printLabel(selectedOrder)}
            className="pack-btn"
          >
            In nhãn
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            disabled={!allChecked || selectedOrder.trangThai === 'HoanThanh' || hasUnresolvedThieu}
            onClick={completeOrder}
            className="pack-btn pack-btn-done"
            style={{ height: 44 }}
          >
            {hasUnresolvedThieu ? 'Có món/dụng cụ chưa bổ sung' : !allChecked ? 'Chưa kiểm tra hết' : 'Hoàn thành đóng gói'}
          </Button>
        </Space>
      </div>

      {/* Thông tin đơn — full width */}
      <Card className="glass-effect" style={{ borderRadius: 16, marginBottom: 20 }}>
        <Row gutter={16}>
          <Col span={4}>
            <Text type="secondary">Khách hàng</Text>
            <div><Text strong style={{ fontSize: 15 }}>{selectedOrder.khachHang}</Text></div>
          </Col>
          <Col span={3}>
            <Text type="secondary">Loại tiệc</Text>
            <div><Text>{selectedOrder.loai}</Text></div>
          </Col>
          <Col span={3}>
            <Text type="secondary">Số mâm</Text>
            <div><Text strong style={{ fontSize: 18, color: 'var(--primary)' }}>{selectedOrder.soMam}</Text></div>
          </Col>
          <Col span={4}>
            <Text type="secondary">Ngày giao</Text>
            <div><Text>{selectedOrder.ngayGiao} - {selectedOrder.gioGiao}</Text></div>
          </Col>
          <Col span={5}>
            <Text type="secondary">Địa chỉ</Text>
            <div><Text>{selectedOrder.diaChi}</Text></div>
          </Col>
          <Col span={5}>
            <Text type="secondary">Tiến độ</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <Text strong style={{ fontSize: 18, color: allChecked ? '#52c41a' : 'var(--primary)' }}>{done}/{total}</Text>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#eee', overflow: 'hidden' }}>
                <div style={{ width: `${(done / total) * 100}%`, height: '100%', borderRadius: 3, background: allChecked ? '#52c41a' : 'var(--primary)', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          </Col>
        </Row>
        {selectedOrder.ghiChu && (
          <div style={{ background: '#fff7e6', borderRadius: 8, padding: '6px 12px', marginTop: 12 }}>
            <Text type="warning">⚠ {selectedOrder.ghiChu}</Text>
          </div>
        )}
      </Card>

      {/* 2 cột: Món ăn (trái) + Dụng cụ (phải) */}
      <Row gutter={[20, 20]}>
        {/* Danh sách món */}
        <Col xs={24} lg={12}>
          <Card className="glass-effect" style={{ borderRadius: 16 }}>
            <Title level={5} style={{ marginBottom: 16 }}>Danh sách món — Kiểm tra & Đóng gói</Title>
            <div className="pack-items-list">
              {selectedOrder.items.map((item) => (
                <div key={item.id}
                  className={`pack-item ${item.checked ? 'pack-item-done' : ''} ${item.thieu > 0 ? 'pack-item-thieu' : ''}`}>
                  <div className="pack-item-info">
                    <div className="pack-item-name">{item.mon}</div>
                    <div className="pack-item-qty">
                      SL yêu cầu: <strong>{item.slYeuCau}</strong>
                      {item.checked && item.slThucTe !== null && (
                        <span style={{ marginLeft: 12 }}>
                          → Thực tế: <strong style={{ color: item.thieu > 0 ? '#ff4d4f' : '#52c41a' }}>{item.slThucTe}</strong>
                          {item.thieu > 0 && <Tag color="error" style={{ marginLeft: 8, borderRadius: 8 }}>Thiếu {item.thieu}</Tag>}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="pack-item-actions">
                    {item.checked ? (
                      <Space size={6}>
                        <Tag icon={item.thieu > 0 ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}
                          color={item.thieu > 0 ? 'warning' : 'success'}
                          style={{ borderRadius: 12, fontSize: 13, padding: '3px 10px' }}>
                          {item.thieu > 0 ? 'Đã báo thiếu' : 'Đã xác nhận'}
                        </Tag>
                        {item.thieu > 0 && item.trangThaiBoSung === 'ChuaBoSung' && (
                          <Button size="small" type="primary" icon={<ReloadOutlined />}
                            onClick={() => confirmBoSung(item.id)}
                            style={{ borderRadius: 8, fontSize: 12 }}>Đã bổ sung</Button>
                        )}
                        {item.thieu > 0 && item.trangThaiBoSung === 'DaBoSung' && (
                          <Tag color="success" style={{ borderRadius: 8 }}>Đã BS ✓</Tag>
                        )}
                      </Space>
                    ) : (
                      <Space>
                        <Button type="primary" icon={<CheckOutlined />}
                          onClick={() => confirmItem(item.id)} className="pack-btn-confirm">Đủ</Button>
                        <Button danger icon={<WarningOutlined />}
                          onClick={() => openBaoThieu(item.id)} className="pack-btn-thieu">Thiếu</Button>
                      </Space>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Danh sách dụng cụ */}
        <Col xs={24} lg={12}>
          <Card className="glass-effect" style={{ borderRadius: 16 }}>
            <Title level={5} style={{ marginBottom: 16 }}>Dụng cụ cần chuẩn bị</Title>
            <div className="pack-items-list">
              {(selectedOrder.dungCu || []).map((dc) => (
                <div key={dc.id}
                  className={`pack-item ${dc.checked ? 'pack-item-done' : ''} ${dc.thieu > 0 ? 'pack-item-thieu' : ''}`}>
                  <div className="pack-item-info">
                    <div className="pack-item-name">{dc.ten}</div>
                    <div className="pack-item-qty">
                      SL yêu cầu: <strong>{dc.slYeuCau}</strong>
                      {dc.checked && dc.slThucTe !== null && (
                        <span style={{ marginLeft: 12 }}>
                          → Thực tế: <strong style={{ color: dc.thieu > 0 ? '#ff4d4f' : '#52c41a' }}>{dc.slThucTe}</strong>
                          {dc.thieu > 0 && <Tag color="error" style={{ marginLeft: 8, borderRadius: 8 }}>Thiếu {dc.thieu}</Tag>}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="pack-item-actions">
                    {dc.checked ? (
                      <Space size={6}>
                        <Tag icon={dc.thieu > 0 ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}
                          color={dc.thieu > 0 ? 'warning' : 'success'}
                          style={{ borderRadius: 12, fontSize: 13, padding: '3px 10px' }}>
                          {dc.thieu > 0 ? 'Đã báo thiếu' : 'Đã xác nhận'}
                        </Tag>
                        {dc.thieu > 0 && dc.trangThaiBoSung === 'ChuaBoSung' && (
                          <Button size="small" type="primary" icon={<ReloadOutlined />}
                            onClick={() => confirmBoSungDC(dc.id)}
                            style={{ borderRadius: 8, fontSize: 12 }}>Đã bổ sung</Button>
                        )}
                        {dc.thieu > 0 && dc.trangThaiBoSung === 'DaBoSung' && (
                          <Tag color="success" style={{ borderRadius: 8 }}>Đã BS ✓</Tag>
                        )}
                      </Space>
                    ) : (
                      <Space>
                        <Button type="primary" icon={<CheckOutlined />}
                          onClick={() => confirmDungCu(dc.id)} className="pack-btn-confirm">Đủ</Button>
                        <Button danger icon={<WarningOutlined />}
                          onClick={() => openBaoThieuDC(dc.id)} className="pack-btn-thieu">Thiếu</Button>
                      </Space>
                    )}
                  </div>
                </div>
              ))}
              {(!selectedOrder.dungCu || selectedOrder.dungCu.length === 0) && (
                <Empty description="Chưa có danh sách dụng cụ" style={{ padding: 20 }} />
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* UC6: Modal Báo thiếu món */}
      <Modal
        title={
          <Space>
            <WarningOutlined style={{ color: '#faad14', fontSize: 20 }} />
            <span style={{ fontSize: 17 }}>Báo thiếu món</span>
          </Space>
        }
        open={theuModal.open}
        onCancel={() => setThieuModal({ open: false, itemId: null })}
        onOk={submitBaoThieu}
        okText="Xác nhận thiếu"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        {theuModal.itemId && selectedOrder && (
          <div>
            <div style={{ background: '#f5f5f5', borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <Text type="secondary">Món:</Text>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>
                {selectedOrder.items.find((i) => i.id === theuModal.itemId)?.mon}
              </div>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">SL yêu cầu: </Text>
                <Text strong>{selectedOrder.items.find((i) => i.id === theuModal.itemId)?.slYeuCau}</Text>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Số lượng thực tế nhận được:</Text>
              <InputNumber
                min={0}
                max={selectedOrder.items.find((i) => i.id === theuModal.itemId)?.slYeuCau - 1}
                value={theuSL}
                onChange={(val) => setThieuSL(val)}
                style={{ width: '100%', marginTop: 8, height: 44 }}
                size="large"
              />
            </div>

            <div>
              <Text strong>Lý do thiếu:</Text>
              <TextArea
                value={theuLyDo}
                onChange={(e) => setThieuLyDo(e.target.value)}
                placeholder="VD: Bếp chưa nấu kịp, hết nguyên liệu..."
                rows={3}
                style={{ marginTop: 8 }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Báo thiếu dụng cụ */}
      <Modal
        title={<Space><WarningOutlined style={{ color: '#faad14', fontSize: 20 }} /><span style={{ fontSize: 17 }}>Báo thiếu dụng cụ</span></Space>}
        open={thieuDCModal.open}
        onCancel={() => setThieuDCModal({ open: false, dcId: null })}
        onOk={submitBaoThieuDC} okText="Xác nhận thiếu" cancelText="Hủy" okButtonProps={{ danger: true }}>
        {thieuDCModal.dcId && selectedOrder && (() => {
          const dc = selectedOrder.dungCu.find(d => d.id === thieuDCModal.dcId)
          return dc ? (
            <div>
              <div style={{ background: '#f5f5f5', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <Text type="secondary">Dụng cụ:</Text>
                <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{dc.ten}</div>
                <div style={{ marginTop: 8 }}><Text type="secondary">SL yêu cầu: </Text><Text strong>{dc.slYeuCau}</Text></div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text strong>Số lượng thực tế:</Text>
                <InputNumber min={0} max={dc.slYeuCau - 1} value={thieuDCSL}
                  onChange={v => setThieuDCSL(v)} style={{ width: '100%', marginTop: 8, height: 44 }} size="large" />
              </div>
              <div>
                <Text strong>Lý do thiếu:</Text>
                <TextArea value={thieuDCLyDo} onChange={e => setThieuDCLyDo(e.target.value)}
                  placeholder="VD: Hết hàng, vỡ hỏng..." rows={3} style={{ marginTop: 8 }} />
              </div>
            </div>
          ) : null
        })()}
      </Modal>

      {/* UC3: Modal In nhãn — multi-step */}
      <Modal
        title={<Space><PrinterOutlined style={{ color: 'var(--primary)', fontSize: 20 }} /><span style={{ fontSize: 17 }}>{labelStep === 3 ? 'Xem trước nhãn' : 'In nhãn đơn'}</span></Space>}
        open={labelModal.open}
        onCancel={() => setLabelModal({ open: false, order: null })}
        footer={labelStep === 1 ? [
          <Button key="cancel" onClick={() => setLabelModal({ open: false, order: null })}>Hủy</Button>,
          <Button key="next" type="primary" disabled={!labelType} onClick={() => setLabelStep(2)}>Tiếp tục</Button>,
        ] : labelStep === 2 ? [
          <Button key="back" onClick={() => setLabelStep(1)}>Quay lại</Button>,
          <Button key="preview" type="primary" onClick={() => setLabelStep(3)}>Xem trước</Button>,
        ] : [
          <Button key="back" onClick={() => setLabelStep(2)}>Quay lại</Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />}
            onClick={() => {
              const msg = labelType === 'caHai'
                ? `Đã gửi lệnh in ${labelQty} nhãn món ăn + ${labelQtyDC} nhãn đồ dùng!`
                : `Đã gửi lệnh in ${labelType === 'monAn' ? labelQty : labelQtyDC} nhãn ${labelType === 'monAn' ? 'món ăn' : 'đồ dùng'}!`
              message.success(msg)
              setLabelModal({ open: false, order: null })
            }}>Xác nhận in</Button>,
        ]}
        width={labelStep === 3 && labelType === 'caHai' ? 900 : 520}
      >
        {labelModal.order && (
          <div style={{ marginTop: 12 }}>
            {/* Step 1: Chọn loại nhãn */}
            {labelStep === 1 && (
              <div style={{ textAlign: 'center' }}>
                <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 16 }}>Chọn loại nhãn cần in:</Text>
                <Radio.Group value={labelType} onChange={e => setLabelType(e.target.value)}
                  style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Radio.Button value="monAn" style={{ height: 70, width: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
                    🍽️ Nhãn món ăn
                  </Radio.Button>
                  <Radio.Button value="doDung" style={{ height: 70, width: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
                    🥄 Nhãn đồ dùng
                  </Radio.Button>
                  <Radio.Button value="caHai" style={{ height: 70, width: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
                    📦 Cả hai
                  </Radio.Button>
                </Radio.Group>
              </div>
            )}

            {/* Step 2: Nhập số lượng */}
            {labelStep === 2 && (
              <div style={{ textAlign: 'center' }}>
                {labelType === 'caHai' ? (
                  <div>
                    <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 16 }}>Nhập số lượng từng loại nhãn:</Text>
                    <Row gutter={24} justify="center">
                      <Col>
                        <Tag color="blue" style={{ fontSize: 13, padding: '3px 12px', borderRadius: 10, marginBottom: 10 }}>🍽️ Nhãn món ăn</Tag>
                        <div><InputNumber min={1} max={100} value={labelQty} onChange={v => setLabelQty(v || 1)} size="large" style={{ width: 120 }} /></div>
                      </Col>
                      <Col>
                        <Tag color="green" style={{ fontSize: 13, padding: '3px 12px', borderRadius: 10, marginBottom: 10 }}>🥄 Nhãn đồ dùng</Tag>
                        <div><InputNumber min={1} max={100} value={labelQtyDC} onChange={v => setLabelQtyDC(v || 1)} size="large" style={{ width: 120 }} /></div>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <div>
                    <Tag color={labelType === 'monAn' ? 'blue' : 'green'} style={{ fontSize: 14, padding: '4px 16px', borderRadius: 12, marginBottom: 16 }}>
                      {labelType === 'monAn' ? '🍽️ Nhãn món ăn' : '🥄 Nhãn đồ dùng'}
                    </Tag>
                    <div style={{ marginBottom: 8 }}><Text strong style={{ fontSize: 15 }}>Số lượng nhãn muốn in:</Text></div>
                    <InputNumber min={1} max={100} value={labelType === 'monAn' ? labelQty : labelQtyDC}
                      onChange={v => labelType === 'monAn' ? setLabelQty(v || 1) : setLabelQtyDC(v || 1)}
                      size="large" style={{ width: 160 }} />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Preview */}
            {labelStep === 3 && (
              <div style={{ display: 'flex', gap: 16 }}>
                {/* Nhãn món ăn */}
                {(labelType === 'monAn' || labelType === 'caHai') && (
                  <div style={{ flex: 1, border: '2px dashed #d9d9d9', borderRadius: 12, padding: 16, background: '#fff' }}>
                    <div style={{ textAlign: 'center', marginBottom: 10 }}>
                      <Title level={5} style={{ margin: 0, color: 'var(--primary)' }}>NHÀ HÀNG PHƯỢNG QUYÊN</Title>
                      <Text type="secondary" style={{ fontSize: 11 }}>Dịch vụ nấu cỗ tiệc</Text>
                    </div>
                    <Divider dashed style={{ margin: '6px 0' }} />
                    <div style={{ fontSize: 12, marginBottom: 6 }}>
                      <div><Text type="secondary">Mã:</Text> <Text strong>{labelModal.order.maDH}</Text></div>
                      <div><Text type="secondary">KH:</Text> <Text>{labelModal.order.khachHang}</Text></div>
                      <div><Text type="secondary">Giao:</Text> <Text>{labelModal.order.ngayGiao}</Text></div>
                    </div>
                    <Tag color="blue" style={{ marginBottom: 6, borderRadius: 8 }}>NHÃN MÓN ĂN × {labelQty}</Tag>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                      <thead><tr style={{ background: '#f5f5f5' }}>
                        <th style={{ border: '1px solid #e8e8e8', padding: '4px 6px', textAlign: 'left' }}>Tên món</th>
                        <th style={{ border: '1px solid #e8e8e8', padding: '4px 6px', width: 50, textAlign: 'center' }}>SL</th>
                      </tr></thead>
                      <tbody>{labelModal.order.items.map(item => (
                        <tr key={item.id}>
                          <td style={{ border: '1px solid #e8e8e8', padding: '3px 6px' }}>{item.mon}</td>
                          <td style={{ border: '1px solid #e8e8e8', padding: '3px 6px', textAlign: 'center' }}>{item.slYeuCau}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                    <div style={{ textAlign: 'center', marginTop: 8 }}>
                      <div style={{ display: 'inline-block', border: '1px solid #d9d9d9', borderRadius: 6, padding: '4px 10px' }}>
                        <Text type="secondary" style={{ fontSize: 9 }}>[ QR CODE ]</Text>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nhãn đồ dùng */}
                {(labelType === 'doDung' || labelType === 'caHai') && (
                  <div style={{ flex: 1, border: '2px dashed #d9d9d9', borderRadius: 12, padding: 16, background: '#fff' }}>
                    <div style={{ textAlign: 'center', marginBottom: 10 }}>
                      <Title level={5} style={{ margin: 0, color: 'var(--primary)' }}>NHÀ HÀNG PHƯỢNG QUYÊN</Title>
                      <Text type="secondary" style={{ fontSize: 11 }}>Dịch vụ nấu cỗ tiệc</Text>
                    </div>
                    <Divider dashed style={{ margin: '6px 0' }} />
                    <div style={{ fontSize: 12, marginBottom: 6 }}>
                      <div><Text type="secondary">Mã:</Text> <Text strong>{labelModal.order.maDH}</Text></div>
                      <div><Text type="secondary">KH:</Text> <Text>{labelModal.order.khachHang}</Text></div>
                      <div><Text type="secondary">Giao:</Text> <Text>{labelModal.order.ngayGiao}</Text></div>
                    </div>
                    <Tag color="green" style={{ marginBottom: 6, borderRadius: 8 }}>NHÃN ĐỒ DÙNG × {labelQtyDC}</Tag>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                      <thead><tr style={{ background: '#f5f5f5' }}>
                        <th style={{ border: '1px solid #e8e8e8', padding: '4px 6px', textAlign: 'left' }}>Dụng cụ</th>
                        <th style={{ border: '1px solid #e8e8e8', padding: '4px 6px', width: 50, textAlign: 'center' }}>SL</th>
                      </tr></thead>
                      <tbody>{(labelModal.order.dungCu || []).map(dc => (
                        <tr key={dc.id}>
                          <td style={{ border: '1px solid #e8e8e8', padding: '3px 6px' }}>{dc.ten}</td>
                          <td style={{ border: '1px solid #e8e8e8', padding: '3px 6px', textAlign: 'center' }}>{dc.slYeuCau}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                    <div style={{ textAlign: 'center', marginTop: 8 }}>
                      <div style={{ display: 'inline-block', border: '1px solid #d9d9d9', borderRadius: 6, padding: '4px 10px' }}>
                        <Text type="secondary" style={{ fontSize: 9 }}>[ QR CODE ]</Text>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
