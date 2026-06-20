"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSendToken() {
    if (!email.trim()) {
      setMessage("Vui lòng nhập email");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3001/auth/send-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Gửi token thất bại");
        return;
      }
      setShowTokenInput(true);
      setMessage("✓ Token đã được gửi tới email của bạn");
    } catch {
      setMessage("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    if (!token.trim()) {
      setMessage("Vui lòng nhập token");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3001/auth/verify-token", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Token không hợp lệ");
        return;
      }
      setMessage("✓ Đăng nhập thành công");
      setTimeout(() => {
        window.location.href = "/user/home";
      }, 1000);
    } catch {
      setMessage("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  }

  // Nút bấm giữ tone tối huyền bí (nền tối, viền xanh tím, hover mới sáng lên)
  const buttonClass = "w-full bg-[#192548] border-2 border-[#3A497A] text-white font-bold text-center px-5 py-3.5 rounded-xl hover:bg-[#4F46E5] hover:border-transparent transition mt-2 cursor-pointer shadow-lg shadow-[#4F46E5]/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#192548] disabled:hover:border-[#3A497A]";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#091535] to-[#141225] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center space-y-6">

        {/* HEADER - Màu xanh tím huyền bí */}
        <h1 className="text-xl md:text-2xl font-black tracking-[0.2em] text-[#6366F1] uppercase [text-shadow:0_0_20px_rgba(99,102,241,0.5)]">
          EDUCORE AUTH
        </h1>

        {/* FORM */}
        <div className="w-full bg-[#111A35]/90 border border-[#21305D] rounded-2xl p-7 shadow-2xl shadow-[#101931]/50 relative overflow-hidden">

          {/* EFFECT ĐÈN NỀN MỜ ẢO */}
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#1E1B4B] rounded-full blur-[60px] opacity-60"></div>
          <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#312E81] rounded-full blur-[60px] opacity-40"></div>

          <div className="text-center mb-6 relative z-10">
            <h2 className="text-lg font-bold text-gray-200">
              Đăng nhập hệ thống
            </h2>
          </div>

          <div className="space-y-4 relative z-10">

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2"
              >
                Email của bạn
              </label>
              {/* Đã xóa font-semibold giúp text thanh mảnh, dễ nhìn hơn */}
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="danghan05@gmail.com"
                className="w-full bg-[#192548] border border-[#21305D] rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition"
              />
            </div>

            {/* MESSAGE */}
            {message && (
              <div className={`border rounded-xl px-4 py-3 text-sm text-center font-semibold bg-[#192548]/50 ${
                message.startsWith("✓") 
                  ? "border-green-500/30 text-green-400" 
                  : "border-red-500/30 text-red-400"
              }`}>
                {message}
              </div>
            )}

            {/* TOKEN */}
            {showTokenInput && (
              <div>
                <label
                  htmlFor="token"
                  className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2"
                >
                  Token bảo mật
                </label>
                {/* Đã xóa font-semibold ở đây luôn */}
                <input
                  type="text"
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Nhập mã token được cấp"
                  className="w-full bg-[#192548] border border-[#21305D] rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition"
                />
              </div>
            )}

            {/* BUTTON */}
            {!showTokenInput ? (
              <button
                type="button"
                disabled={loading}
                onClick={handleSendToken}
                className={buttonClass}
              >
                {loading ? "ĐANG GỬI..." : "GỬI TOKEN"}
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleLogin}
                className={buttonClass}
              >
                {loading ? "ĐANG XÁC THỰC..." : "ĐĂNG NHẬP"}
              </button>
            )}

          </div>
        </div>

        {/* FOOTER */}
        <p className="text-[11px] text-gray-500 font-mono tracking-widest uppercase">
          SECURE ACCESS • NO PASSWORD REQUIRED
        </p>
      </div>
    </div>
  );
}