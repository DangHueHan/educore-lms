"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// Import file layout chung để bọc giao diện bên ngoài
import UserDashboardLayout from "../userDashboard/page";

const BASE_URL = "http://localhost:3001";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function getMyCourses() {
    try {
      const res = await fetch(`${BASE_URL}/enrollments/my`, {
        credentials: "include",
      });
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMyCourses();
  }, []);

  // Khi đang tải dữ liệu, vẫn giữ nguyên bộ khung Sidebar bên trái cho đẹp
  if (loading) {
    return (
      <UserDashboardLayout>
        <div className="space-y-6 animate-in fade-in duration-300 font-sans antialiased">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-300/50 rounded w-1/4"></div>
            <div className="h-3 bg-slate-300/40 rounded w-2/5 mt-1"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="h-48 bg-slate-300/30 rounded-xl"></div>
              <div className="h-48 bg-slate-300/30 rounded-xl hidden md:block"></div>
              <div className="h-48 bg-slate-300/30 rounded-xl hidden lg:block"></div>
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
          <h3 className="text-xs font-black text-slate-800 tracking-wide">Khóa học của tôi</h3>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Danh sách toàn bộ phân hệ khóa học bạn đã sở hữu</p>
        </div>

        {/* TRẠNG THÁI TRỐNG */}
        {courses.length === 0 && (
          <div className="bg-white/40 border border-white/50 rounded-xl p-6 shadow-sm text-xs font-extrabold text-slate-500 text-center">
            Bạn chưa đăng ký tham gia khóa học nào.
          </div>
        )}

        {/* DANH SÁCH KHÓA HỌC GIAO DIỆN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/user/courseDetail/${course.id}`}
              className="bg-white/40 border border-white/50 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between group transition-all duration-200 hover:shadow-md hover:scale-[1.01] cursor-pointer"
            >
              <div>
                {/* 1. HÌNH ẢNH MINH HỌA */}
                <div className="relative overflow-hidden aspect-video border-b border-slate-200/40">
                  <img
                    src={course.thumbnail || "https://via.placeholder.com/600x350"}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* 2. THÔNG TIN KHÓA HỌC */}
                <div className="p-4 space-y-2">
                  <h4 className="font-black text-xs text-slate-800 tracking-wide line-clamp-1 group-hover:text-blue-600 transition-colors duration-150">
                    {course.title}
                  </h4>

                  <p className="text-slate-400 text-[11px] font-medium line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* THÔNG TIN CHI PHÍ GIAO DỊCH */}
                  <div className="pt-1 text-[11px]">
                    {course.isFree ? (
                      <span className="text-emerald-600 font-black">Miễn phí</span>
                    ) : (
                      <div className="space-y-0.5 font-bold text-slate-500">
                        <div className="text-[10px] text-slate-400 line-through">
                          Giá gốc: {course.purchaseInfo?.originalAmount?.toLocaleString()}đ
                        </div>
                        <div className="text-[10px] text-rose-400">
                          Giảm giá: {course.purchaseInfo?.discountAmount?.toLocaleString()}đ
                        </div>
                        <div className="text-blue-600 font-extrabold">
                          Đã thanh toán: {course.purchaseInfo?.paidAmount?.toLocaleString()}đ
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </UserDashboardLayout>
  );
}