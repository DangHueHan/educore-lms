"use client";

import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3001";
const ITEMS_PER_PAGE = 5; // Số lượng hàng hiển thị trên mỗi trang

type QuizResult = {
  id: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  createdAt: string;

  user?: {
    displayName?: string;
    email?: string;
  };

  course?: {
    title?: string;
  };
};

type QuizResultDetail = {
  id: string;

  user?: {
    displayName?: string;
    email?: string;
  };

  course?: {
    title?: string;
  };

  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;

  details: {
    id: string;

    isCorrect: boolean;

    question: {
      question: string;

      answers: {
        text: string;
        isCorrect: boolean;
      }[];
    };

    answer?: {
      text: string;
    };
  }[];
};

export default function QuizResultManagementPage() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [detail, setDetail] = useState<QuizResultDetail | null>(null);

  /* STATE PHỤC VỤ TÌM KIẾM & BỘ LỌC GIAO DIỆN TĨNH */
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  /* STATE PHỤC VỤ PHÂN TRANG THỰC TẾ */
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchResults();
  }, []);

  async function fetchResults() {
    try {
      const res = await fetch(`${BASE_URL}/quiz-results`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleView(id: string) {
    try {
      const res = await fetch(`${BASE_URL}/quiz-results/${id}`);
      const data = await res.json();
      setDetail(data);
      setOpenDetail(true);
    } catch (err) {
      console.error(err);
      alert("Load detail failed");
    }
  }

  // =========================================================
  // LOGIC XỬ LÝ PHÂN TRANG THUẦN TÚY TRÊN MẢNG GỐC RESULTS
  // =========================================================
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE) || 1;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  
  // Trích xuất dữ liệu của trang hiện tại từ mảng ban đầu
  const currentData = results.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6 bg-[#121624] min-h-screen text-white font-sans antialiased select-none overflow-y-auto custom-scrollbar">
      
      {/* HEADER SECTION */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
           Kết quả Kiểm tra
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Theo dõi điểm số, tỷ lệ hoàn thành chính xác và trạng thái đạt/trượt của học viên Educore
        </p>
      </div>

      {/* SEARCH & FILTERS CONTROLS (GIỮ NGUYÊN GIAO DIỆN) */}
      <div className="bg-[#171B2A]/60 border border-[#22283D] p-4 rounded-2xl flex flex-col sm:flex-row gap-3 mb-4 items-center">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên học viên, email hoặc khóa học..."
            className="w-full bg-[#121624] border border-[#2B3454] rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition"
          />
        </div>

        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#121624] border border-[#2B3454] rounded-xl px-4 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#0066FF] cursor-pointer w-full sm:w-[180px] transition"
        >
          <option value="all">Tất cả Kết quả</option>
          <option value="passed">Đạt (Passed)</option>
          <option value="failed">Trượt (Failed)</option>
        </select>
      </div>

      {/* MAIN DATA LIST CONTAINER */}
      <div className="bg-[#171B2A] border border-[#22283D] rounded-2xl p-5 shadow-sm space-y-3">
        
        {/* HEADER DÒNG */}
        <div className="flex items-center text-zinc-500 text-[13px] font-bold pb-3 border-b border-[#22283D] px-2">
          <div className="w-[6%] pl-1">STT</div>
          <div className="w-[26%]">Học viên</div>
          <div className="w-[24%]">Khóa học</div>
          <div className="w-[10%] text-center">Điểm số</div>
          <div className="w-[10%] text-center">Số câu đúng</div>
          <div className="w-[12%] text-center">Kết quả</div>
          <div className="w-[12%] text-center">Hành động</div>
        </div>

        {/* BODY NỘI DUNG LẶP - THAY THẾ results BẰNG currentData */}
        <div className="divide-y divide-[#1F263E]/40 text-[13.5px]">
          {currentData.map((item, index) => (
            <div key={item.id} className="flex items-center py-3.5 hover:bg-[#1E253A]/30 transition px-2 rounded-xl">
              
              {/* CỘT STT */}
              <div className="w-[6%] text-zinc-400 font-mono pl-1">
                {String(indexOfFirstItem + index + 1).padStart(2, "0")}
              </div>

              {/* CỘT HỌC VIÊN */}
              <div className="w-[26%] pr-3 flex flex-col justify-center min-w-0">
                <span className="text-white font-semibold truncate" title={item.user?.displayName || "—"}>
                  {item.user?.displayName || "—"}
                </span>
                <span className="text-xs text-zinc-400 truncate mt-0.5 font-medium" title={item.user?.email || ""}>
                  {item.user?.email || ""}
                </span>
              </div>

              {/* CỘT KHÓA HỌC */}
              <div className="w-[24%] text-zinc-300 font-medium pr-3 truncate" title={item.course?.title || "-"}>
                {item.course?.title || "-"}
              </div>

              {/* CỘT ĐIỂM SỐ */}
              <div className="w-[10%] text-center font-mono font-bold text-amber-400">
                {item.score}
              </div>

              {/* CỘT SỐ CÂU ĐÚNG */}
              <div className="w-[10%] text-center font-mono text-zinc-400">
                <span className="text-zinc-200 font-semibold">{item.correctAnswers}</span>/{item.totalQuestions}
              </div>

              {/* CỘT KẾT QUẢ ĐẠT / TRƯỢT */}
              <div className="w-[12%] flex justify-center shrink-0">
                {item.passed ? (
                  <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Passed
                  </span>
                ) : (
                  <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Failed
                  </span>
                )}
              </div>

              {/* CỘT HÀNH ĐỘNG */}
              <div className="w-[12%] text-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleView(item.id)}
                  className="text-xs text-[#0066FF] font-semibold hover:underline"
                >
                  View Detail
                </button>
              </div>

            </div>
          ))}

          {results.length === 0 && (
            <div className="py-12 text-center text-zinc-500 font-medium text-sm">
               Không tìm thấy dữ liệu kết quả kiểm tra nào.
            </div>
          )}
        </div>

        {/* PAGINATION PANEL (ĐÃ KẾT NỐI VỚI LOGIC PHÂN TRANG THỰC TẾ) */}
        <div className="flex items-center justify-between pt-4 border-t border-[#22283D] text-xs text-zinc-400 px-1">
          <div>
            Showing <span className="text-white font-medium">{results.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, results.length)}</span> of <span className="text-white font-medium">{results.length}</span> items
          </div>
          <div className="flex items-center gap-1.5 font-semibold">
            {/* Nút lùi trang */}
            <button 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded-lg border border-[#2B3454] bg-[#121624] text-zinc-400 flex items-center justify-center hover:bg-[#1C2237] disabled:opacity-30 disabled:pointer-events-none"
            >
              ‹
            </button>
            
            {/* Render số trang động */}
            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNum = idx + 1;
              return (
                <button 
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                    currentPage === pageNum
                      ? "bg-[#0066FF] text-white"
                      : "border border-[#2B3454] bg-[#121624] text-zinc-400 hover:bg-[#1C2237]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Nút tiến trang */}
            <button 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 rounded-lg border border-[#2B3454] bg-[#121624] text-zinc-400 flex items-center justify-center hover:bg-[#1C2237] disabled:opacity-30 disabled:pointer-events-none"
            >
              ›
            </button>
          </div>
        </div>

      </div>

      {/* ================= MODAL DETAIL VIEW CONTAINER ================= */}
      {openDetail && detail && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#171B2A] border border-[#2B3454] w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl flex flex-col shadow-2xl">
            
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-5 border-b border-[#22283D] bg-[#141929]/50">
              <div>
                <h2 className="text-base font-bold text-white">
                   Chi tiết bài làm học viên
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">Mã kết quả bài thi: {detail.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenDetail(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs px-3.5 py-1.5 rounded-lg transition"
              >
                Đóng lại
              </button>
            </div>

            {/* MODAL CONTENT CONTAINER (SCROLLABLE) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#121624]/30">
              
              {/* OVERVIEW DATA GRID CARD */}
              <div className="bg-[#171B2A] border border-[#22283D] rounded-xl p-4 grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
                <div className="flex flex-col">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Học viên</span>
                  <span className="text-zinc-200 font-semibold text-sm mt-0.5">{detail.user?.displayName || detail.user?.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Khóa học chỉ định</span>
                  <span className="text-[#0066FF] font-bold text-sm mt-0.5 truncate" title={detail.course?.title}>{detail.course?.title}</span>
                </div>
                <div className="flex flex-col pt-2 border-t border-[#22283D]/60">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Tổng điểm số đạt được</span>
                  <span className="text-amber-400 font-bold font-mono text-base mt-0.5">{detail.score} điểm</span>
                </div>
                <div className="flex flex-col pt-2 border-t border-[#22283D]/60">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Trạng thái / Tỷ lệ</span>
                  <div className="flex items-center gap-2 mt-1">
                    {detail.passed ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PASSED</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">FAILED</span>
                    )}
                    <span className="text-zinc-400 font-mono font-medium">({detail.correctAnswers}/{detail.totalQuestions} câu đúng)</span>
                  </div>
                </div>
              </div>

              {/* LIST QUESTIONS BLOCK */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Nội dung chi tiết từng câu hỏi
                </h3>
                
                {detail.details.map((d, index) => {
                  const correctAnswer = d.question.answers.find((a) => a.isCorrect);

                  return (
                    <div
                      key={d.id}
                      className={`border p-4 rounded-xl space-y-2.5 transition relative overflow-hidden ${
                        d.isCorrect 
                          ? "bg-emerald-500/[0.02] border-emerald-500/20" 
                          : "bg-rose-500/[0.02] border-rose-500/20"
                      }`}
                    >
                      {/* Badge check đúng sai ở góc phải */}
                      <span className={`absolute top-3 right-4 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        d.isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {d.isCorrect ? "✓ Chính xác" : "✗ Bị sai"}
                      </span>

                      <h4 className="text-xs font-bold text-zinc-400">
                        Câu hỏi {index + 1}:
                      </h4>
                      
                      <p className="text-sm font-semibold text-white leading-relaxed pr-20">
                        {d.question.question}
                      </p>

                      <div className="pt-2 grid gap-2 text-xs">
                        {/* Lựa chọn của người dùng */}
                        <div className="p-2.5 bg-[#121624] border border-[#22283D] rounded-lg flex items-start gap-2">
                          <span className="text-zinc-500 font-medium shrink-0">Đã chọn:</span>
                          <span className={`font-medium ${d.isCorrect ? "text-emerald-400" : "text-rose-400 font-semibold"}`}>
                            {d.answer?.text || "Không có câu trả lời (Bỏ trống)"}
                          </span>
                        </div>

                        {/* Đáp án chính xác */}
                        {!d.isCorrect && (
                          <div className="p-2.5 bg-[#121624] border border-emerald-500/20 rounded-lg flex items-start gap-2">
                            <span className="text-emerald-500 font-medium shrink-0">Đáp án đúng:</span>
                            <span className="text-zinc-300 font-medium">
                              {correctAnswer?.text || "—"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* STYLES FOR SMOOTH CUSTOM SCROLLBAR */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2b3454;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0066FF;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>

    </div>
  );
}