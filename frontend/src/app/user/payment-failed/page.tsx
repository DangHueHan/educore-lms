import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-lg max-w-md w-full text-center">

        <div className="text-6xl mb-4">❌</div>

        <h1 className="text-3xl font-black text-red-600 mb-3">
          Thanh toán thất bại
        </h1>

        <p className="text-gray-600 mb-8">
          Giao dịch chưa được hoàn tất hoặc đã bị hủy.
          Vui lòng thử lại sau.
        </p>

        <div className="flex flex-col gap-3">

          <Link
            href="/user/course"
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-bold
              py-3
              rounded-xl
            "
          >
            Quay lại danh sách khóa học
          </Link>

          <Link
            href="/"
            className="
              border
              border-gray-300
              py-3
              rounded-xl
              font-semibold
            "
          >
            Về trang chủ
          </Link>

        </div>

      </div>
    </div>
  );
}