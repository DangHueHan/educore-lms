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
   


<div className="w-full min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#1F1A3A] text-white font-sans flex flex-col items-center justify-center p-4 antialiased select-none">
      
      {/* Khung bao ngoài - Đã bóp nhỏ lại max-w-xl để giao diện gọn gàng hơn */}
      <div className="w-full max-w-xl flex flex-col items-center space-y-6">
        
        {/* Tên thương hiệu */}
        <h1 className="text-xl md:text-2xl font-black tracking-[0.2em] text-[#A78BFA] uppercase text-center drop-shadow-[0_0_15px_rgba(167,139,250,0.3)]">
          tuhoc.cc quiz
        </h1>

        {/* Khung chính chứa câu hỏi (Form nhỏ gọn) */}
        <div className="w-full bg-[#161B30]/90 border border-[#2A3352] rounded-2xl p-5 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md space-y-6">
          
          {/* Thanh tiến trình (Progress Bar) */}
          <div className="w-full bg-[#242C4D] h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] h-full w-[45%] rounded-full"></div>
          </div>

          {/* Nội dung câu hỏi */}
          <div className="text-center">
            <h2 className="text-[16px] md:text-[18px] font-bold text-gray-100 leading-relaxed">
              Cách đơn giản để hiển thị nội dung "có điều kiện" là gì?
            </h2>
          </div>

          {/* Danh sách ô đáp án màu trắng, form nhỏ nên chữ và padding cũng thu gọn lại xíu cho đẹp */}
          <div className="space-y-3">
            
            {/* Đáp án 1 */}
            <button className="w-full bg-white hover:bg-gray-100 border-2 border-transparent text-[#0F172A] font-semibold text-[14px] text-left px-5 py-3.5 rounded-xl shadow-sm transition duration-200 transform active:scale-[0.99] block">
              Chỉ cần viết ghi chú trong code, trình duyệt sẽ tự hiểu.
            </button>

            {/* Đáp án 2 */}
            <button className="w-full bg-white hover:bg-gray-100 border-2 border-transparent text-[#0F172A] font-semibold text-[14px] text-left px-5 py-3.5 rounded-xl shadow-sm transition duration-200 transform active:scale-[0.99] block">
              Đổi tên file từ .js sang .jsx là được.
            </button>

            {/* Đáp án 3 (Active / Focus) */}
            <button className="w-full bg-white hover:bg-gray-100 border-2 border-[#3B82F6] text-[#0F172A] font-bold text-[14px] text-left px-5 py-3.5 rounded-xl shadow-md transition duration-200 transform active:scale-[0.99] block">
              Dùng toán tử 3 ngôi (condition ? A : B) hoặc && trong JSX.
            </button>

            {/* Đáp án 4 */}
            <button className="w-full bg-white hover:bg-gray-100 border-2 border-transparent text-[#0F172A] font-semibold text-[14px] text-left px-5 py-3.5 rounded-xl shadow-sm transition duration-200 transform active:scale-[0.99] block">
              Dán bùa may mắn vào bàn phím.
            </button>

          </div>

        </div>

        {/* Số thứ tự câu hỏi nhỏ bên dưới */}
        <p className="text-[11px] text-gray-500 font-mono tracking-widest">
          QUESTION 5 OF 12
        </p>

      </div>
    </div>

      
      
     
    </div>
  );
}