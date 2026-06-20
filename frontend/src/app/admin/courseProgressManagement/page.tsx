"use client";

import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3001";
const ITEMS_PER_PAGE = 5; // Số lượng hàng hiển thị trên mỗi trang

type Progress = {
  id: string;
  progressPercent: number;

  lastLessonId?: string;
  lastLessonTitle?: string;

  createdAt: string;
  updatedAt: string;

  user?: {
    displayName?: string;
    email?: string;
  };

  course?: {
    title?: string;
  };
};

type ProgressDetail = {
  id: string;
  progressPercent: number;

  lastLessonId?: string;
  lastLessonTitle?: string;

  lessonProgresses?: {
    lessonId: string;
    watchedSeconds: number;
    isCompleted: boolean;
  }[];

  user?: {
    displayName?: string;
    email?: string;
  };

  course?: {
    title?: string;

    lessons?: {
      id: string;
      title: string;
    }[];
  };
};

export default function CourseProgressManagementPage() {
  const [progresses, setProgresses] = useState<Progress[]>([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [detail, setDetail] = useState<ProgressDetail | null>(null);

  /* STATE PHỤC VỤ TÌM KIẾM & BỘ LỌC GIAO DIỆN TĨNH */
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRange, setFilterRange] = useState("all");

  /* STATE PHỤC VỤ PHÂN TRANG THỰC TẾ */
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProgresses();
  }, []);

  async function fetchProgresses() {
    try {
      const res = await fetch(`${BASE_URL}/course-progress`);
      const data = await res.json();
      console.log("BE DATA:", data);

      setProgresses(
        Array.isArray(data)
          ? data
          : data.data ?? []
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function handleView(id: string) {
    try {
      const res = await fetch(`${BASE_URL}/course-progress/${id}`);
      const data = await res.json();
      console.log("DETAIL DATA:", data);
      setDetail(data);
      setOpenDetail(true);
    } catch (error) {
      console.error(error);
      alert("Load detail failed");
    }
  }

  // =========================================================
  // LOGIC XỬ LÝ PHÂN TRANG THUẦN TÚY TRÊN MẢNG GỐC PROGRESSES
  // =========================================================
  const totalPages = Math.ceil(progresses.length / ITEMS_PER_PAGE) || 1;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  // Trích xuất dữ liệu của trang hiện tại từ mảng ban đầu
  const currentData = progresses.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6 bg-[#121624] min-h-screen text-white font-sans antialiased select-none overflow-y-auto custom-scrollbar">

      {/* HEADER SECTION */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          Tiến độ Học tập
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Quản lý và giám sát chi tiết phần trăm hoàn thành bài học, vị trí video cuối cùng của học viên Educore
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
            placeholder="Tìm kiếm theo học viên, email hoặc tên khóa học..."
            className="w-full bg-[#121624] border border-[#2B3454] rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition"
          />
        </div>

        <select
          value={filterRange}
          onChange={(e) => setFilterRange(e.target.value)}
          className="bg-[#121624] border border-[#2B3454] rounded-xl px-4 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#0066FF] cursor-pointer w-full sm:w-[200px] transition"
        >
          <option value="all">Tất cả tiến độ</option>
          <option value="completed">Đã hoàn thành (100%)</option>
          <option value="learning">Đang học (&lt; 100%)</option>
          <option value="not_start">Chưa bắt đầu (0%)</option>
        </select>
      </div>

      {/* MAIN SYSTEM DATA CONTAINER */}
      <div className="bg-[#171B2A] border border-[#22283D] rounded-2xl p-5 shadow-sm space-y-3">

        {/* HEADER DÒNG */}
        <div className="flex items-center text-zinc-500 text-[13px] font-bold pb-3 border-b border-[#22283D] px-2">
          <div className="w-[6%] pl-1">STT</div>
          <div className="w-[26%]">Học viên</div>
          <div className="w-[26%]">Khóa học</div>
          <div className="w-[18%]">Tiến độ hoàn thành</div>
          <div className="w-[11%] text-center">Bài hiện tại</div>
          <div className="w-[13%] text-right pr-1">Cập nhật cuối</div>
        </div>

        {/* BODY NỘI DUNG LẶP DANH SÁCH - THAY THẾ progresses BẰNG currentData */}
        <div className="divide-y divide-[#1F263E]/40 text-[13.5px]">
          {currentData.map((item, index) => (
            <div key={item.id} className="flex items-center py-3.5 hover:bg-[#1E253A]/30 transition px-2 rounded-xl">

              {/* STT */}
              <div className="w-[6%] text-zinc-400 font-mono pl-1">
                {String(indexOfFirstItem + index + 1).padStart(2, "0")}
              </div>

              {/* HỌC VIÊN */}
              <div className="w-[26%] pr-3 flex flex-col justify-center min-w-0">
                <span className="text-white font-semibold truncate" title={item.user?.displayName || "—"}>
                  {item.user?.displayName || "—"}
                </span>
                <span className="text-xs text-zinc-400 truncate mt-0.5 font-medium" title={item.user?.email || ""}>
                  {item.user?.email || ""}
                </span>
              </div>

              {/* KHÓA HỌC */}
              <div className="w-[26%] pr-4 min-w-0">
                <button
                  type="button"
                  onClick={() => handleView(item.id)}
                  className="text-[#0066FF] font-semibold text-left truncate hover:underline block w-full focus:outline-none"
                  title={item.course?.title || "-"}
                >
                  {item.course?.title || "-"}
                </button>
              </div>

              {/* THANH TIẾN ĐỘ PROGRESS BAR TRỰC QUAN */}
              <div className="w-[18%] pr-4 flex flex-col justify-center">
                <div className="flex items-center justify-between text-xs font-mono mb-1 font-bold">
                  <span className={item.progressPercent === 100 ? "text-emerald-400" : "text-zinc-300"}>
                    {item.progressPercent}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#121624] rounded-full overflow-hidden border border-[#2B3454]/30">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.progressPercent === 100 ? "bg-emerald-500" : "bg-[#0066FF]"
                      }`}
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* BÀI HỌC HIỆN TẠI (ĐÃ FIX BA CHẤM KHI TEXT QUÁ DÀI) */}
              <div className="w-[11%] text-center px-1 min-w-0">
                {item.progressPercent === 0 ? (
                  <span className="text-zinc-500 text-xs font-medium block truncate">Chưa học</span>
                ) : (
                  <span 
                    className="text-zinc-200 text-xs bg-[#121624] px-2.5 py-1 rounded-md border border-[#2B3454]/40 font-semibold block truncate"
                    title={item.lastLessonTitle || "Chưa học"}
                  >
                    {item.lastLessonTitle || "Chưa học"}
                  </span>
                )}
              </div>

              {/* NGÀY CẬP NHẬT */}
              <div
                className="w-[13%] text-right text-zinc-400 text-xs font-mono pr-1 truncate"
                title={item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-"}
              >
                {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "-"}
              </div>

            </div>
          ))}

          {progresses.length === 0 && (
            <div className="py-12 text-center text-zinc-500 font-medium text-sm">
              Không tìm thấy kết quả tiến độ học tập nào.
            </div>
          )}
        </div>

        {/* PAGINATION PANEL (ĐÃ ĐƯỢC ĐỒNG BỘ VỚI LOGIC PHÂN TRANG THỰC TẾ) */}
        <div className="flex items-center justify-between pt-4 border-t border-[#22283D] text-xs text-zinc-400 px-1">
          <div>
            Showing <span className="text-white font-medium">{progresses.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, progresses.length)}</span> of <span className="text-white font-medium">{progresses.length}</span> items
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

            {/* Tạo dải số trang động */}
            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${currentPage === pageNum
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

      {/* ================= MODAL DETAIL PROGRESS VIEW ================= */}
      {openDetail && detail && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#171B2A] border border-[#2B3454] w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl flex flex-col shadow-2xl">

            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-5 border-b border-[#22283D] bg-[#141929]/50">
              <div>
                <h2 className="text-base font-bold text-white">
                  Chi tiết Tiến độ Khóa học
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">ID Hồ sơ theo dõi: {detail.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenDetail(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs px-3.5 py-1.5 rounded-lg transition"
              >
                Đóng lại
              </button>
            </div>

            {/* MODAL CONTENT CONTAINER */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-[#121624]/30">

              {/* TỔNG QUAN TIẾN ĐỘ CARD */}
              <div className="bg-[#171B2A] border border-[#22283D] rounded-xl p-4 grid grid-cols-2 gap-4 text-xs">
                <div className="flex flex-col">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Học viên giám sát</span>
                  <span className="text-white font-semibold text-sm mt-0.5">{detail.user?.displayName || detail.user?.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Tên khóa học</span>
                  <span className="text-[#0066FF] font-bold text-sm mt-0.5 truncate" title={detail.course?.title}>{detail.course?.title}</span>
                </div>
                <div className="flex flex-col col-span-2 pt-2 border-t border-[#22283D]/60">
                  <div className="flex justify-between items-center text-xs text-zinc-400 mb-1.5 font-semibold">
                    <span>Tổng tiến độ chương trình</span>
                    <span className="text-white font-mono font-bold text-sm">{detail.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#121624] rounded-full overflow-hidden border border-[#2B3454]/40">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500"
                      style={{ width: `${detail.progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-zinc-500 mt-1.5 block">
                    📌 Đang học:
                    <strong>
                      {" "}{detail.lastLessonTitle || "Chưa bắt đầu"}
                    </strong>
                  </span>
                </div>
              </div>

              {/* DANH SÁCH BÀI HỌC (LESSONS TRACKING) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Trạng thái chi tiết từng bài học ({detail.course?.lessons?.length || 0} bài)
                </h3>

                <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {detail.course?.lessons?.map((lesson, index) => {
                    const progress =
                      detail.lessonProgresses?.find(
                        (p) => p.lessonId === lesson.id
                      );

                    const isCompleted =
                      progress?.isCompleted;

                    return (
                      <div
                        key={lesson.id}
                        className={`flex justify-between items-center border p-3 rounded-xl transition ${isCompleted
                          ? "bg-emerald-500/[0.01] border-emerald-500/10"
                          : "bg-[#171B2A] border-[#22283D]"
                          }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <span className="text-xs font-mono font-bold text-zinc-500 shrink-0 bg-[#121624] w-6 h-6 rounded-md flex items-center justify-center border border-[#22283D]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className={`text-xs font-medium truncate ${isCompleted ? "text-zinc-300" : "text-zinc-400"}`}>
                            {lesson.title}
                          </span>
                        </div>

                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 shrink-0">
                            ✓ Đã hoàn thành
                          </span>
                        ) : progress ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-yellow-400 px-2 py-0.5 rounded-md bg-yellow-500/10 shrink-0">
                            ▶ Đang học
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 px-2 py-0.5 rounded-md bg-zinc-800/40 shrink-0">
                            • Chưa xem
                          </span>
                        )}
                      </div>
                    );
                  })}

                  {(!detail.course?.lessons || detail.course.lessons.length === 0) && (
                    <div className="text-center py-6 text-xs text-zinc-500 font-medium">
                      Không tìm thấy dữ liệu giáo trình bài học.
                    </div>
                  )}
                </div>
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