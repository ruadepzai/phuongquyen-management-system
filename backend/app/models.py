from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.config import Base


class KhachHang(Base):
    __tablename__ = "KhachHang"

    MaKhachHang = Column(Integer, primary_key=True, autoincrement=True)
    TenKhach = Column(String(100), nullable=False)
    SDT = Column(String(20))
    DiaChi = Column(String(255))

    don_hangs = relationship("DonHang", back_populates="khach_hang")


class NhanVien(Base):
    __tablename__ = "NhanVien"

    MaNhanVien = Column(Integer, primary_key=True, autoincrement=True)
    TenNhanVien = Column(String(100), nullable=False)
    VaiTro = Column(String(50))  # QuanLy, NVDongGoi, Bep, ThuNgan
    TaiKhoan = Column(String(50), unique=True)
    MatKhau = Column(String(255))  # hashed

    don_hangs = relationship("DonHang", back_populates="nhan_vien")


class DanhMucMon(Base):
    __tablename__ = "DanhMucMon"

    MaDanhMuc = Column(Integer, primary_key=True, autoincrement=True)
    TenDanhMuc = Column(String(100), nullable=False)

    mon_ans = relationship("MonAn", back_populates="danh_muc")


class MonAn(Base):
    __tablename__ = "MonAn"

    MaMonAn = Column(Integer, primary_key=True, autoincrement=True)
    MaDanhMuc = Column(Integer, ForeignKey("DanhMucMon.MaDanhMuc"))
    TenMon = Column(String(100), nullable=False)
    MoTa = Column(Text)
    DonGia = Column(Float)
    HinhAnh = Column(String(255))

    danh_muc = relationship("DanhMucMon", back_populates="mon_ans")


class ThucDon(Base):
    __tablename__ = "ThucDon"

    MaThucDon = Column(Integer, primary_key=True, autoincrement=True)
    TenThucDon = Column(String(100), nullable=False)
    DonGia = Column(Float)
    HinhAnh = Column(String(255))


class ChiTietThucDon(Base):
    __tablename__ = "ChiTietThucDon"

    MaThucDon = Column(Integer, ForeignKey("ThucDon.MaThucDon"), primary_key=True)
    MaMonAn = Column(Integer, ForeignKey("MonAn.MaMonAn"), primary_key=True)


class DonHang(Base):
    __tablename__ = "DonHang"

    MaDonHang = Column(Integer, primary_key=True, autoincrement=True)
    MaKhachHang = Column(Integer, ForeignKey("KhachHang.MaKhachHang"))
    MaNhanVien = Column(Integer, ForeignKey("NhanVien.MaNhanVien"))
    SoLuongMam = Column(Integer)
    DiaChiGiao = Column(String(255))
    ThoiGianToChuc = Column(DateTime)
    TienCoc = Column(Float, default=0)
    TrangThai = Column(String(50), default="ChoDongGoi")
    # TrangThai: ChoDongGoi, DangDongGoi, ChoBoSung, DaDongGoi, DangGiao, HoanThanh

    khach_hang = relationship("KhachHang", back_populates="don_hangs")
    nhan_vien = relationship("NhanVien", back_populates="don_hangs")
    chi_tiet = relationship("ChiTietDonHang", back_populates="don_hang")


class ChiTietDonHang(Base):
    __tablename__ = "ChiTietDonHang"

    MaDonHang = Column(Integer, ForeignKey("DonHang.MaDonHang"), primary_key=True)
    MaMonAn = Column(Integer, ForeignKey("MonAn.MaMonAn"), primary_key=True)
    SoLuong = Column(Integer, default=1)
    DaXacNhan = Column(Integer, default=0)  # 0 = chưa tick, 1 = đã tick

    don_hang = relationship("DonHang", back_populates="chi_tiet")
    mon_an = relationship("MonAn")


class DungCu(Base):
    __tablename__ = "DungCu"

    MaDungCu = Column(Integer, primary_key=True, autoincrement=True)
    TenDungCu = Column(String(100), nullable=False)


class NguyenLieu(Base):
    __tablename__ = "NguyenLieu"

    MaNguyenLieu = Column(Integer, primary_key=True, autoincrement=True)
    TenNguyenLieu = Column(String(100), nullable=False)


class ChiTietNguyenLieu(Base):
    __tablename__ = "ChiTietNguyenLieu"

    MaMonAn = Column(Integer, ForeignKey("MonAn.MaMonAn"), primary_key=True)
    MaNguyenLieu = Column(Integer, ForeignKey("NguyenLieu.MaNguyenLieu"), primary_key=True)
    DinhLuong = Column(Float)
    DonVi = Column(String(20))


class NhaCungCap(Base):
    __tablename__ = "NhaCungCap"

    MaNhaCungCap = Column(Integer, primary_key=True, autoincrement=True)
    TenNguoiDaiDien = Column(String(100))
    SDT = Column(String(20))
    DiaChi = Column(String(255))


class PhieuNhap(Base):
    __tablename__ = "PhieuNhap"

    MaPhieuNhap = Column(Integer, primary_key=True, autoincrement=True)
    MaNhaCungCap = Column(Integer, ForeignKey("NhaCungCap.MaNhaCungCap"))
    MaNhanVien = Column(Integer, ForeignKey("NhanVien.MaNhanVien"))
    ThoiGian = Column(DateTime)
    TongTien = Column(Float, default=0)
    TrangThai = Column(String(50))


class ChiTietPhieuNhap(Base):
    __tablename__ = "ChiTietPhieuNhap"

    MaPhieuNhap = Column(Integer, ForeignKey("PhieuNhap.MaPhieuNhap"), primary_key=True)
    MaNguyenLieu = Column(Integer, ForeignKey("NguyenLieu.MaNguyenLieu"), primary_key=True)
    KhoiLuong = Column(Float)
    DonVi = Column(String(20))
    DonGiaNhap = Column(Float)


class BaoThieuMon(Base):
    """Bản ghi báo thiếu món (BM4)"""
    __tablename__ = "BaoThieuMon"

    MaBaoThieu = Column(Integer, primary_key=True, autoincrement=True)
    MaDonHang = Column(Integer, ForeignKey("DonHang.MaDonHang"))
    MaMonAn = Column(Integer, ForeignKey("MonAn.MaMonAn"))
    SoLuongThieu = Column(Integer)
    ThoiGianBao = Column(DateTime)
    TrangThai = Column(String(50), default="ChuaBoSung")  # ChuaBoSung, DaBoSung
