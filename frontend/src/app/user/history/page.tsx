
// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// const BASE_URL = "http://localhost:3001";

// export default function HistoryPage() {
//   const [history, setHistory] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadHistory() {
//       const res = await fetch(`${BASE_URL}/quiz/history`, {
//         credentials: "include",
//       });

//       const data = await res.json();

//       console.log("HISTORY RESULT:", data);

//       if (Array.isArray(data)) {
//         setHistory(data);
//       } else {
//         setHistory([]);
//       }

//       setLoading(false);
//     }

//     loadHistory();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center font-medium text-slate-400">
//         <div className="flex items-center gap-3">
//           <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
//           <span>Đang tải lịch sử...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#0B0F19] text-slate-200 p-4 md:p-8 font-sans">
//       <div className="max-w-4xl mx-auto space-y-6">
        
//         {/* Tiêu đề trang */}
//         <div className="border-b border-[#2A3352]/40 pb-4">
//           <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
//             Lịch sử làm bài
//           </h1>
//           <p className="text-sm text-slate-400 mt-1">
//             Xem lại danh sách và kết quả các bài trắc nghiệm bạn đã tham gia.
//           </p>
//         </div>

//         {/* Trạng thái trống */}
//         {history.length === 0 && (
//           <div className="text-center py-12 bg-[#13182C] border border-[#2A3352]/40 rounded-2xl">
//             <p className="text-slate-400 font-medium">Chưa có bài làm nào trong lịch sử</p>
//           </div>
//         )}

//         {/* Danh sách bài làm */}
//         <div className="space-y-4">
//           {history.map((item) => (
//             <div
//               key={item.id}
//               className="bg-[#13182C] border border-[#2A3352]/60 hover:border-purple-500/40 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 shadow-md shadow-black/10"
//             >
//               {/* Thông tin bài học */}
//               <div className="space-y-2">
//                 <h2 className="font-bold text-base md:text-lg text-white leading-snug">
//                   {item.course?.title}
//                 </h2>
                
//                 {/* Badge hiển thị điểm số */}
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs font-medium text-slate-400">Điểm số:</span>
//                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
//                     {item.score}%
//                   </span>
//                 </div>
//               </div>

//               {/* Nút hành động chuyển trang */}
//               <div className="flex sm:justify-end border-t border-[#2A3352]/30 sm:border-0 pt-3 sm:pt-0">
//                 <Link
//                   href={`/user/history/${item.id}`}
//                   className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 text-sm font-semibold text-purple-400 bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 rounded-xl transition-colors text-center"
//                 >
//                   <span>Xem chi tiết</span>
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
//                   </svg>
//                 </Link>
//               </div>

//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// Import file layout chung để bọc giao diện bên ngoài
import UserDashboardLayout from "../userDashboard/page";

const BASE_URL = "http://localhost:3001";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch(`${BASE_URL}/quiz/history`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("HISTORY RESULT:", data);

        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          setHistory([]);
        }
      } catch (error) {
        console.error(error);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  // Trạng thái Loading mượt mà, giữ nguyên bộ khung Sidebar
  if (loading) {
    return (
      <UserDashboardLayout>
        <div className="space-y-6 animate-in fade-in duration-300 font-sans antialiased">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-300/50 rounded w-1/4"></div>
            <div className="h-3 bg-slate-300/40 rounded w-2/5 mt-1"></div>
            <div className="space-y-4 mt-6">
              <div className="h-20 bg-slate-300/30 rounded-xl"></div>
              <div className="h-20 bg-slate-300/30 rounded-xl"></div>
            </div>
          </div>
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-300 font-sans antialiased select-none">
        
        {/* TIÊU ĐỀ PHÂN HỆ */}
        <div>
          <h3 className="text-xs font-black text-slate-800 tracking-wide uppercase">
            Lịch sử làm bài
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
            Xem lại danh sách và kết quả các bài trắc nghiệm bạn đã tham gia
          </p>
        </div>

        {/* TRẠNG THÁI TRỐNG */}
        {history.length === 0 && (
          <div className="bg-white/40 border border-white/50 rounded-xl p-8 shadow-sm text-xs font-extrabold text-slate-500 text-center">
            Chưa có bài làm nào trong lịch sử của bạn.
          </div>
        )}

        {/* DANH SÁCH BÀI LÀM GLASSMORPHISM */}
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white/40 border border-white/50 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:shadow-md"
            >
              {/* THÔNG TIN KHÓA HỌC / BÀI KIỂM TRA */}
              <div className="space-y-1.5 min-w-0 flex-1">
                <h4 className="font-black text-xs text-slate-800 tracking-wide truncate" title={item.course?.title}>
                  {item.course?.title || "Bài trắc nghiệm tự do"}
                </h4>
                
                {/* ĐIỂM SỐ BADGE */}
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <span>Kết quả:</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                    {item.score || 0}%
                  </span>
                </div>
              </div>

              {/* NÚT XEM CHI TIẾT */}
              <div className="flex sm:justify-end border-t border-slate-200/40 sm:border-0 pt-3 sm:pt-0">
                <Link
                  href={`/user/history/${item.id}`}
                  className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-1.5 rounded-xl text-[11px] font-extrabold shadow-md shadow-blue-600/10 transition duration-200 text-center"
                >
                  <span>Xem chi tiết</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2.5} 
                    stroke="currentColor" 
                    className="w-3.5 h-3.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </UserDashboardLayout>
  );
}