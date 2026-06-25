
// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// const BASE_URL = "http://localhost:3001";

// export default function HistoryDetail() {
//   const { id } = useParams();
//   const [result, setResult] = useState<any>(null);

//   useEffect(() => {
//     fetch(`${BASE_URL}/quiz/history/${id}`, {
//       credentials: "include",
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setResult(data);
//       });
//   }, [id]);

//   if (!result)
//     return (
//       <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-slate-400 font-medium">
//         <div className="flex items-center gap-3">
//           <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
//           <span>Đang tải kết quả...</span>
//         </div>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#0B0F19] text-slate-200 p-4 md:p-8 font-sans">
//       <div className="max-w-4xl mx-auto space-y-8">
        
//         {/* Tên khóa học */}
//         <div className="space-y-2">
//           <p className="text-xs font-semibold tracking-wider text-purple-400 uppercase">
//             Chi tiết lịch sử làm bài
//           </p>
//           <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
//             {result.course.title}
//           </h1>
//         </div>

//         {/* Khu vực điểm số và trạng thái (Dashboard nhỏ) */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {/* Điểm số */}
//           <div className="bg-[#161B30] border border-[#2A3352]/60 rounded-2xl p-5 flex items-center justify-between shadow-xl">
//             <div>
//               <p className="text-sm font-medium text-slate-400">Điểm số</p>
//               <p className="text-3xl font-black text-purple-400 mt-1">
//                 {result.score}%
//               </p>
//             </div>
//             <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-2.25a1.125 1.125 0 00-1.125 1.125V18.75m9 0V16.5L12 3L4.5 16.5v2.25" />
//               </svg>
//             </div>
//           </div>

//           {/* Trạng thái */}
//           <div className="bg-[#161B30] border border-[#2A3352]/60 rounded-2xl p-5 flex items-center justify-between shadow-xl">
//             <div>
//               <p className="text-sm font-medium text-slate-400">Kết quả</p>
//               <div className="mt-2">
//                 {result.passed ? (
//                   <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
//                     PASSED
//                   </span>
//                 ) : (
//                   <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
//                     FAILED
//                   </span>
//                 )}
//               </div>
//             </div>
//             <div className={`p-3 rounded-xl ${result.passed ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
//               {result.passed ? (
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               ) : (
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Danh sách các câu hỏi */}
//         <div className="space-y-4">
//           {result.details.map((item: any, index: number) => (
//             <div
//               key={item.id}
//               className={`bg-[#13182C] border rounded-2xl p-5 md:p-6 shadow-md transition-colors
//                 ${item.isCorrect ? "border-emerald-500/20" : "border-rose-500/20"}`}
//             >
//               {/* Header câu hỏi */}
//               <div className="flex items-center justify-between border-b border-[#2A3352]/40 pb-3 mb-4">
//                 <span className="text-xs font-bold tracking-wider text-slate-400">
//                   CÂU HỎI {index + 1}
//                 </span>
//                 <span className={`text-xs px-2.5 py-0.5 rounded font-medium
//                   ${item.isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}
//                 >
//                   {item.isCorrect ? "Đúng" : "Sai"}
//                 </span>
//               </div>

//               {/* Nội dung câu hỏi */}
//               <p className="text-base md:text-lg font-medium text-white leading-relaxed">
//                 {item.question.question}
//               </p>

//               {/* Các câu trả lời */}
//               <div className="mt-5 space-y-2.5">
                
//                 {/* Lựa chọn của user */}
//                 <div className={`p-3.5 rounded-xl border flex items-start gap-2.5
//                   ${item.isCorrect 
//                     ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-300" 
//                     : "bg-rose-500/5 border-rose-500/10 text-rose-300"}`}
//                 >
//                   <span className="mt-0.5">{item.isCorrect ? "✓" : "✕"}</span>
//                   <div>
//                     <p className="text-xs font-medium text-slate-400 mb-0.5">Bạn chọn:</p>
//                     <p className="text-sm font-semibold">
//                       {item.answer ? item.answer.text : "Không chọn"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Đáp án đúng (Chỉ hiện khi làm sai) */}
//                 {!item.isCorrect && (
//                   <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 rounded-xl flex items-start gap-2.5">
//                     <span className="mt-0.5">✓</span>
//                     <div>
//                       <p className="text-xs font-medium text-emerald-500/60 mb-0.5">Đáp án đúng:</p>
//                       <p className="text-sm font-semibold">
//                         {item.question.answers?.find((a: any) => a.isCorrect)?.text}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import UserDashboardLayout from "../../userDashboard/page";

