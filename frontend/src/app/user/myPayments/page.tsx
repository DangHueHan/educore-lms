"use client";

import { useEffect, useState } from "react";
import UserDashboardLayout from "../userDashboard/page";

const BASE_URL = "http://localhost:3001";

export default function MyPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  async function getPayments() {
    try {
      const res = await fetch(`${BASE_URL}/payment/my`, { credentials: "include" });
      const data = await res.json();
      setPayments(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPayments();
  }, []);

  async function sendRefund(paymentId: string) {
    const reason = reasons[paymentId];
    if (!reason?.trim()) {
      alert("Vui lòng nhập lý do hoàn tiền để chúng tôi hỗ trợ bạn!");
      return;
    }

    const res = await fetch(`${BASE_URL}/refund-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId, reason }),
    });

    if (res.ok) {
      alert("Yêu cầu hoàn tiền đã được gửi thành công.");
      setSelectedPaymentId(null);
      getPayments();
    }
  }

  if (loading) {
    return (
      <UserDashboardLayout>
        <div className="flex h-64 items-center justify-center text-slate-400 font-medium">
            Đang tải dữ liệu lịch sử thanh toán...
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-800">Lịch sử thanh toán</h1>
            <p className="text-slate-500 text-sm mt-1">Xem lại các giao dịch và quản lý yêu cầu hoàn tiền của bạn</p>
        </div>

        {payments.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
            <p className="text-slate-400">Bạn chưa có lịch sử giao dịch nào.</p>
          </div>
        )}

        <div className="space-y-4">
          {payments.map((item) => {
            const refund = item.refundRequests?.[0];
            const getRefundStatusVN = (status: string) => {
                const map: Record<string, string> = {
                    "PENDING": "Đang chờ xử lý",
                    "APPROVED": "Đã được chấp nhận",
                    "REJECTED": "Đã bị từ chối",
                    "COMPLETED": "Hoàn tất"
                };
                return map[status] || status;
            };

            return (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-6 transition-all hover:border-blue-200 hover:shadow-md flex flex-col md:flex-row gap-6">
                <img
                  src={item.course?.thumbnail || "/no-image.png"}
                  alt={item.course?.title}
                  className="w-40 h-24 object-cover rounded-xl shadow-inner flex-shrink-0"
                />

                <div className="flex-1 flex flex-col gap-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 mb-4">{item.course?.title || "Khóa học chưa xác định"}</h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-sm">
                            <InfoItem label="Số tiền" value={`${item.amount.toLocaleString()} đ`} />
                            <InfoItem label="Phương thức" value={item.method || "VNPay"} />
                            <InfoItem label="Trạng thái" value={item.status === "SUCCESS" ? "Thành công" : item.status} status={item.status} />
                            <InfoItem label="Mã giao dịch" value={item.transactionNo || "---"} />
                            <InfoItem label="Ngày thanh toán" value={item.paidAt ? new Date(item.paidAt).toLocaleDateString("vi-VN") : "---"} />
                            <InfoItem label="Yêu cầu hoàn" value={refund ? getRefundStatusVN(refund.status) : "Chưa yêu cầu"} isRefund />
                        </div>
                    </div>

                    {refund && (
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm">
                            <p className="text-slate-600"><span className="font-semibold text-slate-800">Lý do của bạn:</span> {refund.reason}</p>
                            <p className="mt-1 text-blue-700"><span className="font-semibold">Phản hồi từ quản trị viên:</span> {refund.adminNote || "Đang chờ admin phản hồi..."}</p>
                        </div>
                    )}

                    {!refund && item.status === "SUCCESS" && (
                        <div className="flex justify-end">
                            <button 
                                onClick={() => setSelectedPaymentId(item.id)}
                                className="bg-slate-900 hover:bg-red-600 transition-colors text-white px-6 py-2.5 rounded-xl font-semibold text-sm"
                            >
                                Yêu cầu hoàn tiền
                            </button>
                        </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedPaymentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Gửi yêu cầu hoàn tiền</h2>
            <p className="text-slate-500 text-sm mb-6">Vui lòng cung cấp lý do hoàn tiền để chúng tôi có thể hỗ trợ bạn tốt nhất.</p>
            <textarea
              placeholder="Nhập lý do của bạn tại đây..."
              value={reasons[selectedPaymentId] || ""}
              onChange={(e) => setReasons({ ...reasons, [selectedPaymentId]: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-4 h-32 mb-6 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setSelectedPaymentId(null)} className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-all">
                Hủy bỏ
              </button>
              <button onClick={() => sendRefund(selectedPaymentId)} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg shadow-red-200 transition-all">
                Gửi yêu cầu
              </button>
            </div>
          </div>
        </div>
      )}
    </UserDashboardLayout>
  );
}

function InfoItem({ label, value, status, isRefund }: { label: string, value: string, status?: string, isRefund?: boolean }) {
    const statusColor = status === "SUCCESS" ? "text-green-600" : "text-amber-600";
    return (
        <div>
            <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{label}</div>
            <div className={`font-medium ${status ? statusColor : "text-slate-800"}`}>
                {isRefund && value !== "Chưa yêu cầu" ? <span className="text-blue-600">{value}</span> : value}
            </div>
        </div>
    )
}