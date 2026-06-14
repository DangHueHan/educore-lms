import {
  Search,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Link from "next/link";
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>
        {/* ========================================== */}
      {/* 1. THANH ĐIỀU HƯỚNG (NAVIGATION)         */}
      {/* ========================================== */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* PHẦN BÊN TRÁI: LOGO & MENU LINKS */}
            <div className="flex items-center gap-12">
              {/* Logo: Hình vuông màu xanh dương, chữ E màu trắng */}
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-xl">
                   <Link href="/user/home">E</Link>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  EduCore
                </span>
              </div>

              {/* Navigation Links */}
              <div className="hidden xl:flex items-center gap-8">
          
              </div>
            </div>

            {/* PHẦN BÊN PHẢI */}
            <div className="flex items-center gap-8 flex-1 max-w-3xl justify-end">
              {/* Ô tìm kiếm */}
              <div className="relative w-full max-w-md hidden md:block">
                <span className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Search
                    className="h-5 w-5 text-slate-400"
                    strokeWidth={2.5}
                  />
                </span>
                <input
                  type="text"
                  placeholder="Tìm khóa học, bài tập, hỏi đáp..."
                  className="w-full pl-13 pr-5 py-3.5 bg-[#f8f9fa] border border-[#e9ecef] rounded-full text-[15px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all"
                />
              </div>

              {/* Cụm nút bấm Đăng ký / Đăng nhập (Màu xanh dương) */}
              <div className="flex items-center gap-5 shrink-0">
                <button className="text-slate-800 hover:text-blue-600 font-bold text-[15px] transition-colors px-2 py-1">
                  Đăng ký
                </button>
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-95 text-white font-bold text-[15px] px-7 py-3.5 rounded-full shadow-md shadow-blue-500/10 transition-all">
                  Đăng nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      </header>

      <main>
        {children}
      </main>

      
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