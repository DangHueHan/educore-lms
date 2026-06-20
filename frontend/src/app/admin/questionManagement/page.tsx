"use client";

import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3001";
const ITEMS_PER_PAGE = 5; // Cấu hình số lượng hàng hiển thị trên mỗi trang

type Course = {
  id: string;
  title: string;
};

type Question = {
  id: string;
  courseId: string;
  question: string;
  explanation?: string;
  createdAt?: string;

  course?: {
    title: string;
  };
};

export default function QuestionPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    courseId: "",
    question: "",
    explanation: "",
  });

  // ==========================================
  // STATE GIỮ NGUYÊN ĐỂ PHỤC VỤ UI KHÔNG BỊ LỖI
  // ==========================================
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchQuestions();
    fetchCourses();
  }, []);

  async function fetchQuestions() {
    try {
      const res = await fetch(`${BASE_URL}/questions`);
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchCourses() {
    try {
      const res = await fetch(`${BASE_URL}/courses`);
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  // ==========================================
  // LOGIC XỬ LÝ PHÂN TRANG CLIENT-SIDE THUẦN TÚY (KHÔNG LỌC)
  // ==========================================
  const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE) || 1;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  
  // Cắt trực tiếp trên mảng gốc ban đầu không qua filter dữ liệu
  const currentData = questions.slice(indexOfFirstItem, indexOfLastItem);

  // ================= OPEN CREATE =================
  function openCreate() {
    setForm({
      courseId: "",
      question: "",
      explanation: "",
    });
    setEditingId(null);
    setOpen(true);
  }

  // ================= OPEN EDIT (AUTO FILL) =================
  function handleEdit(item: Question) {
    setForm({
      courseId: item.courseId,
      question: item.question,
      explanation: item.explanation || "",
    });

    setEditingId(item.id);
    setOpen(true);
  }

  // ================= SUBMIT =================
  async function handleSubmit(e: any) {
    e.preventDefault();

    const url = editingId
      ? `${BASE_URL}/questions/${editingId}`
      : `${BASE_URL}/questions`;

    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("❌ Thất bại");
      return;
    }

    alert(editingId ? "✅ Update success" : "✅ Create success");

    setOpen(false);
    setEditingId(null);
    fetchQuestions();
  }

  // ================= DELETE =================
  async function handleDelete(id: string) {
    if (!confirm("Xóa question?")) return;

    const res = await fetch(`${BASE_URL}/questions/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("❌ Xóa thất bại");
      return;
    }

    alert("🗑️ Deleted");
    fetchQuestions();
  }

  // ================= UI =================
  return (
    <div className="w-full min-h-screen bg-[#121624] text-white font-sans antialiased select-none relative">
      
      {/* MAIN CONTENT CONTAINER */}
      <main className="p-6 space-y-5">
        
        {/* TOP BAR / HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Quản lý Câu hỏi</h2>
            <p className="text-xs text-zinc-400 mt-1">Danh sách hệ thống câu hỏi và lời giải thích thuộc hệ thống Educore</p>
          </div>
          
          <button 
            onClick={openCreate}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition max-w-max active:scale-95 shadow-lg shadow-blue-500/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Thêm Câu hỏi Mới
          </button>
        </div>

        {/* SEARCH & FILTERS CONTROLS (GIỮ NGUYÊN UI) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#171B2A] border border-[#22283D] p-4 rounded-2xl">
          <div className="sm:col-span-8 relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-zinc-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm nội dung câu hỏi..." 
              className="w-full bg-[#121624] border border-[#2B3454] rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition"
            />
          </div>

          <div className="sm:col-span-4">
            <select 
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full bg-[#121624] border border-[#2B3454] rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#0066FF] transition cursor-pointer"
            >
              <option value="">Tất cả Khóa học</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* DATA TABLE BLOCK */}
        <div className="bg-[#171B2A] border border-[#22283D] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="w-full">
            <table className="w-full text-left border-collapse text-[13.5px] table-fixed">
              <thead>
                <tr className="text-zinc-500 border-b border-[#22283D] font-bold">
                  <th className="pb-4 px-3 w-[8%]">ID</th>
                  <th className="pb-4 px-3 w-[20%]">Khóa học</th>
                  <th className="pb-4 px-3 w-[32%]">Nội dung câu hỏi</th>
                  <th className="pb-4 px-3 w-[22%]">Giải thích đáp án</th>
                  <th className="pb-4 px-3 w-[10%]">Ngày tạo</th>
                  <th className="pb-4 px-3 text-center w-[8%]">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F263E]/40 text-zinc-300 font-medium">
                {/* MAP QUA DỮ LIỆU ĐÃ PHÂN TRANG THỰC TẾ currentData */}
                {currentData.map((q, index) => (
                  <tr key={q.id} className="hover:bg-[#1E253A]/30 transition">
                    <td className="py-4 px-3 font-mono text-zinc-400">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="py-4 px-3 text-zinc-300 font-semibold truncate" title={q.course?.title}>
                      {q.course?.title || "-"}
                    </td>
                    <td className="py-4 px-3 text-white font-bold truncate" title={q.question}>
                      {q.question}
                    </td>
                    <td className="py-4 px-3 text-zinc-400 truncate" title={q.explanation}>
                      {q.explanation || "-"}
                    </td>
                    <td className="py-4 px-3 text-zinc-400 text-xs font-mono truncate">
                      {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="py-4 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleEdit(q)}
                          title="Chỉnh sửa"
                          className="p-1.5 rounded-lg bg-[#1C2237] text-zinc-400 hover:bg-[#6366F1] hover:text-white transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(q.id)}
                          title="Xóa câu hỏi"
                          className="p-1.5 rounded-lg bg-[#1C2237] text-zinc-500 hover:bg-[#FB7185] hover:text-white transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {questions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-500 font-medium">
                      Chưa có dữ liệu câu hỏi nào trong hệ thống.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE PAGINATION FOOTER */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#22283D]">
            <p className="text-xs text-zinc-500 font-medium">
              Showing <span className="text-zinc-300 font-semibold">{questions.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, questions.length)}</span> of <span className="text-zinc-300 font-semibold">{questions.length}</span> items
            </p>

            <div className="flex items-center gap-1.5">
              {/* Nút lùi trang */}
              <button 
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-zinc-400 rounded-xl bg-[#121624] border border-[#22283D] transition hover:bg-[#1E253A] disabled:opacity-30 disabled:pointer-events-none"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              {/* Render danh sách số trang động */}
              {Array.from({ length: totalPages }, (_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button 
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                      currentPage === pageNum 
                        ? "bg-[#0066FF] text-white" 
                        : "bg-[#121624] border border-[#22283D] text-zinc-400 hover:bg-[#1C2237] hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Nút tiến trang */}
              <button 
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-zinc-400 rounded-xl bg-[#121624] border border-[#22283D] transition hover:bg-[#1E253A] disabled:opacity-30 disabled:pointer-events-none"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL WINDOW SYSTEM */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#171B2A] border border-[#2B3454] w-full max-w-lg rounded-2xl shadow-2xl p-6 relative mx-4">
            
            <button 
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition text-base"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              📝 {editingId ? "Update Question" : "Create Question"}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">Điền đầy đủ các thông tin bắt buộc để tiến hành lưu trữ nội dung câu hỏi.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* COURSE SELECT */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Select Course</label>
                <select 
                  value={form.courseId}
                  onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                  required
                  className="w-full bg-[#1C2237] border border-[#2B3454] rounded-xl px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-[#0066FF] transition cursor-pointer"
                >
                  <option value="">Chọn Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* INPUT QUESTION */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Question</label>
                <textarea 
                  rows={3}
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="Nhập nội dung câu hỏi..." 
                  required
                  className="w-full bg-[#1C2237] border border-[#2B3454] rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#0066FF] transition resize-none"
                />
              </div>

              {/* INPUT EXPLANATION */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Explanation</label>
                <textarea 
                  rows={3}
                  value={form.explanation}
                  onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                  placeholder="Nhập phần giải thích đáp án..." 
                  className="w-full bg-[#1C2237] border border-[#2B3454] rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#0066FF] transition resize-none"
                />
              </div>

              {/* FORM ACTIONS */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#22283D] mt-6">
                <button 
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white bg-[#22283D] hover:bg-[#2C3450] rounded-xl transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0066FF] hover:bg-[#0052CC] rounded-xl transition shadow-md shadow-blue-500/10"
                >
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}