"use client";

import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3001";

type User = {
  id: string;
  email: string;
  displayName?: string;
  role: string;
  lastLoginAt?: string | null;
  deletedAt?: string | null;
  createdAt?: string;
  isDeleted?: boolean;
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Record<string, string>>({});

  /* STATE PHỤ VỤ TÌM KIẾM / LỌC / PHÂN TRANG */
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch(`${BASE_URL}/users`);
      const data = await res.json();

      setUsers(Array.isArray(data) ? data : []);

      const roleMap: Record<string, string> = {};
      data.forEach((user: User) => {
        roleMap[user.id] = user.role;
      });
      setRoles(roleMap);
    } catch (error) {
      console.error(error);
      alert("❌ Load users thất bại");
    }
  }

  async function handleUpdateRole(id: string) {
    try {
      const res = await fetch(`${BASE_URL}/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: roles[id] }),
      });
      if (!res.ok) throw new Error();
      alert("✅ Cập nhật quyền thành công");
      fetchUsers();
    } catch {
      alert("❌ Cập nhật quyền thất bại");
    }
  }

  async function handleLock(id: string) {
    if (!confirm("Khóa tài khoản này?")) return;
    try {
      const res = await fetch(`${BASE_URL}/users/${id}/lock`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      alert("🔒 Đã khóa tài khoản");
      fetchUsers();
    } catch {
      alert("❌ Khóa tài khoản thất bại");
    }
  }

  async function handleRestore(id: string) {
    try {
      const res = await fetch(`${BASE_URL}/users/${id}/restore`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      alert("✅ Đã khôi phục tài khoản");
      fetchUsers();
    } catch {
      alert("❌ Khôi phục thất bại");
    }
  }

  return (
    <div className="p-6 bg-[#121624] min-h-screen text-white font-sans antialiased select-none overflow-y-auto custom-scrollbar">
      
      {/* HEADER SECTION (ĐÃ XÓA NÚT THÊM MỚI) */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
           Quản lý Hệ thống
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Danh sách thông tin tài khoản, cấu hình vai trò phân quyền và trạng thái nhân sự Educore
        </p>
      </div>

      {/* SEARCH & FILTERS CONTROLS (ICON SVG CHUẨN XỊN) */}
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
            placeholder="Tìm kiếm theo tên, email..."
            className="w-full bg-[#121624] border border-[#2B3454] rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition"
          />
        </div>
        
        <select 
          value={filterRole} 
          onChange={(e) => setFilterRole(e.target.value)}
          className="bg-[#121624] border border-[#2B3454] rounded-xl px-4 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#0066FF] cursor-pointer w-full sm:w-[180px] transition"
        >
          <option value="all">Tất cả Vai trò</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#121624] border border-[#2B3454] rounded-xl px-4 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#0066FF] cursor-pointer w-full sm:w-[180px] transition"
        >
          <option value="all">Tất cả Trạng thái</option>
          <option value="active">Đang chạy</option>
          <option value="locked">Tạm khóa</option>
        </select>
      </div>

      {/* CORE DATA SYSTEM LIST CONTAINER */}
      <div className="bg-[#171B2A] border border-[#22283D] rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center text-zinc-500 text-[13px] font-bold pb-3 border-b border-[#22283D] px-2">
          <div className="w-[6%] pl-1">Mã số</div>
          <div className="w-[20%]">Email</div>
          <div className="w-[18%]">Họ và Tên</div>
          <div className="w-[15%]">Vai trò</div>
          <div className="w-[14%]">Last Login</div>
          <div className="w-[12%]">Trạng thái</div>
          <div className="w-[15%] text-center">Hoạt động</div>
        </div>

        <div className="divide-y divide-[#1F263E]/40 text-[13.5px]">
          {users.map((user, index) => (
            <div key={user.id} className="flex items-center py-3.5 hover:bg-[#1E253A]/30 transition px-2 rounded-xl">
              <div className="w-[6%] text-zinc-400 font-mono pl-1">{String(index + 1).padStart(2, "0")}</div>
              <div className="w-[20%] text-zinc-300 font-medium pr-3 truncate" title={user.email}>{user.email}</div>
              <div className="w-[18%] text-white font-semibold pr-3 truncate" title={user.displayName || "-"}>{user.displayName || "-"}</div>
              <div className="w-[15%] pr-4">
                <select
                  value={roles[user.id] || user.role}
                  onChange={(e) => setRoles({ ...roles, [user.id]: e.target.value })}
                  className="bg-[#121624] border border-[#2B3454] rounded-lg px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-[#0066FF] cursor-pointer w-full transition"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="w-[14%] text-zinc-400 text-xs font-mono pr-2 truncate">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "-"}</div>
              <div className="w-[12%] shrink-0">
                {!user.isDeleted ? (
                  <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Đang chạy</span>
                ) : (
                  <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Tạm khóa</span>
                )}
              </div>
              <div className="w-[15%] text-center shrink-0">
                <div className="flex items-center justify-center gap-2">
                  <button type="button" onClick={() => handleUpdateRole(user.id)} className="text-xs text-amber-400 font-semibold hover:underline">Update</button>
                  <span className="text-zinc-700">|</span>
                  {!user.isDeleted ? (
                    <button type="button" onClick={() => handleLock(user.id)} className="text-xs text-rose-400 font-semibold hover:underline">Lock</button>
                  ) : (
                    <button type="button" onClick={() => handleRestore(user.id)} className="text-xs text-emerald-400 font-semibold hover:underline">Restore</button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {users.length === 0 && <div className="py-12 text-center text-zinc-500 font-medium text-sm">📭 Không tìm thấy kết quả phù hợp.</div>}
        </div>

        {/* PAGINATION PANEL */}
        <div className="flex items-center justify-between pt-4 border-t border-[#22283D] text-xs text-zinc-400 px-1">
          <div>
            Showing <span className="text-white font-medium">1-{users.length}</span> of <span className="text-white font-medium">{users.length}</span> items
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