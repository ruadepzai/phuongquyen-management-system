from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import engine, Base

# Import models để SQLAlchemy biết cần tạo bảng nào
from app import models  # noqa: F401

app = FastAPI(
    title="Phượng Quyên API",
    description="Hệ thống Quản lý Dịch vụ Đặt cỗ — Nhà hàng Phượng Quyên",
    version="1.0.0",
)

# CORS — cho phép React Frontend gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    """Tự tạo bảng khi khởi động (nếu chưa có)"""
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Phượng Quyên API is running", "docs": "/docs"}
