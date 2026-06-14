"use client";

import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3001";

/* ================= TYPES ================= */
type Course = {
  id: string;
  title: string;
};

type Question = {
  id: string;
  courseId: string;
  question: string;
};

type Answer = {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
  createdAt?: string;
};

/* ================= COMPONENT ================= */
export default function QuestionAnswerPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  /* ANSWER FORM */
  const [aForm, setAForm] = useState({
    text: "",
    isCorrect: false,
  });

  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);

  /* ================= LOAD ================= */
  useEffect(() => {
    fetchQuestions();
    fetchCourses();
    fetchAnswers();
  }, []);

  async function fetchQuestions() {
    const res = await fetch(`${BASE_URL}/questions`);
    setQuestions(await res.json());
  }

  async function fetchCourses() {
    const res = await fetch(`${BASE_URL}/courses`);
    setCourses(await res.json());
  }

  async function fetchAnswers() {
    const res = await fetch(`${BASE_URL}/answers`);
    setAnswers(await res.json());
  }

  /* ================= FILTER ANSWERS ================= */
  const filteredAnswers = answers.filter(
    (a) => a.questionId === selectedQuestionId
  );

  /* ================= ANSWER CRUD ================= */
  function openCreateAnswer() {
    setAForm({ text: "", isCorrect: false });
    setEditingAnswerId(null);
  }

  function handleEditAnswer(a: Answer) {
    setAForm({
      text: a.text,
      isCorrect: a.isCorrect,
    });

    setEditingAnswerId(a.id);
  }

  async function handleSaveAnswer(e: any) {
    e.preventDefault();

    if (!selectedQuestionId) return;

    const url = editingAnswerId
      ? `${BASE_URL}/answers/${editingAnswerId}`
      : `${BASE_URL}/answers`;

    const method = editingAnswerId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...aForm,
        questionId: selectedQuestionId,
      }),
    });

    if (!res.ok) {
      alert("❌ Error");
      return;
    }

    alert(editingAnswerId ? "✅ Update success" : "✅ Create success");

    setAForm({ text: "", isCorrect: false });
    setEditingAnswerId(null);
    fetchAnswers();
  }

  async function handleDeleteAnswer(id: string) {
    const ok = confirm("Delete answer?");
    if (!ok) return;

    const res = await fetch(`${BASE_URL}/answers/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("❌ Delete failed");
      return;
    }

    alert("🗑️ Deleted successfully");
    fetchAnswers();
  }

  /* ================= UI ================= */
  return (
    <div className="flex h-screen w-full bg-[#121624] text-white font-sans antialiased select-none overflow-hidden">
      
      {/* ================= LEFT: QUESTIONS (WITH SMOOTH SCROLLBAR) ================= */}
      <div className="w-1/2 border-r border-[#22283D] bg-[#141929]/50 p-6 flex flex-col h-full">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            ❓ Ngân hàng Câu hỏi
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Chọn một câu hỏi bên dưới để cấu hình danh sách đáp án</p>
        </div>

        {/* Vùng chứa danh sách kèm thanh trượt mượt mà */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-2.5 custom-scrollbar">
          {questions.map((q) => {
            const isSelected = selectedQuestionId === q.id;
            return (
              <div
                key={q.id}
                onClick={() => setSelectedQuestionId(q.id)}
                className={`p-4 rounded-xl border transition cursor-pointer text-sm font-medium relative group ${
                  isSelected
                    ? "bg-[#0066FF] border-[#0066FF] text-white shadow-lg shadow-blue-500/10 font-semibold"
                    : "bg-[#171B2A] border-[#22283D] text-zinc-300 hover:border-[#2B3454] hover:bg-[#1C2237]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                    isSelected ? "bg-white/20 text-white" : "bg-[#1C2237] text-zinc-400 group-hover:bg-[#22283D]"
                  }`}>
                    Q
                  </span>
                  <p className="flex-1 leading-relaxed break-words line-clamp-2" title={q.question}>
                    {q.question}
                  </p>
                </div>
              </div>
            );
          })}
          {questions.length === 0 && (
            <p className="text-xs text-zinc-500 text-center py-8">Chưa có câu hỏi nào được tạo.</p>
          )}
        </div>
      </div>

      {/* ================= RIGHT: ANSWERS SYSTEM ================= */}
      <div className="w-1/2 p-6 flex flex-col h-full overflow-y-auto">
        {!selectedQuestionId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#171B2A] border border-[#22283D] flex items-center justify-center text-zinc-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-300">Chưa chọn câu hỏi</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs">Vui lòng chọn một nội dung câu hỏi ở danh sách bên trái để quản lý các đáp án lựa chọn.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                ✨ Thiết lập đáp án
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">Thêm, sửa hoặc xóa các phương án lựa chọn cho câu hỏi hiện tại</p>
            </div>

            {/* FORM INPUT BLOCK */}
            <form onSubmit={handleSaveAnswer} className="bg-[#171B2A] border border-[#22283D] p-4 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-end gap-3">
                
                {/* TEXT INPUT FIELD */}
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Nội dung đáp án</label>
                  <input
                    type="text"
                    value={aForm.text}
                    onChange={(e) => setAForm({ ...aForm, text: e.target.value })}
                    placeholder="Nhập nội dung câu trả lời..."
                    required
                    className="w-full bg-[#121624] border border-[#2B3454] rounded-xl px-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition"
                  />
                </div>

                {/* IS CORRECT CHECKBOX FIELD */}
                <div className="mb-1 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer bg-[#121624] border border-[#2B3454] hover:border-zinc-600 px-4 py-2 rounded-xl transition text-xs font-semibold text-zinc-300 select-none">
                    <input
                      type="checkbox"
                      checked={aForm.isCorrect}
                      onChange={(e) => setAForm({ ...aForm, isCorrect: e.target.checked })}
                      className="w-4 h-4 rounded text-[#0066FF] bg-black border-[#2B3454] focus:ring-0 cursor-pointer"
                    />
                    Đáp án đúng
                  </label>
                </div>

                {/* SUBMIT ACTION BUTTON */}
                <button 
                  type="submit"
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition active:scale-95 shadow-lg shadow-blue-500/10 min-w-[90px] mb-0.5 h-[38px] shrink-0"
                >
                  {editingAnswerId ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>

            {/* LIST RESPONSIVE CONTAINER */}
            <div className="bg-[#171B2A] border border-[#22283D] rounded-2xl p-5 shadow-sm space-y-3">
              {/* Header dòng sử dụng tỉ lệ phần trăm nghiêm ngặt */}
              <div className="flex items-center text-zinc-500 text-[13px] font-bold pb-3 border-b border-[#22283D] px-2">
                <div className="w-[40%]">Text</div>
                <div className="w-[22%]">Status</div>
                <div className="w-[23%]">Created At</div>
                <div className="w-[15%] text-center">Action</div>
              </div>

              {/* Body nội dung lặp các đáp án */}
              <div className="divide-y divide-[#1F263E]/40 text-[13.5px]">
                {filteredAnswers.map((a) => (
                  <div key={a.id} className="flex items-center py-3.5 hover:bg-[#1E253A]/30 transition px-2 rounded-xl">
                    
                    {/* Ô Nội dung câu trả lời - Tự động thêm dấu ... nếu quá dài */}
                    <div className="w-[40%] text-white font-semibold pr-3 truncate" title={a.text}>
                      {a.text}
                    </div>

                    {/* Ô Trạng thái đúng/sai */}
                    <div className="w-[22%] shrink-0">
                      {a.isCorrect ? (
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Correct
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                          Incorrect
                        </span>
                      )}
                    </div>

                    {/* Ô Ngày tạo lập - Đảm bảo kích thước tối đa và thêm dấu ... chống tràn chữ */}
                    <div className="w-[23%] text-zinc-400 text-xs font-mono shrink-0 pr-2 truncate" title={a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "-"}>
                      {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "-"}
                    </div>

                    {/* Ô Hành động tương tác */}
                    <div className="w-[15%] text-center shrink-0">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditAnswer(a)}
                          className="text-xs text-amber-400 font-semibold hover:underline"
                        >
                          Edit
                        </button>
                        <span className="text-zinc-700">|</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteAnswer(a.id)}
                          className="text-xs text-rose-400 font-semibold hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                  </div>
                ))}

                {filteredAnswers.length === 0 && (
                  <div className="py-8 text-center text-zinc-500 font-medium text-xs">
                    Chưa thiết lập đáp án nào cho câu hỏi này.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* STYLES FOR HIDDEN CUSTOM SCROLLBAR */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
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
      `}</style>

    </div>
  );
}