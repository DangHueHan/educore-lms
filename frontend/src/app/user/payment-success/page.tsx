import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-lg max-w-md w-full text-center">

        <div className="text-6xl mb-4">✅</div>

        <h1 className="text-3xl font-black text-green-600 mb-3">
          Thanh toán thành công
        </h1>

        <p className="text-gray-600 mb-8">
          Bạn đã đăng ký khóa học thành công.
          Bây giờ bạn có thể bắt đầu học ngay.
        </p>

        <div className="flex flex-col gap-3">

          <Link
            href="/user/myCourse"
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-bold
              py-3
              rounded-xl
            "
          >
            Đi tới khóa học của tôi
          </Link>

          <Link
            href="/user/course"
            className="
              border
              border-gray-300
              py-3
              rounded-xl
              font-semibold
            "
          >
            Tiếp tục khám phá
          </Link>

        </div>

      </div>
    </div>
  );
}