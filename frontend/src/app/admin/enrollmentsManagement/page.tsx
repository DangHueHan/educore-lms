"use client";

import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3001";

type Enrollment = {
  id: string;
  enrolledAt: string;
  createdAt: string;
  updatedAt: string;
  user: { displayName?: string; email: string; };
  course: { title: string; };
};

export default function EnrollmentPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");

  useEffect(() => {
    fetchEnrollments();
  }, []);

  async function fetchEnrollments() {
    try {
      const res = await fetch(`${BASE_URL}/enrollments`);
      const data = await res.json();
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="p-6 bg-[#121624] min-h-screen text-white font-sans antialiased select-none overflow-y-auto custom-scrollbar">
      
      {/* HEADER SECTION (ĐÃ XÓA NÚT GHI DANH) */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
           Quản lý Đăng ký Học
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Danh sách thông tin học viên đăng ký tham gia vào các khóa học thuộc hệ thống Educore
        </p>
      </div>

      {/* SEARCH & FILTERS PANEL (ICON SVG CHUẨN XỊN) */}
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
            placeholder="Tìm kiếm theo tên học viên hoặc email..."
            className="w-full bg-[#121624] border border-[#2B3454] rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition"
          />
        </div>
        
        <select 
          value={filterCourse} 
          onChange={(e) => setFilterCourse(e.target.value)}
          className="bg-[#121624] border border-[#2B3454] rounded-xl px-4 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#0066FF] cursor-pointer w-full sm:w-[220px] transition"
        >
          <option value="all">Tất cả khóa học</option>
          <option value="react">ReactJS Advanced</option>
          <option value="node">Node & Express</option>
        </select>
      </div>

      {/* CORE DATA SYSTEM LIST CONTAINER */}
      <div className="bg-[#171B2A] border border-[#22283D] rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center text-zinc-500 text-[13px] font-bold pb-3 border-b border-[#22283D] px-2">
          <div className="w-[8%] pl-1">STT</div>
          <div className="w-[30%]">Học viên</div>
          <div className="w-[27%]">Khóa học</div>
          <div className="w-[18%]">Ngày ghi danh</div>
          <div className="w-[17%]">Cập nhật cuối</div>
        </div>

        <div className="divide-y divide-[#1F263E]/40 text-[13.5px]">
          {enrollments.map((item, index) => (
            <div key={item.id} className="flex items-center py-3.5 hover:bg-[#1E253A]/30 transition px-2 rounded-xl">
              <div className="w-[8%] text-zinc-400 font-mono pl-1">{String(index + 1).padStart(2, "0")}</div>
              <div className="w-[30%] pr-3 flex flex-col justify-center min-w-0">
                <span className="text-white font-semibold truncate" title={item.user?.displayName || "—"}>{item.user?.displayName || "—"}</span>
                <span className="text-xs text-zinc-400 truncate mt-0.5 font-medium" title={item.user?.email}>{item.user?.email}</span>
              </div>
              <div className="w-[27%] text-[#0066FF] font-semibold pr-3 truncate hover:underline cursor-pointer" title={item.course?.title}>{item.course?.title}</div>
              <div className="w-[18%] text-zinc-300 text-xs font-medium pr-2 truncate">{item.enrolledAt ? new Date(item.enrolledAt).toLocaleDateString() : "-"}</div>
              <div className="w-[17%] text-zinc-400 text-xs font-mono pr-1 truncate">{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "-"}</div>
            </div>
          ))}
          {enrollments.length === 0 && <div className="py-12 text-center text-zinc-500 font-medium text-xs">📭 Không tìm thấy dữ liệu phù hợp.</div>}
        </div>

        {/* PAGINATION PANEL */}
        <div className="flex items-center justify-between pt-4 border-t border-[#22283D] text-xs text-zinc-400 px-1">
          <div>
            Showing <span className="text-white font-medium">1-{enrollments.length}</span> of <span className="text-white font-medium">{enrollments.length}</span> items
          </div>
          <div className="flex items-center gap-1.5 font-semibold">
            <button className="w-7 h-7 rounded-lg border border-[#2B3454] bg-[#121624] text-zinc-400 flex items-center justify-center hover:bg-[#1C2237] disabled:opacity-40" disabled>‹</button>
            <button className="w-7 h-7 rounded-lg bg-[#0066FF] text-white flex items-center justify-center">1</button>
            <button className="w-7 h-7 rounded-lg border border-[#2B3454] bg-[#121624] flex items-center justify-center hover:bg-[#1C2237]">2</button>
            <button className="w-7 h-7 rounded-lg border border-[#2B3454] bg-[#121624] flex items-center justify-center hover:bg-[#1C2237]">3</button>
            <button className="w-7 h-7 rounded-lg border border-[#2B3454] bg-[#121624] text-zinc-400 flex items-center justify-center hover:bg-[#1C2237]">›</button>
          </div>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2b3454; border-radius: 9999px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0066FF; }
      `}</style>
    </div>
  );
}