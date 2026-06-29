"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  User,
  BookOpen,
  Heart,
  Award,
  CreditCard,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

const BASE_URL = "http://localhost:3001";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function getProfile() {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <nav className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20">
          <div className="grid grid-cols-[1fr_minmax(320px,600px)_1fr] items-center h-full gap-8">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/user/home" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl">
                  E
                </div>
                <span className="text-xl font-bold text-blue-600">EduCore</span>
              </Link>
            </div>

            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  placeholder="Tìm khóa học..."
                  className="w-full pl-13 pr-5 py-3 rounded-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Right */}
            <div className="flex justify-end">
              {loading ? null : user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="rounded-full ring-2 ring-transparent hover:ring-blue-500 transition-all"
                  >
                    <img
                      src={
                        user.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.displayName || "User"
                        )}&background=2563eb&color=fff`
                      }
                      className="w-10 h-10 rounded-full object-cover border"
                      alt="User avatar"
                    />
                  </button>

                {isMenuOpen && (
  <>
    {/* Overlay để đóng menu khi click ra ngoài */}
    <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />

    {/* Menu Container */}
    <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      {/* 1. Phần Header: Thông tin cá nhân (Có màu phân biệt) */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img
            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=2563eb&color=fff`}
            className="w-12 h-12 rounded-full border border-white shadow-sm"
          />
          <div className="overflow-hidden">
            <p className="font-bold text-slate-900 truncate">{user.displayName}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* 2. Ô TÌM KIẾM (Đã giữ lại theo yêu cầu của mày) */}
      <div className="p-3 bg-slate-50/50 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>
      </div>

    {/* 3. Danh sách Menu (Phần thân - Đã thêm màu cho icon) */}
<div className="py-1">
  {[
    { icon: User, label: "Personal Profile", href: "/user/profile", color: "text-blue-500" },
    { icon: BookOpen, label: "My Courses", href: "/user/myCourses", color: "text-emerald-500" },
    { icon: Heart, label: "Favorite Courses", href: "/user/favorite", color: "text-rose-500" },
    { icon: Award, label: "Certificates", href: "/user/certificate", color: "text-amber-500" },
    { icon: CreditCard, label: "Payment History", href: "/user/payment-history", color: "text-sky-500" },
    { icon: Bell, label: "Notifications", href: "/user/notifications", color: "text-violet-500" },
  ].map((item) => (
    <Link
      key={item.label}
      href={item.href}
      onClick={() => setIsMenuOpen(false)}
      className="flex items-center gap-3 px-5 py-3 text-[14px] text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all group"
    >
      {/* Icon có màu riêng dựa trên thuộc tính color */}
      <item.icon size={18} className={`${item.color} group-hover:scale-110 transition-transform`} />
      {item.label}
    </Link>
  ))}
