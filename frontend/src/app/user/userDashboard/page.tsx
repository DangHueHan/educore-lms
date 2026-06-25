"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BASE_URL = "http://localhost:3001";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // FETCH DỮ LIỆU USER ĐỒNG BỘ CHO SIDEBAR
  async function getSidebarProfile() {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.log("Sidebar Auth Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setMounted(true);
    getSidebarProfile();
  }, []);

  const menuItems = [
    { 
      label: "Thông tin cá nhân", 
      href: "/user/profile",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      )
    },
    { 
      label: "Khóa học của tôi", 
      href: "/user/myCourses",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      )
    },
    { 
      label: "Tiến độ học tập", 
      href: "/user/myProgress",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      )
    },
    { 
      label: "Lịch sử quiz", 
      href: "/user/history",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.25 2.25 0 0 1 10.5 2.25h4.5a2.25 2.25 0 0 1 2.25 2.25m-7.5 0c0 .231.035.454.1.664m11 0c.21-.065.433-.1.664-.1a2.25 2.25 0 0 1 2.25 2.25v12a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25v-12a2.25 2.25 0 0 1 2.25-2.25c.231 0 .454.035.664.1m0 0A2.25 2.25 0 0 1 7.5 4.5h4.5a2.25 2.25 0 0 1 2.25 2.25M6.75 21h10.5" />
        </svg>
      )
    },
    { 
      label: "Thanh toán & Hoàn tiền", 
      href: "/user/myPayments",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
        </svg>
      )
    },
    { 
      label: "Cài đặt", 
      href: "/user/settings",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.767c-.3.23-.452.617-.432.998.003.074.003.147.003.22c0 .072 0 .146-.003.22a1.104 1.104 0 0 1-.432.998l1.002.767c.43.33.566.92.26 1.43l-1.297 2.247a1.125 1.125 0 0 1-1.37.49l-1.216-.456a1.125 1.125 0 0 0-1.076.124c-.073.044-.146.086-.22.128-.332.183-.582.495-.644.869l-.214 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281a1.125 1.125 0 0 0-.646-.87c-.074-.04-.148-.083-.22-.127a1.125 1.125 0 0 0-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.43l1.003-.767c.3-.23.452-.617.432-.998a1.49 1.49 0 0 0-.003-.22c0-.072 0-.146.003-.22a1.104 1.104 0 0 1 .432-.998l-1.002-.767a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.49l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      )
    },
  ];

  const handleSwitchAccount = () => {
    alert("Chuyển đổi tài khoản hệ thống...");
  };

  const handleLogout = () => {
    alert("Đăng xuất thành công!");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#E0E7FF] via-[#F3E8FF] to-[#E0F2FE] text-slate-700 font-sans antialiased select-none p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch relative z-10">
        
        {/* ==========================================
            SIDEBAR BÊN TRÁI
            ========================================== */}
        <aside className="md:col-span-4 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-5 flex flex-col justify-between shadow-xl shadow-slate-200/40 h-[640px]">
          
          <div className="space-y-5">
            {/* KHU VỰC THÔNG TIN USER */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-white/60">
              {loading ? (
                <div className="animate-pulse flex items-center gap-3 w-full">
                  <div className="w-11 h-11 bg-slate-300/60 rounded-2xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-300/60 rounded w-3/4"></div>
                    <div className="h-2.5 bg-slate-300/40 rounded w-1/2"></div>
                  </div>
                </div>
              ) : user ? (
                <>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition duration-300"></div>
                    <img 
                      src={
                        user.avatarUrl
                          ? user.avatarUrl
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=2563eb&color=fff`
                      } 
                      alt={user.displayName}
                      className="w-11 h-11 rounded-2xl object-cover border-2 border-white relative z-10 shadow-sm" 
                    />
                  </div>
                  <div className="truncate">
                    <h2 className="text-xs font-black text-slate-800 tracking-wide truncate" title={user.displayName}>
                      {user.displayName}
                    </h2>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate" title={user.email}>
                      {user.email}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-[11px] font-bold text-rose-500">Lỗi đồng bộ hồ sơ</div>
              )}
            </div>

            {/* MENULINKS */}
            <nav className="flex flex-col gap-1">
              {menuItems.map((item, idx) => {
                const isActive = mounted && (
                  pathname === item.href || 
                  (item.href !== "/user/profile" && pathname?.startsWith(item.href))
                );

                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold transition-all duration-200 group ${
                      isActive 
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02] pointer-events-none" 
                        : "text-slate-500 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/10 hover:scale-[1.01]"
                    }`}
                  >
                    <span className={`transition-transform duration-200 ${
                      isActive 
                        ? "text-white scale-105" 
                        : "text-slate-400 group-hover:text-white group-hover:scale-110"
                    }`}>
                      {item.icon}
                    </span>
                    <span className="tracking-wide">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* CHỨC NĂNG HỆ THỐNG */}
          <div className="pt-4 border-t border-white/60 space-y-1 mt-6">
            <button
              type="button"
              onClick={handleSwitchAccount}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white transition duration-200 group"
            >
              <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.656 48.656 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3M3 12c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M3 12l-3 3m3-3 3 3" />
              </svg>
              <span>Chuyển đổi tài khoản</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-gradient-to-r hover:from-rose-500 hover:to-red-600 hover:text-white transition duration-200 group"
            >
              <svg className="w-4 h-4 text-rose-500 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              <span>Đăng xuất hệ thống</span>
            </button>
          </div>
        </aside>

        {/* ==========================================
            NỘI DUNG BÊN PHẢI (CÓ THANH CUỘN SIÊU MẢNH)
            ========================================== */}
        <section className="md:col-span-8 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-xl shadow-slate-200/40 h-[640px] flex flex-col justify-between">
          
          {/* Box bọc nội dung động + Xử lý scroll mượt */}
          <div className="w-full overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-slate-300/60 scrollbar-track-transparent scrollbar-thumb-rounded-full">
            {children}
          </div>

          {/* Footer cố định bên dưới không bị cuộn theo nội dung */}
          <div className="pt-4 border-t border-white/60 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 font-bold">
            <p>Hệ thống học tập Educore © 2026</p>
            <p className="font-mono text-slate-300">UID: 99214</p>
          </div>
        </section>

      </div>
    </div>
  );
}