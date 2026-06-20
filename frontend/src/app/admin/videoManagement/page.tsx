"use client";

import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3001";
const ITEMS_PER_PAGE = 5; // Số lượng bài học trên mỗi trang

type Course = {
  id: string;
  title: string;
};

type Lesson = {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  durationSeconds: number;
  courseId: string;
  createdAt?: string;

  course?: {
    title: string;
  };
};

export default function LessonPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // STATE PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    durationSeconds: 0,
    courseId: "",
  });

  const [videoFile, setVideoFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  // LOAD DATA
  useEffect(() => {
    fetchLessons();
    fetchCourses();
  }, []);

  async function fetchLessons() {
    const res = await fetch(`${BASE_URL}/lessons`);
    const data = await res.json();
    setLessons(Array.isArray(data) ? data : []);
    setCurrentPage(1); // Reset về trang 1 khi load data mới
  }

  async function fetchCourses() {
    const res = await fetch(`${BASE_URL}/courses`);
    const data = await res.json();
    setCourses(Array.isArray(data) ? data : []);
  }

  // LOGIC PHÂN TRANG DỰA TRÊN STATE LESSONS
  const totalPages = Math.ceil(lessons.length / ITEMS_PER_PAGE) || 1;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentLessons = lessons.slice(indexOfFirstItem, indexOfLastItem);

  // OPEN CREATE
  function openCreate() {
    setForm({
      title: "",
      description: "",
      videoUrl: "",
      durationSeconds: 0,
      courseId: "",
    });
    setVideoFile(null); // Reset file khi tạo mới
    setEditingId(null);
    setOpen(true);
  }

  // OPEN EDIT + AUTO FILL
  function handleEdit(item: Lesson) {
    setForm({
      title: item.title,
      description: item.description || "",
      videoUrl: item.videoUrl,
      durationSeconds: item.durationSeconds,
      courseId: item.courseId,
    });
    setVideoFile(null); // Reset file cũ đi
    setEditingId(item.id);
    setOpen(true);
  }

  // SUBMIT
  async function handleSubmit(e: any) {
    e.preventDefault();

    let videoUrl = form.videoUrl;

    // upload video lên cloudinary
    if (videoFile) {
      setUploading(true);

      const data = new FormData();

      data.append("file", videoFile);

      const uploadRes = await fetch(
        `${BASE_URL}/upload/video`,
        {
          method: "POST",
          body: data,
        }
      );

      const uploadData =
        await uploadRes.json();

      videoUrl = uploadData.url;

      setUploading(false);
    }

    const url = editingId
      ? `${BASE_URL}/lessons/${editingId}`
      : `${BASE_URL}/lessons`;

    const method =
      editingId ? "PATCH" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        ...form,
        videoUrl,
      }),
    });

    alert(
      editingId
        ? "Update success"
        : "Create success"
    );

    setOpen(false);
    setEditingId(null);

    fetchLessons();
  }

  // DELETE
  async function handleDelete(id: string) {
    if (!confirm("Xóa lesson?")) return;

    await fetch(`${BASE_URL}/lessons/${id}`, {
      method: "DELETE",
    });

    alert("Deleted");
    fetchLessons();
  }

  return (
    <div className="w-full min-h-screen bg-[#121624] text-white font-sans antialiased select-none relative">

      {/* STYLE CHỮA CHÁY CHO THANH CUỘN (Tự động tiệp màu nền cực mượt) */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #171B2A;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2B3454;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0066FF;
        }
      `}</style>

      {/* MAIN CONTENT CONTAINER */}
      <main className="p-6 space-y-5">

        {/* TOP BAR / HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Quản lý Video</h2>
            <p className="text-xs text-zinc-400 mt-1">Danh sách thông tin các Video chi tiết thuộc hệ thống Educore</p>
          </div>

          <button
            onClick={openCreate}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition max-w-max active:scale-95 shadow-lg shadow-blue-500/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Thêm Bài học Mới
          </button>
        </div>

        {/* SEARCH & FILTERS CONTROLS */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#171B2A] border border-[#22283D] p-4 rounded-2xl">
          <div className="sm:col-span-8 relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-zinc-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề bài học..."
              className="w-full bg-[#121624] border border-[#2B3454] rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition"
            />
          </div>

          <div className="sm:col-span-4">
            <select className="w-full bg-[#121624] border border-[#2B3454] rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#0066FF] transition cursor-pointer">
              <option value="">Tất cả Khóa học</option>
            </select>
          </div>
        </div>

        {/* DATA TABLE BLOCK */}
        <div className="bg-[#171B2A] border border-[#22283D] rounded-2xl p-5 shadow-sm space-y-4">

          {/* Div bọc chứa class custom-scrollbar mượt mà */}
          <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
            <table className="w-full text-left border-collapse text-[13.5px] table-auto">
              <thead>
                <tr className="text-zinc-500 border-b border-[#22283D] font-bold whitespace-nowrap">
                  <th className="pb-4 px-3 min-w-[90px] w-[10%]">ID</th>
                  <th className="pb-4 px-3 min-w-[150px] w-[20%]">Khóa học</th>
                  <th className="pb-4 px-3 min-w-[200px] w-[25%]">Tên bài học</th>
                  <th className="pb-4 px-3 min-w-[220px] w-[25%]">Mô tả bài học</th>
                  <th className="pb-4 px-3 min-w-[80px] w-[8%]">Video</th>
                  <th className="pb-4 px-3 min-w-[100px] w-[10%]">Thời lượng</th>
                  <th className="pb-4 px-3 min-w-[100px] w-[12%]">Ngày tạo</th>
                  <th className="pb-4 px-3 text-center min-w-[90px] w-[8%]">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F263E]/40 text-zinc-300 font-medium">
                {currentLessons.map((l) => (
                  <tr key={l.id} className="hover:bg-[#1E253A]/30 transition group">
                    <td className="py-3.5 px-3 font-mono text-zinc-500 text-xs truncate max-w-[90px]" title={l.id}>
                      {l.id}
                    </td>
                    <td className="py-3.5 px-3 text-zinc-300 font-semibold truncate max-w-[150px]" title={l.course?.title}>
                      {l.course?.title || "-"}
                    </td>
                    <td className="py-3.5 px-3 text-white font-bold truncate max-w-[200px]" title={l.title}>
                      {l.title}
                    </td>
                    <td className="py-3.5 px-3 text-zinc-400 truncate max-w-[220px]" title={l.description}>
                      {l.description || "-"}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <a
                        href={l.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0066FF] hover:text-blue-400 font-semibold inline-flex items-center gap-1 text-xs bg-blue-500/5 px-2.5 py-1 rounded-lg border border-blue-500/10 hover:border-blue-500/30 transition"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        Watch
                      </a>
                    </td>

                    <td className="py-3.5 px-3 text-zinc-300 whitespace-nowrap">
                      <span className="bg-zinc-800/40 text-zinc-300 px-2 py-1 rounded-md text-xs border border-zinc-700/30">
                        {Math.floor(l.durationSeconds / 60)} phút
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-zinc-400 text-xs font-mono whitespace-nowrap">
                      {l.createdAt ? new Date(l.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(l)}
                          title="Chỉnh sửa"
                          className="p-1.5 rounded-lg bg-[#1C2237] text-zinc-400 hover:bg-[#6366F1] hover:text-white border border-transparent hover:border-indigo-400/20 transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(l.id)}
                          title="Xóa bài học"
                          className="p-1.5 rounded-lg bg-[#1C2237] text-zinc-500 hover:bg-[#FB7185] hover:text-white border border-transparent hover:border-rose-400/20 transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {lessons.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-zinc-500 font-medium">
                      Chưa có dữ liệu bài học nào trong hệ thống.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE PAGINATION FOOTER - ĐÃ LẮP LOGIC CHẠY ĐƯỢC */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#22283D]">
            <p className="text-xs text-zinc-500 font-medium">
              Showing <span className="text-zinc-300 font-semibold">{lessons.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, lessons.length)}</span> of <span className="text-zinc-300 font-semibold">{lessons.length}</span> items
            </p>

            <div className="flex items-center gap-1.5">
              {/* Nút Previous */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-xl bg-[#121624] border border-[#22283D] transition ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#1C2237] text-zinc-300'}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              {/* Danh sách các số trang */}
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition ${currentPage === pageNumber
                      ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/20"
                      : "bg-[#121624] border border-[#22283D] text-zinc-400 hover:bg-[#1C2237] hover:text-white"
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {/* Nút Next */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-xl bg-[#121624] border border-[#22283D] transition ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#1C2237] text-zinc-300'}`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#171B2A] border border-[#2B3454] w-full max-w-lg rounded-2xl shadow-2xl p-6 relative my-auto">

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition text-base"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              {editingId ? "Update Lesson" : "Create Lesson"}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">Điền đầy đủ các thông tin bắt buộc để tiến hành lưu trữ dữ liệu bài học.</p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* INPUT TITLE */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Nhập tiêu đề bài học..."
                  required
                  className="w-full bg-[#1C2237] border border-[#2B3454] rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#0066FF] transition"
                />
              </div>

              {/* INPUT DESCRIPTION */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Mô tả tóm tắt nội dung bài học..."
                  className="w-full bg-[#1C2237] border border-[#2B3454] rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#0066FF] transition resize-none"
                />
              </div>

              {/* INPUT VIDEO FILE (ĐÃ ĐƯỢC LÀM ĐẸP HOÀN TOÀN) */}
              {/* <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Video File</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setVideoFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`w-full bg-[#1C2237] border-2 border-dashed ${videoFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-[#2B3454] group-hover:border-[#0066FF]'} rounded-xl px-4 py-5 text-center flex flex-col items-center justify-center gap-2 transition-all duration-200`}>
                    
                    {videoFile ? (
                      // Trạng thái đã chọn File thành công
                      <>
                        <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="text-xs font-semibold text-zinc-200 truncate max-w-[320px]">
                          {videoFile.name}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          Thao tác lại nếu muốn thay đổi file khác
                        </div>
                      </>
                    ) : (
                      // Trạng thái trống chưa chọn file
                      <>
                        <div className="p-2.5 bg-[#121624] text-zinc-400 group-hover:text-[#0066FF] group-hover:bg-blue-500/5 rounded-xl transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16a4 4 0 100-8 4 4 0 000 8z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                          </svg>
                        </div>
                        <div className="text-xs text-zinc-300 font-semibold">
                          <span className="text-[#0066FF] hover:underline">Click to upload video</span> hoặc kéo thả vào đây
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          Hỗ trợ định dạng MP4, MOV, WebM...
                        </div>
                      </>
                    )}

                  </div>
                </div>
               
                {editingId && form.videoUrl && !videoFile && (
                  <p className="text-[11px] text-zinc-500 mt-1.5 truncate max-w-full">
                    <span className="font-semibold text-zinc-400">URL hiện tại:</span> {form.videoUrl}
                  </p>
                )}
              </div> */}
             <div>
  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 ml-1">
    Video Content
  </label>

  <div className="relative group">
    {/* Input ẩn để xử lý file */}
    <input
      type="file"
      accept="video/*"
      onChange={(e) => {
        if (e.target.files?.[0]) {
          setVideoFile(e.target.files[0]);
        }
      }}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
    />

    {/* UI Box chính */}
    <div
      className={`relative w-full min-h-[140px] rounded-2xl border-2 border-dashed transition-all duration-500 overflow-hidden flex flex-col items-center justify-center p-6
      ${
        videoFile
          ? "border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
          : editingId && form.videoUrl
          ? "border-blue-500/50 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.05)]"
          : "border-[#2B3454] bg-[#121624] group-hover:border-blue-500 group-hover:shadow-[0_0_25px_rgba(0,102,255,0.1)]"
      }`}
    >
      {/* Hiệu ứng Background Glow trang trí */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-[50px] pointer-events-none group-hover:bg-blue-500/20 transition-all"></div>
      
      {videoFile ? (
        /* ========================================================
           TRẠNG THÁI 1: FILE MỚI ĐÃ ĐƯỢC CHỌN (READY TO UPLOAD)
           ======================================================== */
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
          <div className="relative mb-3">
            <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-[#171B2A] flex items-center justify-center">
               <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
          
          <h4 className="text-sm font-bold text-white mb-1">File chuẩn bị tải lên</h4>
          <p className="text-[11px] text-emerald-400 font-medium mb-2 bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/20">
            {videoFile.name}
          </p>
          <p className="text-[10px] text-zinc-500 italic">Nhấp hoặc kéo thả để thay đổi file khác</p>
        </div>
      ) : editingId && form.videoUrl ? (
        /* ========================================================
           TRẠNG THÁI 2: ĐANG CÓ VIDEO CŨ TRÊN CLOUD (LIVE)
           ======================================================== */
        <div className="flex flex-col items-center w-full px-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-4 w-full bg-[#171B2A]/80 border border-blue-500/20 p-3 rounded-xl backdrop-blur-md">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-400/10 px-1.5 py-0.5 rounded">Existing Source</span>
              </div>
              <p className="text-xs text-zinc-300 font-mono truncate tracking-tight">{form.videoUrl}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] text-zinc-400 font-medium">Thả file mới vào đây để cập nhật video</p>
          </div>
        </div>
      ) : (
        /* ========================================================
           TRẠNG THÁI 3: TRỐNG (CREATE NEW)
           ======================================================== */
        <div className="flex flex-col items-center group-hover:scale-105 transition-transform duration-300">
          <div className="p-4 bg-zinc-800/50 text-zinc-500 group-hover:bg-blue-500/10 group-hover:text-blue-500 rounded-2xl border border-zinc-700/50 group-hover:border-blue-500/30 transition-all mb-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="text-center">
             <p className="text-xs font-bold text-zinc-200 mb-1">Upload Lesson Video</p>
             <p className="text-[10px] text-zinc-500 max-w-[200px]">Click hoặc kéo thả file MP4, MOV để bắt đầu</p>
          </div>
        </div>
      )}
    </div>
  </div>
</div>

              {/* INPUT DURATION */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Duration
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min={1}
                    value={
                      form.durationSeconds
                        ? Math.floor(form.durationSeconds / 60)
                        : ""
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        durationSeconds:
                          Number(e.target.value) * 60,
                      })
                    }
                    placeholder="Nhập số lượng thời lượng"
                    required
                    className="w-full bg-[#1C2237] border border-[#2B3454] rounded-xl pl-4 pr-16 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#0066FF] transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <div className="absolute right-3 text-xs font-semibold text-zinc-400 bg-[#121624] px-2.5 py-1 rounded-md border border-[#2B3454] pointer-events-none">
                    phút
                  </div>
                </div>
              </div>

              {/* COURSE SELECT */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Select Course</label>
                <select
                  value={form.courseId}
                  onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                  className="w-full bg-[#1C2237] border border-[#2B3454] rounded-xl px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-[#0066FF] transition cursor-pointer"
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* FORM ACTIONS (ĐÃ ĐƯỢC LÀM ĐẸP NÚT UPLOADING) */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#22283D] mt-6">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white bg-[#22283D] hover:bg-[#2C3450] rounded-xl transition ${uploading ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition shadow-md flex items-center gap-2 ${uploading
                      ? "bg-blue-600/60 text-zinc-300 cursor-not-allowed"
                      : "bg-[#0066FF] hover:bg-[#0052CC] shadow-blue-500/10 active:scale-95"
                    }`}
                >
                  {uploading ? (
                    <>
                      {/* Hiệu ứng xoay tròn loading CSS */}
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}