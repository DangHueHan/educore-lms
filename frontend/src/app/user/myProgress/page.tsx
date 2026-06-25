"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import UserDashboardLayout from "../userDashboard/page";

const BASE_URL = "http://localhost:3001";

export default function MyProgressPage() {
  const [progresses, setProgresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function getMyProgress() {
    try {
      const res = await fetch(`${BASE_URL}/course-progress/my`, {
        credentials: "include",
      });
      const data = await res.json();
      setProgresses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMyProgress();
  }, []);

  // Trạng thái Loading giữ nguyên bộ khung Sidebar cho đẹp
  if (loading) {
    return (
      <UserDashboardLayout>
        <div className="space-y-6 animate-in fade-in duration-300 font-sans antialiased">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-300/50 rounded w-1/4"></div>
            <div className="h-3 bg-slate-300/40 rounded w-2/5 mt-1"></div>
            <div className="space-y-4 mt-6">
              <div className="h-32 bg-slate-300/30 rounded-xl"></div>
              <div className="h-32 bg-slate-300/30 rounded-xl"></div>
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
          <h3 className="text-xs font-black text-slate-800 tracking-wide">Tiến độ học tập</h3>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Báo cáo chi tiết trạng thái và thời gian rèn luyện phân hệ</p>
        </div>

        {/* TRẠNG THÁI TRỐNG */}
        {progresses.length === 0 && (
          <div className="bg-white/40 border border-white/50 rounded-xl p-8 shadow-sm text-xs font-extrabold text-slate-500 text-center">
            Chưa có dữ liệu tiến độ học tập.
          </div>
        )}

        {/* DANH SÁCH TIẾN ĐỘ HỌC TẬP */}
        <div className="space-y-4">
          {progresses.map((item) => (
            <div
              key={item.id}
              className="bg-white/40 border border-white/50 rounded-xl p-5 shadow-sm flex flex-col justify-between gap-4 transition-all duration-200 hover:shadow-md"
            >
              {/* PHẦN THÔNG TIN TRÊN: Giãn rộng thoải mái */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
                
                {/* 1. THÔNG TIN KHÓA HỌC & TRẠNG THÁI */}
                <div className="flex items-center gap-4 min-w-0 flex-1 w-full md:w-auto">
                  <img
                    src={item.thumbnail || "https://via.placeholder.com/150"}
                    alt={item.courseTitle}
                    className="w-20 h-14 object-cover rounded-xl border border-white/60 bg-slate-100 flex-shrink-0"
                  />
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-black text-xs text-slate-800 tracking-wide truncate max-w-[200px] sm:max-w-md" title={item.courseTitle}>
                        {item.courseTitle}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase ${
                          item.status === "Hoàn thành"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : item.status === "Đang học"
                            ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                            : "bg-slate-500/10 text-slate-600 border border-slate-500/20"
                        }`}
                      >
                        {item.status || "Đang học"}
                      </span>
                    </div>
                    
                    <p className="text-[11px] text-slate-400 font-medium truncate">
                      Bài gần nhất: <span className="text-slate-600 font-bold">{item.lastLessonTitle || "Chưa học"}</span>
                    </p>
                  </div>
                </div>

                {/* 2. SỐ BÀI ĐÃ HỌC & TIẾN ĐỘ BAR (Đã được giãn rộng trên MD screen) */}
                <div className="w-full md:w-80 flex-shrink-0 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400">
                    <span>{item.completedLessons || 0}/{item.totalLessons || 0} bài học</span>
                    <span className="font-mono text-slate-600">{item.progressPercent || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${item.progressPercent || 0}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* PHẦN DƯỚI: Ngày cập nhật bên trái & Nút tiếp tục học bên phải */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200/40 w-full">
                <div className="text-[10px] text-slate-400 font-mono font-bold">
                  Cập nhật: {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("vi-VN") : "N/A"}
                </div>
                
                <Link
                  href={`/user/course/${item.courseId}`}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-xl text-[11px] font-extrabold shadow-md shadow-blue-600/10 transition duration-200"
                >
                  Tiếp tục học
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </UserDashboardLayout>
  );
}