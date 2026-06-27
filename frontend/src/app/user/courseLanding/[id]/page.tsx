"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Lesson = {
  id: string;
  title: string;
  videoUrl: string;
};

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;

  lessons: Lesson[];

  courseCoupons?: {
    coupon: {
      discountPercent: number;
    };
  }[];
};

export default function JavascriptProLandingPage() {
  const params = useParams();
  const id = params.id as string;


  const [loading, setLoading] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const BASE_URL = "http://localhost:3001";
  const [course, setCourse] = useState<Course | null>(null);
  const handleFreeTrial = () => {
    videoRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setTimeout(() => {
      setPlayVideo(true);
    }, 700);
  };
  const fetchCourse = async () => {
    const res = await fetch(`${BASE_URL}/courses/${id}`);
    const data = await res.json();

    setCourse(data);
  };
  useEffect(() => {
    fetchCourse();
  }, [id]);

  if (!course) {
    return <div>Đang tải...</div>;
  }





  function getDiscount(course: Course) {
    const coupon = course.courseCoupons?.[0]?.coupon;

    if (!coupon) {
      return null;
    }

    const discount =
      course.price * coupon.discountPercent / 100;

    return {
      percent: coupon.discountPercent,
      oldPrice: course.price,
      newPrice: course.price - discount,
    };
  }
  console.log(id);
  // Dữ liệu cứng được khai báo trực tiếp ở đây để map ra giống hệt cấu trúc file lịch sử
  const targets = [
    {
      id: 1,
      name: "Sinh Viên IT",
      desc: "Bạn muốn học các kiến thức thực tế ở trường không dạy? Bạn muốn có kiến thức vững chắc để năm sau đi thực tập tại doanh nghiệp?"
    },
    {
      id: 4,
      name: "Người Đã Đi Làm",
      desc: "Bạn muốn hiểu sâu sắc về JavaScript để nâng cao tay nghề? Bạn đang muốn có nền tảng vững chắc để xây dựng các ứng dụng web?"
    },
    {
      id: 2,
      name: "Người Trái Ngành / Chuyển Nghề",
      desc: "Bạn là người mới bắt đầu và đang tìm hiểu về nghề lập trình web? Bạn đang chưa biết bắt đầu từ đâu..."
    }
  ];
  const handlePayment = async () => {
    try {

      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/payment/create`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: id,
          }),
        }
      );

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      alert(data.message || "Không tạo được thanh toán");

    } catch (error) {

      console.log(error);

      alert("Có lỗi xảy ra");

    } finally {

      setLoading(false);

    }
  };
  return (
    <div className="min-h-screen bg-[#10141d] text-slate-200 font-sans pb-32">

      {/* =========================================================================
           SECTION 1: HERO BANNER (Dựa trên Ảnh 1)
           ========================================================================= */}
      <header className="relative overflow-hidden px-4 md:px-8 pt-6 pb-16 flex flex-col items-center"
        style={{ background: "radial-gradient(circle at 50% -20%, #1e2640 0%, #10141d 70%)" }}>



        {/* Tiêu đề chính */}
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center z-10">
          <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-white">
            {course?.title}
          </h1>

          <p className="text-gray-400 text-base md:text-xl font-normal max-w-2xl mb-10 leading-relaxed">
            {course?.description}
          </p>

          <div className="mt-4 mb-4">
            {course?.price === 0 ? (
              <p className="text-4xl font-black text-cyan-400">
                Miễn phí
              </p>
            ) : (() => {
              const discount = course && getDiscount(course);

              return discount ? (
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="line-through text-gray-400 text-xl">
                    {discount.oldPrice.toLocaleString()}đ
                  </span>

                  <span className="text-red-500 font-black text-4xl">
                    {discount.newPrice.toLocaleString()}đ
                  </span>

                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                    -{discount.percent}%
                  </span>
                </div>
              ) : (
                <p className="text-4xl font-black text-cyan-400">
                  {course.price.toLocaleString()}đ
                </p>
              );
            })()}
          </div>

          {/* Cặp nút hành động */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto px-4">
            <button
              onClick={handleFreeTrial}
              className="inline-flex items-center justify-center text-white font-bold px-8 py-4 rounded-full text-base shadow-lg shadow-purple-500/30 hover:opacity-90 transition-all text-center min-w-[200px]"
              style={{ background: "linear-gradient(90deg, #2878f4 0%, #9b51e0 100%)" }}>
              HỌC THỬ MIỄN PHÍ
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="
    inline-flex
    items-center
    justify-center
    bg-[#20293a]
    text-gray-200
    border
    border-gray-700/50
    font-bold
    px-8
    py-4
    rounded-full
    text-base
    hover:bg-[#28344c]
    transition-all
    text-center
    min-w-[200px]
    disabled:opacity-50
  "
            >
              {loading ? "ĐANG XỬ LÝ..." : "MUA NGAY"}
            </button>
          </div>
        </div>

        {/* Khung Video Demo */}
        <div ref={videoRef} className="w-full max-w-5xl rounded-2xl overflow-hidden border border-gray-800 shadow-2xl bg-[#161b26]">

          {!playVideo ? (

            <div
              className="relative aspect-video cursor-pointer group"
              onClick={() => setPlayVideo(true)}
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/30 transition" />

              <div className="absolute inset-0 flex items-center justify-center">

                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="black"
                    className="w-9 h-9 ml-1"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>

                </div>

              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6">

                <p className="text-gray-300 text-sm">
                  Bài học đầu tiên
                </p>

                <h3 className="text-white text-2xl font-bold mt-1">
                  {course.lessons[0]?.title}
                </h3>

              </div>

            </div>

          ) : (

            <iframe
              src={`${course.lessons[0]?.videoUrl}?autoplay=1`}
              className="w-full aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

          )}

        </div>

        {/* Đốm sáng Trang trí */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      </header>

      {/* =========================================================================
           SECTION 2: ĐỐI TƯỢNG KHOÁ HỌC (Sử dụng vòng lặp map dữ liệu tĩnh) (Dựa trên Ảnh 2)
           ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Cột trái: Tiêu đề & Graphic */}
        <div className="lg:col-span-5 space-y-8 text-center lg:text-left">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Khoá học này<br className="hidden lg:block" /> dành cho ai?
          </h2>

          <div className="relative w-64 h-64 mx-auto lg:mx-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-2xl transform scale-90"></div>
            <div className="w-56 h-56 bg-gradient-to-tr from-teal-500 to-emerald-600 rounded-full p-4 flex items-center justify-center shadow-xl relative overflow-hidden">
              <div className="absolute bottom-4 right-2 w-36 h-24 bg-[#1f2635] rounded-xl border border-gray-700 p-2 shadow-2xl flex flex-col justify-between">
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-red-400"></div>
                  <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
                  <div className="w-1 h-1 rounded-full bg-green-400"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-1 w-full bg-cyan-400/40 rounded"></div>
                  <div className="h-1 w-5/6 bg-purple-400/40 rounded"></div>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 text-white opacity-80">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Cột phải: Duyệt mảng bằng hàm .map() */}
        <div className="lg:col-span-7 space-y-4">
          {targets.map((target) => (
            <div
              key={target.id}
              className="flex items-start gap-5 p-5 bg-[#13182c]/40 border border-[#2a3352]/40 rounded-2xl hover:border-purple-500/30 transition-all group"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-base text-white shrink-0 shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform">
                {target.id}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {target.name}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {target.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* =========================================================================
           STICKY FOOTER: THANH HÀNH ĐỘNG DƯỚI ĐÁY TRANG
           ========================================================================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#131924]/90 backdrop-blur-md border-t border-gray-800/60 px-4 md:px-6 py-4 z-50 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="font-bold tracking-wide text-[10px] uppercase text-gray-500 hidden md:inline">HỌC LẬP TRÌỂ ĐỂ ĐI LÀM</span>
              <h4 className="text-base md:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {course?.title}
              </h4>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
              Khóa học đầy đủ và bài bản nhất mà bạn có thể tìm thấy trên Internet
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <Link href="#" className="bg-[#1f2635] text-gray-300 font-bold px-5 py-2.5 rounded-xl text-xs md:text-sm border border-gray-700 hover:bg-gray-800 transition-all shrink-0">
              MUA NGAY
            </Link>
            <button
              onClick={handleFreeTrial}
              className="text-white font-bold px-5 py-2.5 rounded-xl text-xs md:text-sm shadow-md shadow-purple-500/10 hover:opacity-90 transition-all shrink-0"
              style={{ background: "linear-gradient(90deg, #2878f4 0%, #9b51e0 100%)" }}>
              HỌC THỬ MIỄN PHÍ
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}