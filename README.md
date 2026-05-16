# phuongquyen-management-system

Hệ thống Quản lý Dịch vụ Đặt cỗ — Nhà hàng Phượng Quyên

## Cấu trúc thư mục

```
phuongquyen-management-system/
│
├── backend/                        # FastAPI Backend
│   ├── main.py                     # Entry point
│   ├── requirements.txt            # Python dependencies
│   └── app/
│       ├── __init__.py
│       ├── config.py               # Database config (SQL Server + ODBC)
│       └── models.py               # SQLAlchemy models
│
├── frontend/                       # React + Vite Frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx                # Entry + AntD ConfigProvider
│       ├── App.jsx                 # React Router
│       ├── index.css               # Glassmorphism design system
│       ├── components/
│       │   └── Logo.jsx
│       ├── layouts/
│       │   └── MainLayout.jsx      # Sidebar + Header + phân quyền
│       └── pages/
│           ├── Login.jsx           # Đăng nhập
│           ├── Dashboard.jsx       # Tổng quan
│           ├── DonHang.jsx         # Quản lý đơn hàng
│           ├── DongGoi.jsx         # Đóng gói & kiểm tra
│           ├── ThucDon.jsx         # Quản lý thực đơn
│           ├── NguyenLieu.jsx      # Quản lý nguyên liệu
│           ├── NhanVien.jsx        # Quản lý nhân viên
│           └── BaoCao.jsx          # Báo cáo & thống kê
│
├── .gitignore
└── README.md
```