const BASE_URL = "http://localhost:3001";

export default function HistoryDetail() {
  const { id } = useParams();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetch(`${BASE_URL}/quiz/history/${id}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setResult(data);
        });
    }
  }, [id]);

  // Bộ khung Loading giữ nguyên Sidebar đồng bộ trang trước
  if (!result) {
    return (
      <UserDashboardLayout>
        <div className="space-y-6 animate-in fade-in duration-300 font-sans antialiased">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-300/50 rounded w-1/4"></div>
            <div className="h-3 bg-slate-300/40 rounded w-2/5 mt-1"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
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
      <div className="max-w-3xl mx-auto space-y-5 animate-in fade-in duration-300 font-sans antialiased select-none">
        
        {/* TIÊU ĐỀ KHÓA HỌC */}
        <div>
          <p className="text-[10px] font-black tracking-wider text-blue-600 uppercase">
            Chi tiết lịch sử làm bài
          </p>
          <h3 className="text-sm font-black text-slate-800 tracking-wide mt-0.5" title={result.course?.title}>
            {result.course?.title}
          </h3>
        </div>

        {/* DASHBOARD ĐIỂM SỐ & TRẠNG THÁI NHỎ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* 1. Điểm số */}
          <div className="bg-white/40 border border-white/50 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-slate-400">Điểm số đạt được</p>
              <p className="text-2xl font-black font-mono text-indigo-600">
                {result.score}%
              </p>
            </div>
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-600 border border-indigo-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-2.25a1.125 1.125 0 00-1.125 1.125V18.75m9 0V16.5L12 3L4.5 16.5v2.25" />
              </svg>
            </div>
          </div>

          {/* 2. Trạng thái kết quả */}
          <div className="bg-white/40 border border-white/50 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400">Kết quả đánh giá</p>
              <div>
                {result.passed ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    PASSED
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide bg-rose-500/10 text-rose-600 border border-rose-500/20">
                    FAILED
                  </span>
                )}
              </div>
            </div>
            <div className={`p-2.5 rounded-xl border ${result.passed ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/10" : "bg-rose-500/10 text-rose-600 border-rose-500/10"}`}>
              {result.passed ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* DANH SÁCH CHI TIẾT CÁC CÂU HỎI */}
        <div className="space-y-3">
          {result.details?.map((item: any, index: number) => (
            <div
              key={item.id}
              className={`bg-white/40 border rounded-xl p-4 shadow-sm space-y-3 transition-colors ${
                item.isCorrect ? "border-emerald-500/30" : "border-rose-500/30"
              }`}
            >
              {/* Header của câu hỏi nhỏ bên trên */}
              <div className="flex items-center justify-between border-b border-slate-200/40 pb-2">
                <span className="text-[10px] font-black tracking-wide text-slate-400 font-mono">
                  CÂU HỎI {index + 1}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide ${
                    item.isCorrect
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/10"
                      : "bg-rose-500/10 text-rose-600 border border-rose-500/10"
                  }`}
                >
                  {item.isCorrect ? "Đúng" : "Sai"}
                </span>
              </div>

              {/* Nội dung câu hỏi */}
              <p className="text-xs font-extrabold text-slate-800 leading-relaxed">
                {item.question?.question}
              </p>

              {/* Phần hiển thị đáp án lựa chọn */}
              <div className="space-y-2 pt-1">
                
                {/* Lựa chọn của người dùng */}
                <div
                  className={`p-3 rounded-xl border flex items-start gap-2 ${
                    item.isCorrect
                      ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-700"
                      : "bg-rose-500/5 border-rose-500/10 text-rose-700"
                  }`}
                >
                  <span className="text-xs font-black mt-0.5">{item.isCorrect ? "✓" : "✕"}</span>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-400">Bạn đã chọn:</p>
                    <p className="text-xs font-extrabold">
                      {item.answer ? item.answer.text : "Không lựa chọn đáp án"}
                    </p>
                  </div>
                </div>

                {/* Đáp án chính xác của hệ thống (Nếu chọn sai mới hiển thị) */}
                {!item.isCorrect && (
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 text-emerald-700 rounded-xl flex items-start gap-2">
                    <span className="text-xs font-black mt-0.5">✓</span>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-emerald-500/60">Đáp án chính xác:</p>
                      <p className="text-xs font-extrabold">
                        {item.question?.answers?.find((a: any) => a.isCorrect)?.text || "N/A"}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </UserDashboardLayout>
  );
}