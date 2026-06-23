"use client";

import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3001";
const ITEMS_PER_PAGE = 5;

type Coupon = {
  id: string;
  code: string;
  discountPercent: number;
  quantity: number;
  usedCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  _count: {
    courseCoupons: number;
  };
};

type Course = {
  id: string;
  title: string;
};

export default function CouponPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Loading cho modal coupon

  // Quản lý loading riêng cho các nút thao tác theo từng ID coupon
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [searchCourseTerm, setSearchCourseTerm] = useState(""); // Tìm kiếm khóa học trong modal

  /* STATE PHỤC VỤ TÌM KIẾM & BỘ LỌC ĐỂ GIỮ NGUYÊN GIAO DIỆN MẪU */
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRange, setFilterRange] = useState("all");

  // STATE PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState({
    code: "",
    discountPercent: 0,
    quantity: 0,
    isActive: true,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    try {
      const res = await fetch(`${BASE_URL}/coupons`);
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      setCoupons([]);
    }
  }

  // LOGIC LỌC, SẮP XẾP VÀ PHÂN TRANG TỰ ĐỘNG
  const processedData = coupons
    .filter((coupon) => {
      if (!searchTerm) return true;
      return (
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (filterRange === "newest") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (filterRange === "oldest") {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
      return 0;
    });

  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE) || 1;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentData = processedData.slice(indexOfFirstItem, indexOfLastItem);

  // Lọc khóa học trong modal khóa học
  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchCourseTerm.toLowerCase())
  );

  function resetForm() {
    setForm({
      code: "",
      discountPercent: 0,
      quantity: 0,
      isActive: true,
      startDate: "",
      endDate: "",
    });
    setEditingId(null);
  }

  function openCreate() {
    resetForm();
    const today = new Date().toISOString().slice(0, 10);
    setForm((prev) => ({ ...prev, startDate: today }));
    setIsModalOpen(true);
  }

  function handleEdit(coupon: Coupon) {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      quantity: coupon.quantity,
      isActive: coupon.isActive,
      startDate: coupon.startDate.slice(0, 10),
      endDate: coupon.endDate.slice(0, 10),
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        discountPercent: Number(form.discountPercent),
        quantity: Number(form.quantity),
        isActive: form.isActive,
        startDate: form.startDate,
        endDate: form.endDate,
      };

      let res: Response;

      if (editingId) {
        res = await fetch(`${BASE_URL}/coupons/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${BASE_URL}/coupons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error();

      alert(editingId ? "✅ Cập nhật thành công" : "✅ Tạo mới thành công");
      setIsModalOpen(false);
      resetForm();
      fetchCoupons();
    } catch (error) {
      console.error(error);
      alert("❌ Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Xác nhận xoá mã coupon này?")) return;
    setActionLoadingId(id);

    try {
      const res = await fetch(`${BASE_URL}/coupons/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      alert("🗑️ Xoá thành công");
      fetchCoupons();
    } catch (error) {
      console.error(error);
      alert("❌ Xoá thất bại");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleOpenCourses(couponId: string) {
    setActionLoadingId(couponId);
    setSearchCourseTerm(""); // Reset từ khóa tìm kiếm cũ
    try {
      setSelectedCouponId(couponId);
      const courseRes = await fetch(`${BASE_URL}/courses`);
      const courseData = await courseRes.json();
      setCourses(courseData);

      const assignedRes = await fetch(`${BASE_URL}/coupons/${couponId}/courses`);
      const assignedData = await assignedRes.json();

      setSelectedCourses(assignedData.map((course: Course) => course.id));
      setCourseModalOpen(true);
    } catch (error) {
      console.error(error);
      alert("Không tải được danh sách khóa học");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleSaveCourses() {
    setLoading(true); // Bật trạng thái lưu dữ liệu
    try {
      const res = await fetch(`${BASE_URL}/coupons/${selectedCouponId}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseIds: selectedCourses }),
      });

      if (!res.ok) throw new Error();

      alert("Áp dụng thành công");
      setCourseModalOpen(false);
      fetchCoupons();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-[#121624] min-h-screen text-white font-sans antialiased select-none custom-scrollbar overflow-y-auto">
      {/* HEADER ACTION BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">Quản lý Giảm giá</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Xem, khởi tạo và điều chỉnh các chương trình khuyến mãi, mã giảm giá trên hệ thống Educore
          </p>
        </div>

        <button
          onClick={openCreate}
          className="bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition duration-150 shadow-sm flex items-center gap-1.5 focus:outline-none"
        >
          <span>+</span> Thêm giảm giá mới
        </button>
      </div>

      {/* SEARCH & FILTERS CONTROLS */}
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
            placeholder="Tìm kiếm theo mã giảm giá..."
            className="w-full bg-[#121624] border border-[#2B3454] rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition"
          />
        </div>

        <select
          value={filterRange}
          onChange={(e) => setFilterRange(e.target.value)}
          className="bg-[#121624] border border-[#2B3454] rounded-xl px-4 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#0066FF] cursor-pointer w-full sm:w-[200px] transition"
        >
          <option value="all">Tất cả coupon</option>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>

      {/* MAIN DATA TABLE CONTAINER */}
      <div className="bg-[#171B2A] border border-[#22283D] rounded-2xl p-5 shadow-sm space-y-3">
        {/* TABLE WRAPPER */}
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[950px] table-fixed">
            <thead>
              <tr className="text-zinc-400 text-xs font-semibold border-b border-[#22283D]/80 uppercase tracking-wider">
                <th className="pb-3 px-3 w-[10%] font-semibold">Mã số</th>
                <th className="pb-3 px-3 w-[16%] font-semibold">Mã Coupon</th>
                <th className="pb-3 px-3 w-[10%] font-semibold text-center">Giảm (%)</th>
                <th className="pb-3 px-3 w-[10%] font-semibold text-center">Số lượng</th>
                <th className="pb-3 px-3 w-[10%] font-semibold text-center">Đã dùng</th>
                <th className="pb-3 px-3 w-[12%] font-semibold text-center">Trạng thái</th>
                <th className="pb-3 px-3 w-[11%] font-semibold text-center">Bắt đầu</th>
                <th className="pb-3 px-3 w-[11%] font-semibold text-center">Kết thúc</th>
                <th className="pb-3 px-3 w-[10%] font-semibold text-center">Khóa học</th>
                <th className="pb-3 px-3 w-[12%] font-semibold text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#1F263E]/30 text-[13px]">
              {currentData.map((coupon) => {
                const isItemLoading = actionLoadingId === coupon.id;
                const isAnyRowLoading = actionLoadingId !== null;

                return (
                  <tr key={coupon.id} className="hover:bg-[#1E253A]/40 transition duration-150 group">
                    {/* ID */}
                    <td className="py-3.5 px-3 text-zinc-500 font-mono text-xs truncate">
                      #{coupon.id.substring(0, 8)}
                    </td>

                    {/* CODE */}
                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-400 tracking-wider truncate">
                      {coupon.code}
                    </td>

                    {/* DISCOUNT PERCENT */}
                    <td className="py-3.5 px-3 text-center font-semibold text-zinc-100">{coupon.discountPercent}%</td>

                    {/* QUANTITY */}
                    <td className="py-3.5 px-3 text-center text-zinc-200 font-medium">{coupon.quantity}</td>

                    {/* USED COUNT */}
                    <td className="py-3.5 px-3 text-center text-zinc-400">{coupon.usedCount}</td>

                    {/* STATUS */}
                    <td className="py-3.5 px-3 text-center">
                      {coupon.isActive ? (
                        <span className="text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded text-xs uppercase tracking-wider">
                          Active
                        </span>
                      ) : (
                        <span className="text-rose-400 font-medium bg-rose-500/10 px-2 py-0.5 rounded text-xs uppercase tracking-wider">
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* START DATE */}
                    <td className="py-3.5 px-3 text-center text-zinc-400 text-xs font-mono">
                      {coupon.startDate ? new Date(coupon.startDate).toLocaleDateString("vi-VN") : "—"}
                    </td>

                    {/* END DATE */}
                    <td className="py-3.5 px-3 text-center text-zinc-400 text-xs font-mono">
                      {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString("vi-VN") : "—"}
                    </td>

                    {/* COURSE COUNT */}
                    <td className="py-3.5 px-3 text-center font-mono font-semibold text-blue-400">
                      {coupon._count?.courseCoupons || 0}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center justify-center gap-1.5">
                        {isItemLoading ? (
                          /* Trạng thái vòng xoay Loading chính chủ khi hàng này đang chạy API */
                          <div className="p-1.5">
                            <svg className="animate-spin h-4 w-4 text-[#0066FF]" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                        ) : (
                          <>
                            {/* Nút Áp dụng Khóa Học */}
                            <button
                              type="button"
                              disabled={isAnyRowLoading}
                              onClick={() => handleOpenCourses(coupon.id)}
                              title="Áp dụng khóa học"
                              className="p-1.5 rounded-lg bg-[#1C2237] text-zinc-400 hover:bg-emerald-600 hover:text-white transition focus:outline-none disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                              </svg>
                            </button>

                            {/* Nút Sửa */}
                            <button
                              type="button"
                              disabled={isAnyRowLoading}
                              onClick={() => handleEdit(coupon)}
                              title="Sửa"
                              className="p-1.5 rounded-lg bg-[#1C2237] text-zinc-400 hover:bg-[#6366F1] hover:text-white transition focus:outline-none disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                            </button>

                            {/* Nút Xóa */}
                            <button
                              type="button"
                              disabled={isAnyRowLoading}
                              onClick={() => handleDelete(coupon.id)}
                              title="Xóa"
                              className="p-1.5 rounded-lg bg-[#1C2237] text-zinc-500 hover:bg-[#FB7185] hover:text-white transition focus:outline-none disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {processedData.length === 0 && (
          <div className="py-12 text-center text-zinc-500 font-medium text-sm">
            Chưa tìm thấy hoặc chưa có mã coupon nào trên hệ thống.
          </div>
        )}

        {/* PAGINATION PANEL */}
        <div className="flex items-center justify-between pt-4 border-t border-[#22283D] text-xs text-zinc-400 px-1">
          <div>
            Showing <span className="text-white font-medium">{processedData.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, processedData.length)}</span> of <span className="text-white font-medium">{processedData.length}</span> items
          </div>
          <div className="flex items-center gap-1.5 font-semibold">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded-lg border border-[#2B3454] bg-[#121624] text-zinc-400 flex items-center justify-center hover:bg-[#1C2237] disabled:opacity-30 disabled:pointer-events-none transition"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${currentPage === pageNum
                    ? "bg-[#0066FF] text-white"
                    : "border border-[#2B3454] bg-[#121624] text-zinc-400 hover:bg-[#1C2237] hover:text-white"
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 rounded-lg border border-[#2B3454] bg-[#121624] text-zinc-400 flex items-center justify-center hover:bg-[#1C2237] disabled:opacity-30 disabled:pointer-events-none transition"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL CREATE / UPDATE COUPON ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#171B2A] border border-[#2B3454] w-full max-w-md max-h-[85vh] overflow-hidden rounded-2xl flex flex-col shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-5 border-b border-[#22283D] bg-[#141929]/50 shrink-0">
              <h2 className="text-base font-bold text-white">
                {editingId ? "Cập nhật thông tin Coupon" : "Tạo mã Coupon mới"}
              </h2>
              <button
                type="button"
                disabled={loading}
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm transition font-bold disabled:opacity-30"
              >
                ✕
              </button>
            </div>

            {/* MODAL FORM CONTENT */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Mã Coupon *</label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="VÍ DỤ: EDUCORE2026..."
                  className="w-full bg-[#121624] border border-[#2B3454] rounded-xl px-3.5 py-2.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition uppercase font-mono tracking-wider disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Phần trăm giảm (%) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  disabled={loading}
                  value={form.discountPercent || ""}
                  onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
                  placeholder="Nhập mức giảm từ 1 đến 100..."
                  className="w-full bg-[#121624] border border-[#2B3454] rounded-xl px-3.5 py-2.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition no-spinners disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Số lượng phát hành *</label>
                <input
                  type="number"
                  required
                  min={1}
                  disabled={loading}
                  value={form.quantity || ""}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  placeholder="Nhập tổng số lượng mã có thể sử dụng..."
                  className="w-full bg-[#121624] border border-[#2B3454] rounded-xl px-3.5 py-2.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition no-spinners disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Ngày bắt đầu</label>
                  <input
                    type="date"
                    required
                    readOnly={!editingId || loading}
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full bg-[#121624]/60 border border-[#2B3454] rounded-xl px-3.5 py-2.5 text-zinc-400 focus:outline-none cursor-not-allowed font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Ngày kết thúc *</label>
                  <input
                    type="date"
                    required
                    disabled={loading}
                    min={form.startDate}
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full bg-[#121624] border border-[#2B3454] rounded-xl px-3.5 py-2.5 text-zinc-200 focus:outline-none focus:border-[#0066FF] transition font-mono disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 text-zinc-300 font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    disabled={loading}
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-[#2B3454] bg-[#121624] text-[#0066FF] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#0066FF] disabled:opacity-50"
                  />
                  <span>Kích hoạt mã giảm giá này (Active)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#22283D] shrink-0">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setIsModalOpen(false)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading && (
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {loading ? "Đang lưu..." : "Lưu dữ liệu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL COURSE SELECTION (SIÊU CẢI TIẾN: CÓ THANH TÌM KIẾM + GRID LAYOUT CHUẨN DARKMODE) ================= */}
      {courseModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#171B2A] border border-[#2B3454] w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl flex flex-col shadow-2xl">
            {/* HEADER */}
            <div className="flex justify-between items-center p-5 border-b border-[#22283D] bg-[#141929]/50 shrink-0">
              <div>
                <h2 className="text-base font-bold text-white">Áp dụng cho Khóa học</h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">Chọn các khóa học sẽ được áp dụng mã giảm giá này</p>
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={() => setCourseModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm transition font-bold disabled:opacity-30"
              >
                ✕
              </button>
            </div>

            {/* THANH TÌM KIẾM TRONG MODAL KHÓA HỌC */}
            <div className="p-4 bg-[#141929]/30 border-b border-[#22283D]/60 shrink-0">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  disabled={loading}
                  value={searchCourseTerm}
                  onChange={(e) => setSearchCourseTerm(e.target.value)}
                  placeholder="Tìm nhanh khóa học theo tên..."
                  className="w-full bg-[#121624] border border-[#2B3454] rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition disabled:opacity-50"
                />
              </div>
            </div>

            {/* DANH SÁCH KHÓA HỌC LAYOUT GRID 2 CỘT */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 content-start text-xs">
              {filteredCourses.map((course) => {
                const isChecked = selectedCourses.includes(course.id);
                return (
                  <label
                    key={course.id}
                    className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer select-none transition ${
                      isChecked
                        ? "border-[#0066FF] bg-[#0066FF]/5"
                        : "border-[#2B3454] bg-[#121624]/40 hover:bg-[#1E253A]/60"
                    } ${loading ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <input
                      type="checkbox"
                      disabled={loading}
                      checked={isChecked}
                      className="w-4 h-4 mt-0.5 rounded border-[#2B3454] bg-[#121624] text-[#0066FF] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#0066FF]"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCourses([...selectedCourses, course.id]);
                        } else {
                          setSelectedCourses(selectedCourses.filter((id) => id !== course.id));
                        }
                      }}
                    />
                    <span className={`font-medium transition ${isChecked ? "text-white" : "text-zinc-300"}`}>
                      {course.title}
                    </span>
                  </label>
                );
              })}

              {filteredCourses.length === 0 && (
                <div className="text-center py-10 text-zinc-500 col-span-full font-medium">
                  Không tìm thấy khóa học nào khớp với từ khóa.
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center p-5 border-t border-[#22283D] bg-[#141929]/40 shrink-0 text-xs">
              <span className="text-zinc-400">
                Đã chọn: <span className="text-emerald-400 font-bold font-mono">{selectedCourses.length}</span> khóa học
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setCourseModalOpen(false)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSaveCourses}
                  className="bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading && (
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STYLES FOR SMOOTH CUSTOM SCROLLBAR & ANIMATION */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
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
        .no-spinners::-webkit-outer-spin-button,
        .no-spinners::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinners {
          -moz-appearance: textfield;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.18s ease-out forwards;
        }
      `}</style>
    </div>
  );
}