"use client";

import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3001";
const ITEMS_PER_PAGE = 5; // Bạn có thể tùy chỉnh số lượng hiển thị mỗi trang ở đây

type Course = {
  id: string;
  title: string;
  price: number;
  description?: string;
  thumbnail?: string;
  createdAt?: string;
};

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState<Course[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
  });

  const [loading, setLoading] = useState(false);

  /* STATE PHỤC VỤ TÌM KIẾM & BỘ LỌC ĐỂ GIỮ NGUYÊN GIAO DIỆN MẪU */
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRange, setFilterRange] = useState("all");

  // =========================
  // STATE THÊM MỚI: PHÂN TRANG
  // =========================
  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // PREVIEW FILE (KEEP LOGIC)
  // =========================
  useEffect(() => {
    if (!file) {
      if (!editingId) setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file, editingId]);

  // =========================
  // GET ALL COURSES (KEEP LOGIC)
  // =========================
  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await fetch(`${BASE_URL}/courses`);
      const data = await res.json();

      setTableData(Array.isArray(data) ? data : []);
      setCurrentPage(1); // Reset về trang 1 mỗi lần lấy dữ liệu mới
    } catch (err) {
      console.error(err);
      setTableData([]);
    }
  }

  // =========================
  // LOGIC PHÂN TRANG (TỰ ĐỘNG TÍNH TOÁN)
  // =========================
  const totalPages = Math.ceil(tableData.length / ITEMS_PER_PAGE) || 1;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentData = tableData.slice(indexOfFirstItem, indexOfLastItem);

  // =========================
  // RESET FORM (KEEP LOGIC)
  // =========================
  function resetForm() {
    setForm({ title: "", description: "", price: 0 });
    setFile(null);
    setPreviewUrl(null);
    setEditingId(null);
  }

  // =========================
  // OPEN CREATE (KEEP LOGIC)
  // =========================
  function openCreate() {
    resetForm();
    setIsModalOpen(true);
  }

  // =========================
  // OPEN EDIT (KEEP LOGIC)
  // =========================
  function handleEdit(row: Course) {
    setEditingId(row.id);

    setForm({
      title: row.title || "",
      description: row.description || "",
      price: row.price || 0,
    });

    setPreviewUrl(row.thumbnail || null);
    setFile(null);

    setIsModalOpen(true);
  }

  // =========================
  // UPLOAD IMAGE (KEEP LOGIC)
  // =========================
  async function uploadImage() {
    if (!file) return "";

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BASE_URL}/upload/image`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("❌ Upload ảnh thất bại");
      return "";
    }

    const data = await res.json();
    return data.url;
  }

  // =========================
  // SUBMIT CREATE / UPDATE (KEEP LOGIC)
  // =========================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      let imageUrl = "";

      if (file) {
        imageUrl = await uploadImage();
      }

      const payload: any = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
      };

      if (imageUrl) {
        payload.thumbnail = imageUrl;
      }

      let res;

      if (editingId) {
        res = await fetch(`${BASE_URL}/courses/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${BASE_URL}/courses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error();

      alert(editingId ? "✅ Cập nhật thành công" : "✅ Tạo mới thành công");

      setIsModalOpen(false);
      resetForm();
      fetchCourses();
    } catch (err) {
      alert("❌ Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // DELETE (KEEP LOGIC)
  // =========================
  async function handleDelete(id: string) {
    if (!confirm("Xác nhận xoá khóa học này?")) return;

    try {
      const res = await fetch(`${BASE_URL}/courses/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      alert("🗑️ Xoá thành công");
      fetchCourses();
    } catch {
      alert("❌ Xoá thất bại");
    }
  }

  return (
    <div className="p-6 bg-[#121624] min-h-screen text-white font-sans antialiased select-none custom-scrollbar overflow-y-auto">

      {/* HEADER ACTION BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Quản lý Khóa học
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Xem, khởi tạo và cập nhật thông tin tổng quan các chương trình đào tạo trên hệ thống Educore
          </p>
        </div>

        <button
          onClick={openCreate}
          className="bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition duration-150 shadow-sm flex items-center gap-1.5 focus:outline-none"
        >
          <span>+</span> Thêm khóa học
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
            placeholder="Tìm kiếm theo mã số hoặc tên khóa học..."
            className="w-full bg-[#121624] border border-[#2B3454] rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition"
          />
        </div>

        <select
          value={filterRange}
          onChange={(e) => setFilterRange(e.target.value)}
          className="bg-[#121624] border border-[#2B3454] rounded-xl px-4 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#0066FF] cursor-pointer w-full sm:w-[200px] transition"
        >
          <option value="all">Tất cả khóa học</option>
          <option value="newest">Khóa học mới nhất</option>
          <option value="oldest">Khóa học cũ nhất</option>
        </select>
      </div>

      {/* MAIN DATA TABLE CONTAINER */}
      <div className="bg-[#171B2A] border border-[#22283D] rounded-2xl p-5 shadow-sm space-y-3">

        {/* TABLE WRAPPER */}
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px] table-fixed">
            <thead>
              <tr className="text-zinc-400 text-xs font-semibold border-b border-[#22283D]/80 uppercase tracking-wider">
                <th className="pb-3 px-3 w-[10%] font-semibold">Mã số</th>
                <th className="pb-3 px-3 w-[25%] font-semibold">Tên khóa học</th>
                <th className="pb-3 px-3 w-[15%] font-semibold">Giá bán</th>
                <th className="pb-3 px-3 w-[28%] font-semibold">Mô tả chi tiết</th>
                <th className="pb-3 px-3 w-[12%] font-semibold text-center">Ảnh đại diện</th>
                <th className="pb-3 px-3 w-[12%] font-semibold text-center">Ngày tạo</th>
                <th className="pb-3 px-3 w-[10%] font-semibold text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#1F263E]/30 text-[13px]">
              {currentData.map((row) => (
                <tr key={row.id} className="hover:bg-[#1E253A]/40 transition duration-150 group">

                  {/* ID */}
                  <td className="py-3.5 px-3 text-zinc-500 font-mono text-xs truncate">
                    #{row.id.substring(0, 8)}
                  </td>

                  {/* TITLE */}
                  <td className="py-3.5 px-3 font-medium text-zinc-200 truncate" title={row.title}>
                    {row.title}
                  </td>
                  
                  {/* PRICE */}
                  <td className="py-3.5 px-3 font-semibold text-zinc-100">
                    {row.price > 0
                      ? `${row.price.toLocaleString("vi-VN")}đ`
                      : <span className="text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded text-xs">MIỄN PHÍ</span>
                    }
                  </td>
                  
                  {/* DESCRIPTION */}
                  <td className="py-3.5 px-3 text-zinc-400 truncate" title={row.description || ""}>
                    {row.description || <span className="text-zinc-600 italic text-xs">Chưa có mô tả</span>}
                  </td>

                  {/* THUMBNAIL */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex justify-center">
                      {row.thumbnail ? (
                        <img
                          src={row.thumbnail}
                          alt={row.title}
                          className="w-10 h-6 object-cover rounded border border-[#2B3454]/60 bg-[#121624] shadow-sm"
                        />
                      ) : (
                        <span className="text-zinc-600 text-xs italic font-medium">—</span>
                      )}
                    </div>
                  </td>

                  {/* CREATED AT */}
                  <td className="py-3.5 px-3 text-center text-zinc-400 text-xs font-mono">
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString("vi-VN") : "—"}
                  </td>

                  {/* ACTIONS BUTTONS */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center justify-center gap-1.5">

                      {/* Nút Sửa */}
                      <button
                        type="button"
                        onClick={() => handleEdit(row)}
                        title="Sửa"
                        className="p-1.5 rounded-lg bg-[#1C2237] text-zinc-400 hover:bg-[#6366F1] hover:text-white transition focus:outline-none"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>

                      {/* Nút Xóa */}
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        title="Xóa"
                        className="p-1.5 rounded-lg bg-[#1C2237] text-zinc-500 hover:bg-[#FB7185] hover:text-white transition focus:outline-none"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {tableData.length === 0 && (
          <div className="py-12 text-center text-zinc-500 font-medium text-sm">
            Chưa có khóa học nào được đăng tải trên hệ thống.
          </div>
        )}

        {/* PAGINATION PANEL */}
        <div className="flex items-center justify-between pt-4 border-t border-[#22283D] text-xs text-zinc-400 px-1">
          <div>
            Showing <span className="text-white font-medium">{tableData.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, tableData.length)}</span> of <span className="text-white font-medium">{tableData.length}</span> items
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

      {/* ================= MODAL CREATE / UPDATE FORM ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 animate-fadeIn">
          {/* fix-modal-height: Đặt chiều cao tối đa cho modal bằng 85% view màn hình, sắp xếp dạng cột dọc */}
          <div className="bg-[#171B2A] border border-[#2B3454] w-full max-w-md max-h-[85vh] overflow-hidden rounded-2xl flex flex-col shadow-2xl">

            {/* MODAL HEADER (CỐ ĐỊNH) */}
            <div className="flex justify-between items-center p-5 border-b border-[#22283D] bg-[#141929]/50 shrink-0">
              <h2 className="text-base font-bold text-white">
                {editingId ? " Cập nhật thông tin khóa học" : " Tạo khóa học mới"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm transition font-bold"
              >
                ✕
              </button>
            </div>

            {/* MODAL FORM CONTENT (NỘI DUNG TỰ CUỘN KHI QUÁ DÀI) */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 text-xs">

              {/* FIELD: TITLE */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Tên khóa học *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Nhập tiêu đề khóa học..."
                  className="w-full bg-[#121624] border border-[#2B3454] rounded-xl px-3.5 py-2.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition"
                />
              </div>

              {/* FIELD: PRICE (ẨN NÚT LÊN XUỐNG BẰNG LỚP no-spinners) */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Giá khóa học (đ)*</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  placeholder="Nhập giá khóa học (0 nếu miễn phí)..."
                  className="w-full bg-[#121624] border border-[#2B3454] rounded-xl px-3.5 py-2.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition no-spinners"
                />
              </div>

              {/* FIELD: DESCRIPTION */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Mô tả tóm tắt</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Nhập nội dung mô tả chi tiết khóa học ngắn gọn..."
                  rows={3}
                  className="w-full bg-[#121624] border border-[#2B3454] rounded-xl px-3.5 py-2.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition resize-none"
                />
              </div>

              {/* FIELD: FILE UPLOAD */}
              <div className="space-y-2">
                <label className="text-zinc-400 font-bold uppercase tracking-wider text-[10px] block">Hình ảnh thu nhỏ (Thumbnail)</label>

                <div className="relative w-full bg-[#121624] border border-dashed border-[#2B3454] hover:border-[#0066FF] rounded-xl p-4 transition text-center cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-1 text-zinc-400 font-medium">
                    <p className="text-[#0066FF] font-semibold group-hover:underline">Chọn một tập tin ảnh</p>
                    <p className="text-[10px] text-zinc-500">Hỗ trợ định dạng PNG, JPG hoặc WEBP</p>
                  </div>
                </div>

                {/* PREVIEW CONTAINER */}
                {previewUrl && (
                  <div className="pt-2">
                    <p className="text-zinc-500 font-bold uppercase tracking-wider text-[9px] mb-1">Xem trước ảnh đại diện:</p>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-xl border border-[#2B3454]/60 bg-[#121624]"
                    />
                  </div>
                )}
              </div>

              {/* ACTION FOOTER BUTTONS (CỐ ĐỊNH Ở ĐÁY FORM) */}
              <div className="flex justify-end gap-2 pt-4 border-t border-[#22283D] shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold px-4 py-2 rounded-xl transition"
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
        /* CSS XÓA NÚT MŨI TÊN TĂNG GIẢM TRÊN INPUT NUMBER */
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