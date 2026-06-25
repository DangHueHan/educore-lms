"use client";

import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3001";
const ITEMS_PER_PAGE = 5;

export default function RefundManagementPage() {
    const [refunds, setRefunds] = useState<any[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    // ==========================================
    // STATE TÌM KIẾM, LỌC, PHÂN TRANG
    // ==========================================
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // ==========================================
    // STATE ĐIỀU KHIỂN POPUP TỰ DỰNG (CUSTOM DIALOGS)
    // ==========================================
    const [approveModal, setApproveModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
    const [rejectModal, setRejectModal] = useState<{ open: boolean; id: string | null; note: string }>({ open: false, id: null, note: "" });

    // ================= LOAD DATA =================
    useEffect(() => {
        fetchRefunds();
    }, []);

    async function fetchRefunds() {
        try {
            setPageLoading(true);
            const res = await fetch(`${BASE_URL}/refund-request`);
            const data = await res.json();
            setRefunds(Array.isArray(data) ? data : []);
            setCurrentPage(1);
        } catch (err) {
            console.error(err);
        } finally {
            setPageLoading(false);
        }
    }

    // ================= APPROVE ACTION =================
    async function handleApproveConfirm() {
        const id = approveModal.id;
        if (!id) return;

        try {
            setApproveModal({ open: false, id: null }); // Đóng modal ngay
            setActionLoadingId(id);
            const res = await fetch(`${BASE_URL}/refund-request/${id}/approve`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminNote: "Đã duyệt hoàn tiền thành công" }),
            });

            if (res.ok) {
                await fetchRefunds();
            } else {
                alert("❌ Duyệt thất bại"); // Cái này nếu muốn ngon mày làm thêm state toast, tạm thời xử lý backend ổn định trước
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoadingId(null);
        }
    }

    // ================= REJECT ACTION =================
    async function handleRejectSubmit(e: React.FormEvent) {
        e.preventDefault();
        const id = rejectModal.id;
        const note = rejectModal.note.trim();

        if (!id) return;
        if (!note) {
            alert("⚠️ Bạn phải nhập lý do từ chối!");
            return;
        }

        try {
            setRejectModal({ open: false, id: null, note: "" }); // Đóng modal ngay
            setActionLoadingId(id);
            const res = await fetch(`${BASE_URL}/refund-request/${id}/reject`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminNote: note }),
            });

            if (res.ok) {
                await fetchRefunds();
            } else {
                alert("❌ Từ chối thất bại");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoadingId(null);
        }
    }

    // ==========================================
    // XỬ LÝ LỌC & TÌM KIẾM
    // ==========================================
    const filteredData = refunds.filter((item) => {
        const matchesStatus = statusFilter === "ALL" || item.status?.trim().toUpperCase() === statusFilter;
        const name = item.payment?.user?.displayName?.toLowerCase() || "";
        const email = item.payment?.user?.email?.toLowerCase() || "";
        const course = item.payment?.course?.title?.toLowerCase() || "";
        const searchLower = searchTerm.toLowerCase();

        return matchesStatus && (name.includes(searchLower) || email.includes(searchLower) || course.includes(searchLower));
    });

    // Phân trang
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const renderStatus = (status: string) => {
        const formatted = status?.trim().toUpperCase();
        switch (formatted) {
            case "PENDING":
                return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">Chờ duyệt</span>;
            case "APPROVED":
                return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Đã duyệt</span>;
            case "REJECTED":
                return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">Từ chối</span>;
            default:
                return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-zinc-500/10 text-zinc-400">{status}</span>;
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#121624] text-white font-sans antialiased select-none relative">

            <main className="p-6 space-y-5">

                {/* TOP BAR / HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">Quản lý Hoàn Tiền</h2>
                        <p className="text-xs text-zinc-400 mt-1">Danh sách các yêu cầu hoàn trả học phí thuộc hệ thống Educore</p>
                    </div>

                    <button
                        onClick={fetchRefunds}
                        className="bg-[#1C2237] border border-[#2B3454] hover:bg-[#252E4A] text-zinc-300 font-semibold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition max-w-max active:scale-95 shadow-lg"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        Làm mới dữ liệu
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
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            placeholder="Tìm theo tên học viên, email hoặc khóa học..."
                            className="w-full bg-[#121624] border border-[#2B3454] rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition"
                        />
                    </div>

                    <div className="sm:col-span-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                            className="w-full bg-[#121624] border border-[#2B3454] rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#0066FF] transition cursor-pointer"
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="PENDING">Chờ duyệt</option>
                            <option value="APPROVED">Đã duyệt hoàn tiền</option>
                            <option value="REJECTED">Từ chối yêu cầu</option>
                        </select>
                    </div>
                </div>

                {/* DATA TABLE BLOCK */}
                <div className="bg-[#171B2A] border border-[#22283D] rounded-2xl p-5 shadow-sm space-y-4">

                    <div
                        className="w-full overflow-x-auto"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: '#2B3454 #171B2A' }}
                    >
                        <style dangerouslySetInnerHTML={{
                            __html: `
              ::-webkit-scrollbar { height: 6px; }
              ::-webkit-scrollbar-track { background: #171B2A; }
              ::-webkit-scrollbar-thumb { background: #2B3454; border-radius: 99px; }
              ::-webkit-scrollbar-thumb:hover { background: #3b4773; }
            `}} />

                        <table className="w-full text-left border-collapse text-[13.5px] table-fixed min-w-[1100px]">
                            <thead>
                                <tr className="text-zinc-500 border-b border-[#22283D] font-bold">
                                    <th className="pb-4 px-3 w-[7%]">STT</th>
                                    <th className="pb-4 px-3 w-[20%]">Học viên</th>
                                    <th className="pb-4 px-3 w-[20%]">Khóa học</th>
                                    <th className="pb-4 px-3 w-[12%] text-right">Số tiền</th>
                                    <th className="pb-4 px-3 w-[13%]">Giao dịch</th>
                                    <th className="pb-4 px-3 w-[18%]">Lý do hoàn</th>
                                    <th className="pb-4 px-3 text-center w-[12%]">Trạng thái</th>
                                    <th className="pb-4 px-3 w-[15%]">Ghi chú Admin</th>
                                    <th className="pb-4 px-3 text-center w-[15%]">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1F263E]/40 text-zinc-300 font-medium">
                                {pageLoading ? (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center text-zinc-400">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="w-7 h-7 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-xs">Đang tải dữ liệu hoàn tiền...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : currentData.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center text-zinc-500 font-medium">
                                            Không tìm thấy dữ liệu hoàn tiền nào phù hợp.
                                        </td>
                                    </tr>
                                ) : (
                                    currentData.map((item, index) => {
                                        const isItemLoading = actionLoadingId === item.id;
                                        const isPending = item.status?.trim().toUpperCase() === "PENDING";

                                        return (
                                            <tr key={item.id} className="hover:bg-[#1E253A]/30 transition">
                                                <td className="py-4 px-3 font-mono text-zinc-400">{indexOfFirstItem + index + 1}</td>
                                                <td className="py-4 px-3 truncate" title={item.payment?.user?.displayName}>
                                                    <p className="font-bold text-zinc-200">{item.payment?.user?.displayName || "N/A"}</p>
                                                    <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{item.payment?.user?.email}</p>
                                                </td>
                                                <td className="py-4 px-3 text-zinc-300 font-semibold truncate" title={item.payment?.course?.title}>
                                                    {item.payment?.course?.title || "-"}
                                                </td>
                                                <td className="py-4 px-3 text-right font-black text-emerald-400 whitespace-nowrap">
                                                    {item.payment?.amount ? item.payment.amount.toLocaleString() : "0"}đ
                                                </td>
                                                <td className="py-4 px-3 truncate">
                                                    <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded bg-[#121624] text-zinc-400 border border-[#22283D]">
                                                        {item.payment?.method || "N/A"}
                                                    </span>
                                                    <p className="text-[11px] font-mono text-zinc-500 mt-1 truncate" title={item.payment?.transactionNo}>
                                                        {item.payment?.transactionNo || "-"}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-3 text-zinc-400 italic text-xs truncate" title={item.reason}>{item.reason}</td>
                                                <td className="py-4 px-3 text-center whitespace-nowrap">{renderStatus(item.status)}</td>
                                                <td className="py-4 px-3 text-zinc-400 text-xs truncate" title={item.adminNote}>
                                                    {item.adminNote ?? <span className="text-zinc-600">-</span>}
                                                </td>
                                                {/* Thao tác xử lý đồng bộ màu Solid, cùng size chữ, không lệch dòng */}
                                                <td className="py-4 px-3 text-center whitespace-nowrap">
                                                    {isPending ? (
                                                        <div className="flex items-center justify-center gap-2 flex-nowrap">
                                                            {isItemLoading ? (
                                                                <div className="flex items-center gap-1.5 text-xs text-blue-400 font-bold">
                                                                    <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                                                    Xử lý...
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setApproveModal({ open: true, id: item.id })}
                                                                        disabled={actionLoadingId !== null}
                                                                        className="px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-md active:scale-95 disabled:opacity-40 whitespace-nowrap"
                                                                    >
                                                                        Duyệt
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setRejectModal({ open: true, id: item.id, note: "" })}
                                                                        disabled={actionLoadingId !== null}
                                                                        className="px-3 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition shadow-md active:scale-95 disabled:opacity-40 whitespace-nowrap"
                                                                    >
                                                                        Từ chối
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs font-bold text-zinc-500 flex items-center justify-center gap-1">
                                                            <svg className="w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                            </svg>
                                                            Xử lý xong
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* TABLE PAGINATION FOOTER */}
                    {!pageLoading && filteredData.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#22283D]">
                            <p className="text-xs text-zinc-500 font-medium">
                                Hiển thị <span className="text-zinc-300 font-semibold">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)}</span> trong tổng số <span className="text-blue-400 font-semibold">{filteredData.length}</span> yêu cầu
                            </p>

                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 text-zinc-400 rounded-xl bg-[#121624] border border-[#22283D] transition hover:bg-[#1E253A] disabled:opacity-30 disabled:pointer-events-none"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>

                                {Array.from({ length: totalPages }, (_, idx) => {
                                    const pageNum = idx + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-8 h-8 rounded-xl text-xs font-bold transition ${currentPage === pageNum ? "bg-[#0066FF] text-white" : "bg-[#121624] border border-[#22283D] text-zinc-400 hover:bg-[#1C2237] hover:text-white"
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

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
                    )}
                </div>
            </main>

            {/* ==========================================
          1. MODAL XÁC NHẬN DUYỆT (CUSTOM CONFIRM)
          ========================================== */}
            {approveModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#171B2A] border border-[#2B3454] w-full max-w-md rounded-2xl shadow-2xl p-6 relative mx-4 animate-in fade-in zoom-in-95 duration-150">
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            🟢 Xác nhận duyệt hoàn tiền
                        </h3>
                        <p className="text-xs text-zinc-400 mb-6">Bạn có chắc chắn muốn phê duyệt yêu cầu này? Tiền sẽ được ghi nhận hoàn trả cho học viên hệ thống.</p>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#22283D]">
                            <button
                                type="button"
                                onClick={() => setApproveModal({ open: false, id: null })}
                                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white bg-[#22283D] hover:bg-[#2C3450] rounded-xl transition"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                onClick={handleApproveConfirm}
                                className="px-4 py-2 text-xs font-bold text-black bg-emerald-500 hover:bg-emerald-600 rounded-xl transition shadow-md"
                            >
                                Đồng ý Duyệt
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================
          2. MODAL NHẬP LÝ DO TỪ CHỐI (CUSTOM PROMPT)
          ========================================== */}
            {rejectModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#171B2A] border border-[#2B3454] w-full max-w-md rounded-2xl shadow-2xl p-6 relative mx-4 animate-in fade-in zoom-in-95 duration-150">
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            🔴 Từ chối yêu cầu hoàn tiền
                        </h3>
                        <p className="text-xs text-zinc-400 mb-4">Vui lòng nhập lý do cụ thể để phản hồi lại cho học viên được biết.</p>

                        <form onSubmit={handleRejectSubmit} className="space-y-4">
                            <div>
                                <textarea
                                    rows={3}
                                    value={rejectModal.note}
                                    onChange={(e) => setRejectModal({ ...rejectModal, note: e.target.value })}
                                    placeholder="Ví dụ: Tài khoản đã kích hoạt học quá 50% thời lượng khóa học..."
                                    required
                                    className="w-full bg-[#1C2237] border border-[#2B3454] rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-rose-500 transition resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#22283D]">
                                <button
                                    type="button"
                                    onClick={() => setRejectModal({ open: false, id: null, note: "" })}
                                    className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white bg-[#22283D] hover:bg-[#2C3450] rounded-xl transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition shadow-md"
                                >
                                    Gửi từ chối
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}