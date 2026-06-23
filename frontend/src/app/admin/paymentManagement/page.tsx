"use client";

import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3001";
const ITEMS_PER_PAGE = 7;

type Payment = {
  id: string;
  userId: string;
  courseId: string;
  originalAmount: number;
  discountAmount: number;
  amount: number;
  method: string | null;
  status: string;
  transactionNo: string | null;
  couponCode: string | null;
  paidAt: string | null;
  createdAt: string;
  user: {
    id: string;
    displayName: string | null;
    email: string;
  };
  course: {
    id: string;
    title: string;
    price: number;
  };
};

export default function PaymentManagementPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      const res = await fetch(`${BASE_URL}/payment-management`);
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleMethodFilterChange = (value: string) => {
    setMethodFilter(value);
    setCurrentPage(1);
  };

  const filteredPayments = payments.filter((payment) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      payment.user.displayName?.toLowerCase().includes(keyword) ||
      payment.user.email.toLowerCase().includes(keyword) ||
      payment.course.title.toLowerCase().includes(keyword) ||
      payment.transactionNo?.toLowerCase().includes(keyword) ||
      payment.couponCode?.toLowerCase().includes(keyword) ||
      payment.id.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === "ALL" || 
      payment.status.toUpperCase() === statusFilter.toUpperCase();

    const matchesMethod =
      methodFilter === "ALL" ||
      (payment.method && payment.method.toUpperCase() === methodFilter.toUpperCase());

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE) || 1;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentData = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

  const renderStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "SUCCESS" || s === "COMPLETED" || s === "PAID") {
      return (
        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg text-xs uppercase tracking-wider whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Thành công
        </span>
      );
    }
    if (s === "PENDING" || s === "PROCESSING") {
      return (
        <span className="inline-flex items-center gap-1.5 text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg text-xs uppercase tracking-wider whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          Đang chờ
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-rose-400 font-semibold bg-rose-500/10 px-2.5 py-1 rounded-lg text-xs uppercase tracking-wider whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
        Thất bại
      </span>
    );
  };

  return (
    <div className="p-6 bg-[#121624] min-h-screen text-white font-sans antialiased select-none custom-scrollbar overflow-y-auto">
      {/* TIÊU ĐỀ TRANG */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">Quản lý Thanh toán</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Theo dõi, tra cứu lịch sử giao dịch hóa đơn và trạng thái dòng tiền hệ thống Educore
        </p>
      </div>

      {/* THANH BỘ LỌC */}
      <div className="bg-[#171B2A]/60 border border-[#22283D] p-4 rounded-2xl flex flex-col lg:flex-row gap-3 mb-5 items-center">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm theo Tên, Email, Khóa học, Mã giao dịch, Mã giảm giá..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-[#121624] border border-[#2B3454] rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#0066FF] transition"
          />
        </div>

        <div className="w-full lg:w-[200px]">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="bg-[#121624] border border-[#2B3454] rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-[#0066FF] cursor-pointer w-full transition"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="SUCCESS">Thành công</option>
            <option value="PENDING">Đang chờ thanh toán</option>
            <option value="FAILED">Thất bại / Đã hủy</option>
          </select>
        </div>

        <div className="w-full lg:w-[200px]">
          <select
            value={methodFilter}
            onChange={(e) => handleMethodFilterChange(e.target.value)}
            className="bg-[#121624] border border-[#2B3454] rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-[#0066FF] cursor-pointer w-full transition"
          >
            <option value="ALL">Mọi phương thức</option>
            <option value="MOMO">Ví MoMo</option>
            <option value="VNPAY">Cổng VNPAY</option>
            <option value="STRIPE">Thẻ quốc tế (Stripe)</option>
            <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
          </select>
        </div>
      </div>

      {/* BẢNG CHỨA DỮ LIỆU */}
      <div className="bg-[#171B2A] border border-[#22283D] rounded-2xl p-5 shadow-sm space-y-3">
        {loading ? (
          <div className="space-y-4 py-6 animate-pulse">
            <div className="h-4 bg-[#22283D] rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-10 bg-[#1E253A]/60 rounded-xl"></div>
              <div className="h-10 bg-[#1E253A]/40 rounded-xl"></div>
              <div className="h-10 bg-[#1E253A]/20 rounded-xl"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto w-full custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1400px] table-fixed">
                <thead>
                  <tr className="text-zinc-400 text-xs font-semibold border-b border-[#22283D]/80 uppercase tracking-wider whitespace-nowrap">
                    <th className="pb-3 px-4 w-[8%]">Mã Đơn</th>
                    <th className="pb-3 px-4 w-[18%]">Học Viên</th>
                    <th className="pb-3 px-4 w-[20%]">Khóa Học</th>
                    <th className="pb-3 px-4 w-[10%] text-right">Giá Gốc</th>
                    <th className="pb-3 px-4 w-[9%] text-right">Giảm Giá</th>
                    <th className="pb-3 px-4 w-[11%] text-right">Thành Tiền</th>
                    <th className="pb-3 px-4 w-[10%] text-center">Mã Giảm</th>
                    <th className="pb-3 px-4 w-[10%] text-center">Hình Thức</th>
                    <th className="pb-3 px-4 w-[12%] text-center">Trạng Thái</th>
                    <th className="pb-3 px-4 w-[14%] text-center">Mã Giao Dịch</th>
                    <th className="pb-3 px-4 w-[13%] text-center">Ngày Khởi Tạo</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#1F263E]/30 text-[13px]">
                  {currentData.map((payment) => (
                    <tr key={payment.id} className="hover:bg-[#1E253A]/40 transition duration-150">
                      {/* ID ĐƠN */}
                      <td className="py-4 px-4 text-zinc-500 font-mono text-xs truncate" title={payment.id}>
                        #{payment.id.substring(0, 7)}
                      </td>

                      {/* USER (Thêm truncate dấu ba chấm) */}
                      <td className="py-4 px-4 truncate" title={`${payment.user.displayName || "Ẩn danh"} (${payment.user.email})`}>
                        <div className="font-semibold text-zinc-200 truncate whitespace-nowrap">
                          {payment.user.displayName || "Ẩn danh"}
                        </div>
                        <div className="text-zinc-500 text-xs truncate whitespace-nowrap mt-0.5">
                          {payment.user.email}
                        </div>
                      </td>

                      {/* COURSE (Thêm truncate dấu ba chấm) */}
                      <td className="py-4 px-4 text-zinc-200 font-medium truncate whitespace-nowrap" title={payment.course.title}>
                        {payment.course.title}
                      </td>

                      {/* ORIGINAL AMOUNT */}
                      <td className="py-4 px-4 text-right text-zinc-400 font-mono whitespace-nowrap">
                        {payment.originalAmount.toLocaleString("vi-VN")}đ
                      </td>

                      {/* DISCOUNT AMOUNT */}
                      <td className="py-4 px-4 text-right text-rose-400/80 font-mono whitespace-nowrap">
                        {payment.discountAmount > 0 ? `-${payment.discountAmount.toLocaleString("vi-VN")}đ` : "0đ"}
                      </td>

                      {/* AMOUNT */}
                      <td className="py-4 px-4 text-right text-emerald-400 font-bold font-mono text-sm whitespace-nowrap">
                        {payment.amount.toLocaleString("vi-VN")}đ
                      </td>

                      {/* COUPON CODE */}
                      <td className="py-4 px-4 text-center font-mono whitespace-nowrap">
                        {payment.couponCode ? (
                          <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-xs font-bold uppercase border border-blue-500/20">
                            {payment.couponCode}
                          </span>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>

                      {/* METHOD */}
                      <td className="py-4 px-4 text-center text-zinc-300 font-medium text-xs whitespace-nowrap">
                        {payment.method ? (
                          <span className="bg-zinc-800 px-2 py-1 rounded border border-zinc-700 font-semibold uppercase">
                            {payment.method}
                          </span>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-4 text-center">
                        {renderStatusBadge(payment.status)}
                      </td>

                      {/* TRANSACTION NO (Thêm truncate dấu ba chấm) */}
                      <td className="py-4 px-4 text-center text-zinc-400 font-mono text-xs truncate whitespace-nowrap" title={payment.transactionNo || "Không có mã"}>
                        {payment.transactionNo || <span className="text-zinc-600">—</span>}
                      </td>

                      {/* CREATED AT */}
                      <td className="py-4 px-4 text-center text-zinc-500 text-xs font-mono whitespace-nowrap">
                        {new Date(payment.createdAt).toLocaleString("vi-VN", {
                          dateStyle: "short",
                          timeStyle: "short"
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TRẠNG THÁI TRỐNG DỮ LIỆU */}
            {filteredPayments.length === 0 && (
              <div className="py-12 text-center text-zinc-500 font-medium text-sm">
                Không tìm thấy dữ liệu hóa đơn nào khớp với bộ lọc hiện tại.
              </div>
            )}

            {/* THANH PHÂN TRANG */}
            <div className="flex items-center justify-between pt-4 border-t border-[#22283D] text-xs text-zinc-400 px-1">
              <div>
                Hiển thị <span className="text-white font-medium">{filteredPayments.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPayments.length)}</span> trong tổng số <span className="text-white font-medium">{filteredPayments.length}</span> giao dịch
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
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                        currentPage === pageNum
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
          </>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
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