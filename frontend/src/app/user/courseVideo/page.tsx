import React from "react";
import {
  Search,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* ========================================== */}
      {/* 1. THANH ĐIỀU HƯỚNG (NAVIGATION)         */}
      {/* ========================================== */}
     


<div className="w-full bg-white min-h-screen text-black font-sans antialiased select-none">
      
      {/* Lưới chính: Chia làm 2 phần (Trái: Video & Bình luận | Phải: Danh sách bài học) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full">
        
        {/* ========================================================================= */}
        {/* ==================== PHẦN BÊN TRÁI: VIDEO & NỘI DUNG ==================== */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 p-6 space-y-6">
          
          {/* Khung chứa Video Player */}
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center relative shadow-sm group">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-white">
              <p className="text-zinc-400 text-sm tracking-wider uppercase font-medium">Member of MyCV</p>
              <h2 className="text-[32px] font-black tracking-tight mt-1 text-white flex items-center gap-2">
                <span className="text-[#1d4ed8] bg-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-black">e</span>
                educore.edu.vn
              </h2>
              <p className="text-zinc-500 text-xs font-mono mt-2 italic">Nothing is impossible</p>

              {/* Nút Play màu xanh dương chính giữa */}
              <button className="mt-8 w-16 h-16 bg-[#1d4ed8] text-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition duration-200">
                <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tiêu đề Video */}
          <h1 className="text-[22px] font-bold text-[#242424] leading-snug">
            Lời khuyên trước khóa học Node Express | Học lập trình cơ bản | Học NodeJS miễn phí
          </h1>

          {/* Thanh tương tác: Kênh, Đăng ký, Like, Share */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-gray-100 pb-5">
            {/* Thông tin kênh EduCore */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#1d4ed8] text-white font-black flex items-center justify-center text-xs shadow-sm border border-blue-200 tracking-tighter">
                EDU
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-[15px] text-gray-900">EduCore Official</span>
                  <span className="text-blue-500 text-xs">✓</span>
                </div>
                <p className="text-xs text-gray-500">143 N người đăng ký</p>
              </div>
              <button className="ml-4 bg-black hover:bg-zinc-800 text-white text-[13px] font-bold px-5 py-2 rounded-full transition-colors">
                Đăng ký
              </button>
            </div>

            {/* Cụm nút tương tác (Like/Dislike Đen Trắng) */}
            <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-700">
              
              {/* Nút Like / Dislike bằng SVG Đen Trắng */}
              <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                {/* Nút Like */}
                <button className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-200 transition text-black">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                  </svg>
                  <span>2,4 N</span>
                </button>
                
                {/* Vạch chia đôi */}
                <div className="w-[1px] h-4 bg-gray-300"></div>
                
                {/* Nút Dislike */}
                <button className="px-4 py-2.5 hover:bg-gray-200 transition text-black">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h3a2 2 0 012 2v7a2 2 0 01-2 2h3" />
                  </svg>
                </button>
              </div>

              {/* Nút Chia sẻ */}
              <button className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-full transition text-black">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Chia sẻ</span>
              </button>

              {/* Nút Đặt câu hỏi (Giữ màu xanh thương hiệu) */}
              <button className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-full transition text-[#1d4ed8]">
                <span>✦</span> <span>Đặt câu hỏi</span>
              </button>

              {/* Nút ba chấm */}
              <button className="bg-gray-100 hover:bg-gray-200 w-9 h-9 flex items-center justify-center rounded-full transition font-bold text-lg text-black">
                •••
              </button>
            </div>
          </div>

          {/* Khung mô tả video */}
          <div className="bg-gray-100 rounded-2xl p-4 text-[14px] text-gray-800 leading-relaxed space-y-2">
            <div className="font-bold text-gray-900 space-x-2">
              <span>419 N lượt xem</span>
              <span>•</span>
              <span>5 năm trước</span>
              <span className="text-gray-500 text-xs font-normal bg-gray-200 px-1.5 py-0.5 rounded ml-2">VIỆT NAM</span>
            </div>
            <p>👉 Xem Lộ Trình Học: <span className="text-blue-600 cursor-pointer hover:underline">https://educore.edu.vn/learning-paths</span></p>
            <p>👉 Đăng Ký Học Offline Tại EduCore: <span className="text-blue-600 cursor-pointer hover:underline">https://short.educoreteam.dev/dang-ky-hoc-...</span></p>
            <button className="text-gray-500 font-bold text-xs pt-1 block hover:underline">...thêm</button>
          </div>

          {/* Khu vực bình luận */}
          <div className="pt-4 space-y-6">
            <div className="flex items-center gap-8">
              <h3 className="text-[20px] font-bold text-gray-900">127 bình luận</h3>
              <button className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <span>≡</span> <span>Sắp xếp theo</span>
              </button>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* ==================== PHẦN BÊN PHẢI: MENU DANH SÁCH BÀI HỌC ============== */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 border-l border-gray-200 h-[calc(100vh-20px)] lg:sticky lg:top-0 overflow-y-auto bg-white">
          
          {/* Hộp thông báo bài học tiếp theo trên cùng */}
          <div className="p-4 bg-[#ebf3ed] border-b border-gray-200 flex items-start justify-between cursor-pointer group">
            <div className="space-y-1">
              <p className="text-[12px] font-bold text-emerald-700 uppercase tracking-wide">Tiếp theo:</p>
              <h4 className="text-[13.5px] font-bold text-gray-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                HTTP protocol | Giao thức HTTP | Giao thức truyền tải siêu văn bản
              </h4>
              <p className="text-[12px] text-gray-500">EduCore NodeJS - 1/36</p>
            </div>
            <span className="text-gray-400 text-lg group-hover:text-gray-700 transition-colors">▼</span>
          </div>

          {/* Thanh Tab nhỏ */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 text-[13px] font-semibold text-gray-600">
            <button className="p-1 text-gray-400 hover:text-black">〈</button>
            <button className="bg-gray-100 text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold">Video có liên quan</button>
            <button className="hover:bg-gray-50 px-3 py-1.5 rounded-full text-xs">Dành cho bạn</button>
            <button className="p-1 text-gray-400 hover:text-black">〉</button>
          </div>

          {/* Danh sách các Chương bài học */}
          <div className="divide-y divide-gray-100">
            
            {/* Chương 1 (Dấu trừ hình tròn Trắng viền Xanh Dương) */}
            <div className="bg-white">
              <div className="flex items-center justify-between px-4 py-4 bg-gray-50 cursor-pointer select-none border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white border-2 border-[#1d4ed8] text-[#1d4ed8] text-xs font-black flex items-center justify-center shrink-0">
                    −
                  </span>
                  <span className="text-[14px] font-bold text-gray-900">1. Bắt đầu</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">3 bài học</span>
              </div>

              {/* Danh sách bài học con */}
              <div className="divide-y divide-gray-50 bg-white">
                
                {/* Bài 1.1 */}
                <div className="flex justify-between items-center px-6 py-3 hover:bg-gray-50 cursor-pointer transition text-[13.5px]">
                  <div className="flex items-start gap-3 text-gray-800 pr-2">
                    <span className="w-4 h-4 rounded-full bg-white border border-[#1d4ed8] text-[#1d4ed8] text-[8px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      ▶
                    </span>
                    <span className="font-medium">1.1 Giới thiệu khóa học</span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 font-mono">04:47</span>
                </div>

                {/* Bài 1.2 (Active đang xem) */}
                <div className="flex justify-between items-center px-6 py-3 bg-blue-50/50 cursor-pointer text-[13.5px]">
                  <div className="flex items-start gap-3 text-[#1d4ed8] pr-2">
                    <span className="w-4 h-4 rounded-full bg-[#1d4ed8] text-white text-[8px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      ▶
                    </span>
                    <span className="font-bold">1.2 Giới thiệu Tailwind CSS</span>
                  </div>
                  <span className="text-xs text-[#1d4ed8] shrink-0 font-mono font-bold">04:13</span>
                </div>

                {/* Bài 1.3 */}
                <div className="flex justify-between items-center px-6 py-3 hover:bg-gray-50 cursor-pointer transition text-[13.5px]">
                  <div className="flex items-start gap-3 text-gray-800 pr-2">
                    <span className="w-4 h-4 rounded-full bg-white border border-[#1d4ed8] text-[#1d4ed8] text-[8px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      ▶
                    </span>
                    <span className="font-medium">1.3 Cài đặt Tailwind CSS</span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 font-mono">10:49</span>
                </div>

              </div>
            </div>

            {/* Chương 2 */}
            <div className="bg-white">
              <div className="flex items-center justify-between px-4 py-4 bg-gray-50 cursor-pointer select-none">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white border-2 border-[#1d4ed8] text-[#1d4ed8] text-xs font-black flex items-center justify-center shrink-0">
                    +
                  </span>
                  <span className="text-[14px] font-bold text-gray-900">2. Các khái niệm chính</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">5 bài học</span>
              </div>
            </div>

            {/* Chương 3 */}
            <div className="bg-white">
              <div className="flex items-center justify-between px-4 py-4 bg-gray-50 cursor-pointer select-none">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white border-2 border-[#1d4ed8] text-[#1d4ed8] text-xs font-black flex items-center justify-center shrink-0">
                    +
                  </span>
                  <span className="text-[14px] font-bold text-gray-900">3. Thực hành căn bản</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">8 bài học</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
      
     
      
    </div>
  );
}