import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DonHang from './pages/DonHang'
import DongGoi from './pages/DongGoi'
import ThucDon from './pages/ThucDon'
import NguyenLieu from './pages/NguyenLieu'
import NhanVien from './pages/NhanVien'
import BaoCao from './pages/BaoCao'
import Bep from './pages/Bep'
import HoaDon from './pages/HoaDon'
import TiepNhanNL from './pages/TiepNhanNL'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="don-hang" element={<DonHang />} />
          <Route path="dong-goi" element={<DongGoi />} />
          <Route path="bep" element={<Bep />} />
          <Route path="thuc-don" element={<ThucDon />} />
          <Route path="nguyen-lieu" element={<NguyenLieu />} />
          <Route path="tiep-nhan-nl" element={<TiepNhanNL />} />
          <Route path="hoa-don" element={<HoaDon />} />
          <Route path="nhan-vien" element={<NhanVien />} />
          <Route path="bao-cao" element={<BaoCao />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
