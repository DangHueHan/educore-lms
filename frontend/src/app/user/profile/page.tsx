"use client";

import { useEffect, useState } from "react";
// Import file layout chung để bọc giao diện bên ngoài
import UserDashboardLayout from "../userDashboard/page";
const BASE_URL = "http://localhost:3001";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function getProfile() {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log("PROFILE:", data);
      setUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setMounted(true);
    getProfile();
  }, []);

  // Khi đang tải dữ liệu, vẫn giữ nguyên bộ khung Sidebar bên trái cho đẹp
  if (!mounted || loading) {
    return (
      <UserDashboardLayout>
        <div className="space-y-6 animate-in fade-in duration-300 font-sans antialiased">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-300/50 rounded w-1/4"></div>
            <div className="h-3 bg-slate-300/40 rounded w-2/5 mt-1"></div>
            <div className="h-32 bg-slate-300/30 rounded-xl mt-6"></div>
          </div>
        </div>
      </UserDashboardLayout>
    );
  }

  // Trường hợp lỗi kết nối API
  if (!user) {
    return (
      <UserDashboardLayout>
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-extrabold text-center font-sans antialiased">
          Không lấy được thông tin học viên. Vui lòng thử đăng nhập lại.
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-300 font-sans antialiased select-none">
        
        {/* TIÊU ĐỀ PHÂN HỆ */}
        <div>
          <h3 className="text-xs font-black text-slate-800 tracking-wide">Hồ sơ cá nhân</h3>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Quản lý dữ liệu và thông tin tài khoản học viên</p>
        </div>

        {/* THÔNG TIN CHI TIẾT USER (GIAO DIỆN GLASS GRID) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* AVATAR & TÊN CHÍNH */}
          <div className="sm:col-span-2 bg-white/40 border border-white/50 p-5 rounded-xl flex items-center gap-4 shadow-sm">
            <img
              src={
                user.avatarUrl
                  ? user.avatarUrl
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.displayName || "User"
                    )}&background=2563eb&color=fff`
              }
              alt={user.displayName || "User"}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
            />
            <div className="truncate">
              <h4 className="text-xs font-black text-slate-800 tracking-wide truncate">
                {user.displayName || "N/A"}
              </h4>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
                {user.email || "N/A"}
              </p>
            </div>
          </div>

          {/* HỌ VÀ TÊN */}
          <div className="bg-white/40 border border-white/50 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Họ và tên</span>
            <p className="text-xs font-black text-slate-700 tracking-wide">{user.displayName || "N/A"}</p>
          </div>

          {/* ĐỊA CHỈ EMAIL */}
          <div className="bg-white/40 border border-white/50 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Địa chỉ Email</span>
            <p className="text-xs font-extrabold text-slate-500 truncate" title={user.email}>{user.email || "N/A"}</p>
          </div>

          {/* NGÀY GIA NHẬP */}
          <div className="bg-white/40 border border-white/50 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Ngày gia nhập</span>
            <p className="text-xs font-mono font-bold text-slate-500">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "N/A"}
            </p>
          </div>

          {/* HOẠT ĐỘNG CUỐI CÙNG */}
          <div className="bg-white/40 border border-white/50 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Đăng nhập gần nhất</span>
            <p className="text-xs font-mono font-bold text-slate-500">
              {user.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleString("vi-VN")
                : "Chưa ghi nhận"}
            </p>
          </div>

        </div>
      </div>
    </UserDashboardLayout>
  );
}