import { useState } from 'react'
import {
  Card, Row, Col, Tag, Button, Badge, Checkbox, InputNumber,
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
      { id: 2, mon: 'Cá chiên giòn', slYeuCau: 12, slThucTe: 10, checked: true, thieu: 2, lyDo: 'Bếp chưa chiên kịp' },
      { id: 3, mon: 'Gỏi ngó sen', slYeuCau: 12, slThucTe: 12, checked: true },
      { id: 4, mon: 'Xôi vò', slYeuCau: 12, slThucTe: null, checked: false },
      { id: 5, mon: 'Canh cua', slYeuCau: 12, slThucTe: null, checked: false },
      { id: 6, mon: 'Chè thập cẩm', slYeuCau: 12, slThucTe: null, checked: false },
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

  // UC3: In nhãn — hiện preview modal
  const printLabel = (order) => {
    setLabelModal({ open: true, order })
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
  const allChecked = done === total
  const status = statusMap[selectedOrder.trangThai]
  const hasThieu = selectedOrder.items.some((i) => i.thieu > 0)
  const hasUnresolvedThieu = selectedOrder.items.some((i) => i.thieu > 0 && i.trangThaiBoSung !== 'DaBoSung')

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
            {hasUnresolvedThieu ? 'Có món thiếu chưa bổ sung' : 'Hoàn thành đóng gói'}
          </Button>
        </Space>
      </div>

      <Row gutter={[20, 20]}>
        {/* Thông tin đơn */}
        <Col xs={24} lg={8}>
          <Card className="glass-effect" style={{ borderRadius: 16 }}>
            <Title level={5} style={{ marginBottom: 16 }}>Thông tin đơn</Title>
            <div className="pack-info-row">
              <Text type="secondary">Khách hàng</Text>
              <Text strong>{selectedOrder.khachHang}</Text>
            </div>
            <div className="pack-info-row">
              <Text type="secondary">Loại tiệc</Text>
              <Text>{selectedOrder.loai}</Text>
            </div>
            <div className="pack-info-row">
              <Text type="secondary">Số mâm</Text>
              <Text strong style={{ fontSize: 18, color: 'var(--primary)' }}>{selectedOrder.soMam}</Text>
            </div>
            <div className="pack-info-row">
              <Text type="secondary">Ngày giao</Text>
              <Text>{selectedOrder.ngayGiao} - {selectedOrder.gioGiao}</Text>
            </div>
            <div className="pack-info-row">
              <Text type="secondary">Địa chỉ</Text>
              <Text>{selectedOrder.diaChi}</Text>
            </div>
            {selectedOrder.ghiChu && (
              <div style={{ background: '#fff7e6', borderRadius: 8, padding: '8px 12px', marginTop: 8 }}>
                <Text type="warning">⚠ {selectedOrder.ghiChu}</Text>
              </div>
            )}

            {/* Tiến độ tổng */}
            <Divider />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: allChecked ? '#52c41a' : 'var(--primary)' }}>
                {done}/{total}
              </div>
              <Text type="secondary">món đã kiểm tra</Text>
              <div style={{ width: '100%', height: 8, borderRadius: 4, background: '#eee', marginTop: 12, overflow: 'hidden' }}>
                <div style={{
                  width: `${(done / total) * 100}%`,
                  height: '100%',
                  borderRadius: 4,
                  background: allChecked ? '#52c41a' : 'linear-gradient(90deg, var(--primary), #89aef2)',
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>

            {/* Cảnh báo thiếu món */}
            {hasThieu && (
              <div style={{ background: '#fff2f0', borderRadius: 8, padding: '10px 12px', marginTop: 16 }}>
                <Text type="danger" strong><WarningOutlined /> Có món báo thiếu!</Text>
                {selectedOrder.items.filter(i => i.thieu > 0).map((item) => (
                  <div key={item.id} style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13 }}>
                      • {item.mon}: thiếu <strong>{item.thieu}</strong>
                      {item.thoiGianBao && <Text type="secondary" style={{ marginLeft: 6, fontSize: 11 }}>(báo lúc {item.thoiGianBao})</Text>}
                      {item.lyDo && <Text type="secondary" style={{ marginLeft: 4, fontSize: 11 }}>— {item.lyDo}</Text>}
                    </div>
                    {item.trangThaiBoSung === 'ChuaBoSung' ? (
                      <Button size="small" type="primary" icon={<ReloadOutlined />}
                        onClick={() => confirmBoSung(item.id)}
                        style={{ borderRadius: 8, fontSize: 12 }}>Đã bổ sung</Button>
                    ) : (
                      <Tag color="success" style={{ borderRadius: 8 }}>Đã BS</Tag>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>

        {/* Danh sách món cần kiểm tra */}
        <Col xs={24} lg={16}>
          <Card className="glass-effect" style={{ borderRadius: 16 }}>
            <Title level={5} style={{ marginBottom: 16 }}>Danh sách món — Kiểm tra & Đóng gói</Title>

            <div className="pack-items-list">
              {selectedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className={`pack-item ${item.checked ? 'pack-item-done' : ''} ${item.thieu > 0 ? 'pack-item-thieu' : ''}`}
                >
                  {/* Tên món + SL yêu cầu */}
                  <div className="pack-item-info">
                    <div className="pack-item-name">{item.mon}</div>
                    <div className="pack-item-qty">
                      SL yêu cầu: <strong>{item.slYeuCau}</strong>
                      {item.checked && item.slThucTe !== null && (
                        <span style={{ marginLeft: 12 }}>
                          → Thực tế: <strong style={{ color: item.thieu > 0 ? '#ff4d4f' : '#52c41a' }}>
                            {item.slThucTe}
                          </strong>
                          {item.thieu > 0 && (
                            <Tag color="error" style={{ marginLeft: 8, borderRadius: 8 }}>
                              Thiếu {item.thieu}
                            </Tag>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className="pack-item-actions">
                    {item.checked ? (
                      <Tag
                        icon={item.thieu > 0 ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}
                        color={item.thieu > 0 ? 'warning' : 'success'}
                        style={{ borderRadius: 12, fontSize: 14, padding: '4px 14px' }}
                      >
                        {item.thieu > 0 ? 'Đã báo thiếu' : 'Đã xác nhận'}
                      </Tag>
                    ) : (
                      <Space>
                        <Button
                          type="primary"
                          icon={<CheckOutlined />}
                          onClick={() => confirmItem(item.id)}
                          className="pack-btn-confirm"
                        >
                          Đủ
                        </Button>
                        <Button
                          danger
                          icon={<WarningOutlined />}
                          onClick={() => openBaoThieu(item.id)}
                          className="pack-btn-thieu"
                        >
                          Thiếu
                        </Button>
                      </Space>
                    )}
                  </div>
                </div>
              ))}
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

      {/* UC3: Modal Preview In nhãn */}
      <Modal
        title={<Space><PrinterOutlined style={{ color: 'var(--primary)', fontSize: 20 }} /><span style={{ fontSize: 17 }}>Preview Nhãn Đơn</span></Space>}
        open={labelModal.open}
        onCancel={() => setLabelModal({ open: false, order: null })}
        footer={[
          <Button key="cancel" onClick={() => setLabelModal({ open: false, order: null })}>Hủy</Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />}
            onClick={() => { message.success('Đã gửi lệnh in!'); setLabelModal({ open: false, order: null }) }}>In nhãn</Button>,
        ]}
        width={480}
      >
        {labelModal.order && (
          <div style={{ border: '2px dashed #d9d9d9', borderRadius: 12, padding: 24, background: '#fff' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0, color: 'var(--primary)' }}>NHÀ HÀNG PHƯỢNG QUYÊN</Title>
              <Text type="secondary">Dịch vụ nấu cỗ tiệc chuyên nghiệp</Text>
            </div>
            <Divider dashed style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div><Text type="secondary">Mã đơn:</Text> <Text strong style={{ fontSize: 16 }}>{labelModal.order.maDH}</Text></div>
              <div><Text type="secondary">Khách hàng:</Text> <Text strong>{labelModal.order.khachHang}</Text></div>
              <div><Text type="secondary">Địa chỉ:</Text> <Text>{labelModal.order.diaChi}</Text></div>
              <div><Text type="secondary">Giao:</Text> <Text strong>{labelModal.order.ngayGiao} lúc {labelModal.order.gioGiao}</Text></div>
              <div><Text type="secondary">Loại tiệc:</Text> <Text>{labelModal.order.loai} • {labelModal.order.soMam} mâm</Text></div>
            </div>
            <Divider dashed style={{ margin: '12px 0' }} />
            <div style={{ fontSize: 12 }}>
              <Text strong>Danh sách món:</Text>
              <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {labelModal.order.items.map(item => (
                  <Tag key={item.id} style={{ borderRadius: 6, fontSize: 11 }}>{item.mon} x{item.slYeuCau}</Tag>
                ))}
              </div>
            </div>
            <Divider dashed style={{ margin: '12px 0' }} />
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: 11 }}>Xin cảm ơn quý khách! ❤️</Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
