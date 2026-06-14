"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // State quản lý việc đóng/mở của từng nhóm menu (Mặc định mở hết khi load)
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({
    "Core": true,
    "Course Management": true,
    "User Management": true,
    "Learning Analytics": true,
    "System": true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hàm toggle đóng/mở nhóm
  const toggleGroup = (groupTitle: string) => {
    // Nếu sidebar đang thu nhỏ, bấm vào nhóm thì tự động bung sidebar ra trước
    if (!isExpanded) {
      setIsExpanded(true);
    }
    setOpenGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  const menuGroups = [
    {
      title: "Core",
      items: [
        { 
          name: "Dashboard", 
          href: "/admin/dashboard", 
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> 
        },
        { 
          name: "Profile", 
          href: "/admin/profile", 
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> 
        },
      ]
    },
    {
      title: "Course Management",
      items: [
        { 
          name: "Courses", 
          href: "/admin/courseManagement", 
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> 
        },
        { 
          name: "Lessons", 
          href: "/admin/videoManagement", 
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
        },
        { 
          name: "Questions", 
          href: "/admin/questionManagement", 
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
        },
        { 
          name: "Answers", 
          href: "/admin/answerManagement", 
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
        },
      ]
    },
    {
      title: "User Management",
      items: [
        { 
          name: "Users", 
          href: "/admin/userManagement", 
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> 
        },
        { 
          name: "Enrollments", 
          href: "/admin/enrollmentsManagement", 
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> 
        },
      ]
    },
    {
      title: "Learning Analytics",
      items: [
        { 
          name: "Quiz Results", 
          href: "/admin/quizResultManagement", 
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> 
        },
        { 
          name: "Course Progress", 
          href: "/admin/courseProgressManagement", 
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg> 
        },
      ]
    },
    {
      title: "System",
      items: [
        { 
          name: "Settings", 
          href: "/admin/settings", 
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> 
        },
      ]
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#0F111A] text-white font-sans flex antialiased select-none">
      
      {/* SIDEBAR - Hỗ trợ cuộn dọc ẩn thanh cuộn thô */}
      <div 
        className={`bg-[#171B2A] border-r border-[#22283D] flex flex-col pt-6 pb-4 transition-all duration-300 shrink-0 h-screen sticky top-0 overflow-y-auto
          ${isExpanded ? 'w-64 px-4' : 'w-20 px-3 items-center'}
        `}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* LOGO */}
        <div className={`flex items-center mb-6 h-10 shrink-0 ${isExpanded ? 'px-2 gap-3' : 'justify-center'}`}>
          <span className="w-9 h-9 rounded-xl bg-[#0066FF] flex items-center justify-center font-black text-white text-lg shadow-md select-none">
            E
          </span>
          {isExpanded && (
            <span className="text-xl font-black tracking-tight text-white leading-none">Educore</span>
          )}
        </div>

        {/* MENU ITEMS GROUPED */}
        <nav className="space-y-4 w-full flex-1">
          {menuGroups.map((group, groupIndex) => {
            const isGroupOpen = openGroups[group.title];

            return (
              <div key={groupIndex} className="space-y-1">
                {/* TIÊU ĐỀ NHÓM (CÓ THỂ CLICK ĐỂ ĐÓNG/MỞ) */}
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={`w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 py-2 select-none transition-colors
                    ${isExpanded ? 'px-3' : 'justify-center border-t border-[#22283D]/50 mt-3 pt-3'}
                  `}
                >
                  {isExpanded ? (
                    <>
                      <span>{group.title}</span>
                      {/* Mũi tên chỉ hướng đóng mở */}
                      <svg 
                        className={`w-3 h-3 transition-transform duration-200 ${isGroupOpen ? 'rotate-180' : 'rotate-0'}`} 
                        fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </>
                  ) : (
                    // Khi thu nhỏ sidebar, tạo một dấu chấm nhỏ hoặc vạch phân cách
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-zinc-400" />
                  )}
                </button>

                {/* DANH SÁCH ITEM CON - Chạy hiệu ứng mượt khi đóng/mở */}
                <div 
                  className={`space-y-1 transition-all duration-300 ease-in-out overflow-hidden
                    ${isGroupOpen || !isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
                  `}
                >
                  {group.items.map((item, index) => {
                    const isActive = mounted && (
                      pathname === item.href || 
                      (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href))
                    );

                    return (
                      <Link
                        key={index}
                        href={item.href}
                        className={`w-full flex items-center rounded-xl text-[14px] font-semibold group transition-all duration-300 ease-in-out
                          ${isExpanded ? 'px-4 py-2.5 gap-4 justify-start' : 'p-3 justify-center'}
                          ${isActive 
                            ? 'bg-[#A7F3D0] text-black shadow-md pointer-events-none' 
                            : 'text-zinc-400 hover:bg-[#A7F3D0]/10 hover:text-white'
                          }
                        `}
                      >
                        {/* Icon SVG */}
                        <div className={`shrink-0 transition-colors duration-300 ease-in-out 
                          ${isActive ? 'text-black' : 'text-zinc-400 group-hover:text-white'}`}
                        >
                          {item.icon}
                        </div>
                        
                        {isExpanded && (
                          <span className="transition-opacity duration-300 truncate">
                            {item.name}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-[#22283D] bg-[#121624] px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg bg-[#1C2237] hover:bg-[#252E4A] text-zinc-300 transition shrink-0 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
            </button>

            <div className="relative w-full">
              <span className="absolute inset-y-0 left-4 flex items-center text-zinc-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Search here..." 
                className="w-full bg-[#1C2237] border border-[#2B3454] rounded-xl pl-11 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button className="p-2.5 rounded-xl bg-[#1C2237] text-zinc-400 hover:text-white relative transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-[#1C2237] border border-[#2B3454] transition group-hover:border-zinc-500"></div>
              <span className="text-zinc-500 text-xs group-hover:text-white transition">▼</span>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}