"use client";

import { useEffect, useState } from "react";
import UserDashboardLayout from "../userDashboard/page";
const BASE_URL = "http://localhost:3001";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({ displayName: "", avatarUrl: "" });

  const [form, setForm] = useState({
    displayName: "",
    avatarUrl: "",
  });

  async function getProfile() {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, { credentials: "include" });
      const data = await res.json();
      setUser(data);
      setForm({
        displayName: data.displayName || "",
        avatarUrl: data.avatarUrl || "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    const newErrors = { displayName: "", avatarUrl: "" };

    // 1. Validate Tên
    const name = form.displayName.trim();
    if (name.length === 0) {
      newErrors.displayName = "Họ tên không được để trống";
    } else if (name.length < 3) {
      newErrors.displayName = "Họ tên quá ngắn (tối thiểu 3 ký tự)";
    } else if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(name)) {
      newErrors.displayName = "Họ tên không nên chứa số hoặc ký tự đặc biệt";
    }

    // 2. Validate Avatar URL
    const url = form.avatarUrl.trim();
    const urlPattern = /^https?:\/\/.+/;
    const imgPattern = /\.(jpeg|jpg|png|gif|webp)$/i;

    if (url.length === 0) {
      newErrors.avatarUrl = "URL Avatar không được để trống";
    } else if (!urlPattern.test(url)) {
      newErrors.avatarUrl = "URL phải bắt đầu bằng http:// hoặc https://";
    } else if (!imgPattern.test(url)) {
      newErrors.avatarUrl = "URL phải kết thúc bằng .jpg, .png, .gif, .webp";
    }

    if (newErrors.displayName || newErrors.avatarUrl) {
      setErrors(newErrors);
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`${BASE_URL}/users/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        alert("Cập nhật thất bại");
        return;
      }

      const data = await res.json();
      setUser(data);
      setForm({ displayName: data.displayName || "", avatarUrl: data.avatarUrl || "" });
      setIsEditing(false);
      setErrors({ displayName: "", avatarUrl: "" });
      alert("Cập nhật thành công");
    } catch (error) {
      console.log(error);
      alert("Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    setMounted(true);
    getProfile();
  }, []);

  if (!mounted || loading) {
    return (
      <UserDashboardLayout>
        <div className="space-y-6 animate-pulse p-6">
          <div className="h-4 bg-slate-300/50 rounded w-1/4"></div>
          <div className="h-32 bg-slate-300/30 rounded-xl mt-6"></div>
        </div>
      </UserDashboardLayout>
    );
  }

  if (!user) {
    return (
      <UserDashboardLayout>
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-extrabold text-center">
          Không lấy được thông tin học viên. Vui lòng thử đăng nhập lại.
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-300 font-sans antialiased select-none">
        <div>
          <h3 className="text-xs font-black text-slate-800 tracking-wide">Hồ sơ cá nhân</h3>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Quản lý dữ liệu và thông tin tài khoản học viên</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 bg-white/40 border border-white/50 p-5 rounded-xl flex items-center gap-4 shadow-sm">
            <img
              src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=2563eb&color=fff`}
              alt={user.displayName || "User"}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
            />
            <div className="truncate">
              <h4 className="text-xs font-black text-slate-800 tracking-wide truncate">{user.displayName || "N/A"}</h4>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">{user.email || "N/A"}</p>
            </div>
          </div>

          <div className="bg-white/40 border border-white/50 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Họ và tên</span>
            <p className="text-xs font-black text-slate-700 tracking-wide">{user.displayName || "N/A"}</p>
          </div>

          <div className="bg-white/40 border border-white/50 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Địa chỉ Email</span>
            <p className="text-xs font-extrabold text-slate-500 truncate" title={user.email}>{user.email || "N/A"}</p>
          </div>

          <div className="bg-white/40 border border-white/50 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Ngày gia nhập</span>
            <p className="text-xs font-mono font-bold text-slate-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "N/A"}</p>
          </div>

          <div className="bg-white/40 border border-white/50 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Đăng nhập gần nhất</span>
            <p className="text-xs font-mono font-bold text-slate-500">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("vi-VN") : "Chưa ghi nhận"}</p>
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              onClick={() => {
                // FIX: Khi bấm nút chỉnh sửa, luôn reset form về giá trị của user hiện tại
                setForm({
                  displayName: user.displayName || "",
                  avatarUrl: user.avatarUrl || "",
                });
                setErrors({ displayName: "", avatarUrl: "" }); // Reset cả lỗi
                setIsEditing(true);
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-blue-500 text-white rounded-xl shadow-[0_4px_14px_0_rgba(124,58,237,0.39)] hover:scale-[1.02] transition-all duration-300 active:scale-95 font-bold text-xs uppercase tracking-widest"
            >
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
              <h3 className="text-sm font-black text-slate-800 mb-5 uppercase tracking-wider">Chỉnh sửa hồ sơ</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Họ tên</label>
                  <input
                    value={form.displayName}
                    onChange={(e) => {
                      setForm({ ...form, displayName: e.target.value });
                      if (errors.displayName) setErrors(prev => ({ ...prev, displayName: "" }));
                    }}
                    className={`w-full border rounded-lg p-3 mt-1 text-sm ${errors.displayName ? "border-red-500 ring-1 ring-red-500" : "border-slate-200"}`}
                  />
                  {errors.displayName && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.displayName}</p>}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Avatar URL</label>
                  <input
                    value={form.avatarUrl}
                    onChange={(e) => {
                      setForm({ ...form, avatarUrl: e.target.value });
                      if (errors.avatarUrl) setErrors(prev => ({ ...prev, avatarUrl: "" }));
                    }}
                    className={`w-full border rounded-lg p-3 mt-1 text-sm ${errors.avatarUrl ? "border-red-500 ring-1 ring-red-500" : "border-slate-200"}`}
                  />
                  {errors.avatarUrl && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.avatarUrl}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => { setIsEditing(false); setErrors({ displayName: "", avatarUrl: "" }); }}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserDashboardLayout>
  );
}