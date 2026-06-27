"use client";
import React, { useEffect, useState } from "react";
import { BannerParticles } from "../BannerParticles";
import Link from "next/link";
import { Users, Clock, Star, Tag, Crown } from 'lucide-react';
const BASE_URL = "http://localhost:3001";



type Course = {

  id: string;

  title: string;

  description?: string;

  thumbnail?: string;

  price: number;

  courseCoupons?: {

    coupon: {

      discountPercent: number;

    }

  }[];

};


const LINES = ["Vững kỹ năng.", "Chắc tương lai."];

function useTypewriter(lines: string[], speed = 55, pauseMs = 820) {
  const [displayed, setDisplayed] = useState<string[]>(["", ""]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let pausing = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (lineIdx >= lines.length) { setDone(true); return; }

      if (pausing) {
        pausing = false;
        lineIdx++;
        charIdx = 0;
        timeout = setTimeout(tick, speed);
        return;
      }

      const current = lines[lineIdx].slice(0, charIdx + 1);
      setDisplayed(prev => {
        const next = [...prev];
        next[lineIdx] = current;
        return next;
      });
      charIdx++;

      if (charIdx >= lines[lineIdx].length) {
        if (lineIdx < lines.length - 1) {
          pausing = true;
          timeout = setTimeout(tick, pauseMs);
        } else {
          setDone(true);
        }
        return;
      }
      timeout = setTimeout(tick, speed);
    };

    timeout = setTimeout(tick, 700); // delay trước khi bắt đầu
    return () => clearTimeout(timeout);
  }, []);

  return { displayed, done };
}
export default function App() {

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    const res = await fetch(`${BASE_URL}/courses`);
    const data = await res.json();

    setCourses(Array.isArray(data) ? data : []);
  }

  function getDiscount(course: Course) {

    const coupon =
      course.courseCoupons?.[0]?.coupon;


    if (!coupon) {
      return null;
    }


    const discount =
      course.price *
      coupon.discountPercent /
      100;


    return {

      percent:
        coupon.discountPercent,

      oldPrice:
        course.price,

      newPrice:
        course.price - discount

    };

  }


  const [showAll, setShowAll] = useState(false);
  const visibleCourses = showAll
    ? courses
    : courses.slice(0, 4);

  const remainingCourses = courses.length - 4;

  const freeCourses =
    courses.filter(
      (course) => course.price === 0
    );

  const advancedCourses =
    courses.filter(
      (course) => course.price > 0
    );

  
  const { displayed, done } = useTypewriter(LINES);
  return (
    <div className="min-h-screen bg-white">
      {/* ========================================== */}
      {/* 1. THANH ĐIỀU HƯỚNG (NAVIGATION)         */}
      {/* ========================================== */}


      {/* ========================================== */}
      {/* 2. KHU VỰC BANNER CHÍNH (HEADER / HERO)   */}
      {/* ========================================== */}
      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-text {
          background: linear-gradient(90deg, #38bdf8, #818cf8, #22d3ee, #a78bfa, #38bdf8);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 4s ease infinite;
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes robotRiseUp {
          0%   { transform: translateY(220px) scale(0.95); opacity: 0; }
          60%  { opacity: 1; }
          100% { transform: translateY(0px) scale(1); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          0%   { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        @keyframes fadeIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.08); }
        }
        .banner-bg-reveal {
          animation: robotRiseUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .banner-overlay-reveal {
          animation: fadeIn 1.4s ease forwards;
        }
        .hero-tag {
          animation: fadeSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
        }
        .hero-title {
          animation: fadeSlideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both;
        }
        .hero-subtitle {
          animation: fadeSlideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.75s both;
        }
        .hero-cta {
          animation: fadeSlideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.95s both;
        }
        .hero-glow {
          animation: fadeIn 1.8s ease 0.6s both, glowPulse 3s ease-in-out 2s infinite;
        }
      `}</style>

      <div className="w-full relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden select-none bg-[#080d1a]">
        {/* Nền tối cố định */}
        <div className="absolute inset-0 z-0 bg-[#080d1a]" />

        {/* Ảnh robot — bay lên từ dưới khi load */}
        <img
          src="https://wave-cms-uploads.s3.amazonaws.com/AI_Code_fda6defd49.jpg"
          alt=""
          className="absolute inset-0 z-0 w-full h-full object-cover banner-bg-reveal"
          style={{ filter: "brightness(0.55)" }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-black/75 via-black/40 to-transparent pointer-events-none banner-overlay-reveal" />

        {/* Glow xanh phía sau robot */}
        <div
          className="absolute z-2 pointer-events-none hero-glow"
          style={{
            right: "8%",
            top: "50%",
            transform: "translateY(-50%)",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.22) 0%, rgba(59,130,246,0.10) 50%, transparent 75%)",
          }}
        />

        {/* Particles */}
        <BannerParticles />

        {/* Nội dung text */}
        <div className="w-full max-w-[1300px] mx-auto px-6 md:px-12 relative z-10 text-left">
          <div className="max-w-2xl space-y-5">
            {/* Tag badge */}
            <div className="hero-tag inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 rounded-full px-4 py-1.5 backdrop-blur-sm w-fit">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-300 text-sm font-semibold tracking-wide">AI · Công nghệ · Tương lai</span>
            </div>

            <h1 className="hero-title text-3xl md:text-4xl lg:text-[48px] font-black leading-[1.2] tracking-tight min-h-[2.6em]">
              <span className={done ? "gradient-text" : "text-white"}>{displayed[0]}</span>
              {displayed[0] === LINES[0] && (
                <>
                  <br />
                  <span className={done ? "gradient-text" : "text-blue-400"}>{displayed[1]}</span>
                </>
              )}
              {!done && (
                <span
                  className="inline-block w-[3px] h-[1em] bg-blue-400 ml-1 align-middle"
                  style={{ animation: "cursorBlink 0.7s step-end infinite" }}
                />
              )}
            </h1>

            <p className="hero-subtitle text-zinc-200 font-medium text-sm md:text-base max-w-sm leading-relaxed">
              Làm chủ công nghệ, bứt phá thu nhập cùng đội ngũ chuyên gia hàng đầu.
            </p>

            <div className="hero-cta pt-4">
              <button
                type="button"
                className="bg-blue-500/15 border border-blue-400/30 backdrop-blur-sm text-blue-300 hover:bg-blue-500/25 hover:border-blue-400/50 font-extrabold text-sm px-10 py-4 rounded-full transition-all tracking-wide uppercase"
              >
                Khám phá ngay
              </button>
            </div>
          </div>
        </div>
      </div>


     {/* ========================= */}
{/* 1. SECTION: DÀNH CHO BẠN */}
{/* ========================= */}
<section className="w-full max-w-[1300px] mx-auto px-6 md:px-12 py-16">
  <h2 className="text-3xl font-bold text-slate-900 mb-10">Dành cho bạn</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {visibleCourses.map((course) => (
      <div key={course.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
        <div className="relative h-52">
          <img src={course.thumbnail || "https://placehold.co/600x400?text=EduCore"} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
        <div className="p-6">
          <div className="font-semibold text-xl">
            <Link href={`/user/courseDetail/${course.id}`}>{course.title}</Link>
          </div>
          <p className="text-gray-500 text-sm mt-2 line-clamp-2 min-h-[40px]">{course.description}</p>
          <div className="mt-4">
            {course.price === 0 ? (
              <span className="text-blue-600 font-bold text-xl">Miễn phí</span>
            ) : (() => {
              const discount = getDiscount(course);
              return (
                <div>
                  {discount ? (
                    <>
                      <span className="line-through text-gray-400 text-sm">{discount.oldPrice.toLocaleString()}đ</span>
                      <span className="text-red-500 font-bold text-xl ml-2">{discount.newPrice.toLocaleString()}đ</span>
                      <span className="ml-2 bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded-full font-bold">-{discount.percent}%</span>
                    </>
                  ) : (
                    <span className="text-blue-600 font-bold text-xl">{course.price.toLocaleString()}đ</span>
                  )}
                </div>
              );
            })()}
          </div>
          <div className="flex items-center gap-1.5 mt-5 text-sm text-gray-500">
             <div className="flex text-yellow-400"><Star size={16} fill="currentColor"/></div>
             <span>Chưa có đánh giá</span>
          </div>
          <div className="flex justify-between mt-6 text-sm text-gray-600">
            <div className="flex items-center gap-1"><Users size={16}/> 210</div>
            <div className="flex items-center gap-1"><Clock size={16}/> 2h21p</div>
          </div>
        </div>
      </div>
    ))}
  </div>
  {!showAll && remainingCourses > 0 && (
    <div className="text-center mt-12">
      <button onClick={() => setShowAll(true)} className="px-8 py-3.5 rounded-full border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-all">
        Xem thêm {remainingCourses} khóa học
      </button>
    </div>
  )}
</section>

{/* ============================= */}
{/* 2. SECTION: KHÓA HỌC FREE */}
{/* ============================= */}
<section className="w-full bg-slate-50 py-16">
  <div className="max-w-[1300px] mx-auto px-6 md:px-12">
    <h2 className="text-3xl font-bold text-slate-900 mb-10">Khóa học Free <span className="bg-blue-600 text-white text-sm px-4 py-1 rounded-full font-medium">HOT</span></h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {freeCourses.map((course) => (
        <div key={course.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
          <div className="relative h-52">
            <img src={course.thumbnail || "https://placehold.co/600x400?text=EduCore"} alt={course.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
          <div className="p-6">
            <div className="font-semibold text-xl"><Link href={`/user/courseDetail/${course.id}`}>{course.title}</Link></div>
            <span className="text-blue-600 font-bold text-xl block mt-4">Miễn phí</span>
            <div className="flex items-center gap-1.5 mt-5">
              <div className="flex text-yellow-400"><Star size={16} fill="currentColor"/></div>
              <span className="font-medium text-sm text-gray-500">Chưa có đánh giá</span>
            </div>
            <div className="flex justify-between text-sm mt-6 text-gray-600">
              <div className="flex items-center gap-1"><Users size={16}/> 0</div>
              <div className="flex items-center gap-1"><Clock size={16}/> 0h</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ========================= */}
{/* 3. SECTION: KHÓA HỌC NÂNG CAO */}
{/* ========================= */}
<section className="w-full max-w-[1300px] mx-auto px-6 md:px-12 py-16">
  <div className="flex justify-between items-end mb-10">
    <h2 className="text-3xl font-bold text-slate-900">Khóa học nâng cao</h2>
    <a href="#" className="text-blue-600 font-medium hover:underline flex items-center gap-1">Xem tất cả →</a>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {advancedCourses.map((course) => (
      <div key={course.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
        <div className="relative h-52">
          <img src={course.thumbnail || "https://placehold.co/600x400?text=EduCore"} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>

<div className="absolute top-4 left-4 z-10">
  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-sm shadow-lg">
    {/* Icon vương miện từ thư viện sẽ trông sắc nét và chuyên nghiệp hơn */}
    <Crown className="w-6 h-6 text-yellow-400" strokeWidth={2.5} />
  </div>
</div>
        </div>
        <div className="p-6">
          <Link href={`/user/courseDetail/${course.id}`}>
            <h3 className="font-semibold text-xl hover:text-blue-600 line-clamp-2">{course.title}</h3>
          </Link>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{course.description}</p>
          <div className="mt-4">
            {(() => {
              const discount = getDiscount(course);
              return discount ? (
                <div>
                  <span className="text-gray-400 line-through text-sm">{discount.oldPrice.toLocaleString()}đ</span>
                  <span className="text-red-500 font-bold text-xl ml-2">{discount.newPrice.toLocaleString()}đ</span>
                  <span className="ml-2 bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded-full font-bold">-{discount.percent}%</span>
                </div>
              ) : (
                <span className="text-blue-600 font-bold text-xl">{course.price.toLocaleString()}đ</span>
              );
            })()}
          </div>
          <div className="flex items-center gap-1.5 mt-5">
            <div className="flex text-yellow-400"><Star size={16} fill="currentColor"/></div>
            <span className="font-medium text-sm text-gray-500">Chưa có đánh giá</span>
          </div>
          <div className="flex justify-between text-sm mt-6 text-gray-600">
            <div className="flex items-center gap-1"><Users size={16}/> Học viên</div>
            <div className="flex items-center gap-1"><Clock size={16}/> 0h</div>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>


    </div>
  );
}