</div>

      {/* 4. Phần Footer Menu: Cài đặt & Logout (Có màu/đường kẻ phân biệt) */}
      <div className="border-t border-slate-100 py-1 bg-slate-50/30">
        <Link
          href="/user/settings"
          onClick={() => setIsMenuOpen(false)}
          className="flex items-center gap-3 px-5 py-3 text-[14px] text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all"
        >
          <Settings size={18} /> Settings
        </Link>
        <button
          onClick={() => {/* logic logout */}}
          className="w-full flex items-center gap-3 px-5 py-3 text-[14px] text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut size={18} /> LogOut
        </button>
      </div>
    </div>
  </>
)}
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="relative inline-flex items-center justify-center px-6 py-2.5 font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-300 transform active:scale-95"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main>{children}</main>
  

      
          {/* ========================================== */}
      {/* 3. CHÂN TRANG (FOOTER THEO ẢNH F8)        */}
      {/* ========================================== */}
      <footer className="w-full bg-[#181821] text-[#a9b3bb] pt-16 pb-12 text-[15px]">
        <div className="w-full max-w-[1300px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cột 1: Thông tin liên hệ */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-2xl font-black text-white">
                E
              </div>
              <span className="text-white font-bold text-lg tracking-tight uppercase">
                EduCore
              </span>
            </div>
            <div className="space-y-2.5 pt-2">
              <p><strong className="text-white font-semibold">Điện thoại:</strong> 0897654321</p>
              <p><strong className="text-white font-semibold">Email:</strong> contact@educore.edu.vn</p>
              <p className="leading-relaxed">
                <strong className="text-white font-semibold">Địa chỉ liên hệ:</strong> TP Cần Thơ
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4">
              <div className="border border-zinc-700 px-3 py-1.5 rounded text-[11px] font-bold tracking-wider text-[#00b0ff] uppercase bg-black/20">
                DMCA PROTECTED
              </div>
              <div className="border border-zinc-700 px-3 py-1.5 rounded text-[11px] font-bold tracking-wider text-blue-400 uppercase bg-black/20 flex items-center gap-1">
                ✓ ĐÃ THÔNG BÁO <span className="text-[9px] text-zinc-500 font-normal">BỘ CÔNG THƯƠNG</span>
              </div>
            </div>
          </div>

          {/* Cột 2: VỀ EDUCORE */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white font-bold text-base uppercase tracking-wider">
              VỀ EduCore
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Điều khoản & Quy định</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
            </ul>
          </div>

          {/* Cột 3: HỖ TRỢ */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white font-bold text-base uppercase tracking-wider">
              HỖ TRỢ
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Chính sách thanh toán</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách vận chuyển</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách kiểm hàng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Quy định về giá</a></li>
            </ul>
          </div>

          {/* Cột 4: CÔNG CỤ */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white font-bold text-base uppercase tracking-wider">
              CÔNG CỤ
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Tạo CV xin việc</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Rút gọn liên kết</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Clip-path maker</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Snippet generator</a></li>
              <li><a href="#" className="hover:text-white transition-colors">CSS Grid generator</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cảnh báo sờ tay lên mặt</a></li>
            </ul>
          </div>

          {/* Cột 5: THÔNG TIN CÔNG TY */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white font-bold text-base uppercase tracking-wider leading-snug">
              CÔNG TY CỔ PHẦN CÔNG NGHỆ GIÁO DỤC EDUCORE
            </h3>
            <div className="space-y-3 text-[14px] leading-relaxed">
              <p>
                <strong className="text-white font-semibold">Địa chỉ: TP Cần Thơ</strong>           
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* KHỐI CUỐI: ĐÃ CĂN GIỮA COPYRIGHT & ICON MXH CÓ MÀU CHUẨN */}
        {/* ========================================================= */}
        <div className="w-full max-w-[1300px] mx-auto px-6 border-t border-zinc-800/80 mt-12 pt-8 flex flex-col items-center justify-center gap-5 text-sm font-medium text-zinc-400">
          
          {/* Văn bản bản quyền nằm chính giữa */}
          <div className="text-center tracking-wide text-zinc-400">
            © 2018 - 2026 Educore. Nền tảng học lập trình hàng đầu Việt Nam.
          </div>
          
          {/* Các nút mạng xã hội có màu sắc thương hiệu nổi bật */}
          <div className="flex items-center gap-3">
            {/* Facebook màu xanh dương thương hiệu */}
            <a href="#" className="w-9 h-9 rounded-full bg-[#1877F2] hover:opacity-90 flex items-center justify-center transition-all text-white font-bold text-base shadow-lg shadow-[#1877F2]/20">
              f
            </a>
            {/* Youtube màu đỏ rực rỡ */}
            <a href="#" className="w-9 h-9 rounded-full bg-[#FF0000] hover:opacity-90 flex items-center justify-center transition-all text-white font-bold text-xs shadow-lg shadow-[#FF0000]/20">
              yt
            </a>
            {/* Tiktok nền đen chữ trắng cá tính */}
            <a href="#" className="w-9 h-9 rounded-full bg-[#000000] border border-zinc-700 hover:bg-zinc-900 flex items-center justify-center transition-all text-white font-bold text-xs shadow-lg shadow-black/40">
              tk
            </a>
          </div>

        </div>
      </footer>
      
    </>
  );
}