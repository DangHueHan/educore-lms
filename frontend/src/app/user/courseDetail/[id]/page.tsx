
import Link from "next/link";
import EnrollButton from "../EnrollButton";
import { cookies } from "next/headers";
const BASE_URL = "http://localhost:3001";

type CourseProgress = {
  progressPercent: number;
  lastLessonTitle?: string;
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`${BASE_URL}/courses/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="p-10 font-sans text-center text-gray-500">
        Không tìm thấy khóa học
      </div>
    );
  }

  const course = await res.json();

  let enrolled = false;
  
  let progressPercent = 0;

  let lastLessonTitle = "";

  try {

    const cookieStore = await cookies();

    const check = await fetch(
      `${BASE_URL}/course-enrollments/check/${id}`,
      {
        cache: "no-store",

        headers: {
          Cookie: cookieStore.toString(),
        },
      }
    );


    if (check.ok) {

      const data = await check.json();

      enrolled = data.enrolled;

    }

  } catch (error) {

    console.log(error);

    enrolled = false;

  }


if(enrolled){

  try {

    const cookieStore = await cookies();

    const progress =
      await fetch(
        `${BASE_URL}/course-progress`,
        {
          cache:"no-store",
          headers:{
            Cookie: cookieStore.toString(),
          }
        }
      );


    if(progress.ok){

      const data = await progress.json();

      console.log("COURSE PROGRESS:", data);


      const progressData =
        Array.isArray(data)
          ? data.find(
              (x:any)=>x.course?.id === id
            )
          : data;


      progressPercent =
        progressData?.progressPercent ?? 0;


      lastLessonTitle =
        progressData?.lastLessonTitle ?? "";

    }


  } catch(error){

    console.log(error);

  }

}



  return (
    <div className="min-h-screen bg-white">
      <section className="w-full max-w-[1280px] mx-auto px-10 py-10 font-sans select-none text-black bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* ==================== PHẦN BÊN TRÁI (NỘI DUNG CHÍNH) ==================== */}
          <div className="lg:col-span-8 space-y-12 pr-6">

            {/* 1. Header & Breadcrumb */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
                <svg className="w-4 h-4 text-[#1d4ed8]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="text-[#1d4ed8] font-black text-sm">EDUCORE</span>
              </div>
              <h1 className="text-[38px] font-black leading-tight">
                {course.title}
              </h1>
              <p className="text-gray-700 mt-4 text-[16px] leading-relaxed max-w-[750px]">
                {course.description}
              </p>
            </div>

            {/* 2. Rating & Students */}
            <div className="flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex text-[#fadb14] text-lg">★★★★★</div>
                <span className="font-bold text-[16px]">4.9</span>
                <span className="text-gray-500">(530 đánh giá)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-lg">👥</span>
                <span className="font-bold text-gray-900 text-[16px]">
                  {course.enrollments?.length?.toLocaleString("vi-VN") || 0}
                </span>
                <span className="text-gray-500">học viên</span>
              </div>
            </div>

            {/* 3. Bạn sẽ học được gì? (Giữ tĩnh hoặc map tùy ý, ở đây tạo layout chuẩn) */}
            <div>
              <h2 className="text-[24px] font-black mb-6">Bạn sẽ học được gì?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                {[
                  "Các kiến thức cơ bản, nền móng của nội dung khóa học",
                  "Các mô hình, kiến trúc cơ bản khi triển khai ứng dụng",
                  "Các khái niệm, thuật ngữ cốt lõi đi kèm thực hành",
                  "Hiểu sâu hơn về bản chất và tư duy giải quyết vấn đề",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 text-[15px] text-gray-800 leading-snug">
                    <svg className="w-5 h-5 text-[#1d4ed8] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Nội dung khóa học (Render động từ dữ liệu API) */}
            <div>
              <div className="flex justify-between items-end mb-5">
                <div>
                  <h2 className="text-[24px] font-black">Nội dung khóa học</h2>
                  <p className="text-[14px] text-gray-600 mt-2">
                    <span className="font-bold text-gray-950">1</span> chương •{" "}
                    <span className="font-bold text-gray-950">{course.lessons.length}</span> bài học •{" "}
                    <span className="font-bold text-gray-950">{course.questions.length}</span> câu hỏi quiz
                  </p>
                </div>
                <span className="text-[#1d4ed8] text-[15px] font-bold cursor-pointer hover:underline">
                  Mở rộng tất cả
                </span>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-[#f7f8fa]">
                <div className="border-b border-gray-200">
                  <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-100 transition cursor-pointer select-none">
                    <div className="flex items-center gap-4">
                      <span className="text-[#1d4ed8] text-xl font-black w-4 text-center">−</span>
                      <span className="text-[15px] font-bold text-gray-800">1. Danh sách bài học chi tiết</span>
                    </div>
                    <span className="text-[14px] text-gray-600">{course.lessons.length} bài học</span>
                  </div>

                  {/* Render danh sách bài học động kết nối Link */}
                  <div className="bg-white border-t border-gray-100 divide-y divide-gray-50">
                    {course.lessons.map((lesson: any, index: number) => (
                      <div key={lesson.id} className="flex justify-between items-center px-12 py-3.5 hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3 text-[14.5px] text-gray-700">
                          <span className="text-[#1d4ed8] text-[10px]">▶</span>
                          {/* <Link href={`/user/courseVideo/${lesson.id}`} className="hover:text-[#1d4ed8] transition font-medium">
                            {index + 1}. {lesson.title}
                          </Link> */}

                          {
                            enrolled ? (

                              <Link
                                href={`/user/courseVideo/${lesson.id}`}
                                className="hover:text-[#1d4ed8] transition font-medium"
                              >
                                {index + 1}. {lesson.title}
                              </Link>


                            ) : (

                              <span
                                className="text-gray-400 cursor-not-allowed"
                              >
                                {index + 1}. {lesson.title}
                              </span>

                            )
                          }

                        </div>
                        <span className="text-sm text-gray-500">
                          {lesson.description ? "Chi tiết" : "05:00"}
                        </span>
                      </div>
                    ))}

                    {/* Mục câu hỏi Quiz cuối khóa */}
                    {/* <Link
                      href={`/user/questionAnswer/${course.id}`}
                      className="flex justify-between items-center px-12 py-3.5 bg-blue-50/50 hover:bg-blue-50 transition"
                    >
                      <div className="flex items-center gap-3 text-[14.5px] text-blue-800 font-semibold">
                        <span>Bài tập cuối khóa: Các câu hỏi Quiz trắc nghiệm</span>
                      </div>

                      <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                        {course.questions.length} câu hỏi
                      </span>
                    </Link> */}


                    {
                      enrolled ? (

                        <Link
                          href={`/user/questionAnswer/${course.id}`}
                          className="flex justify-between items-center px-12 py-3.5 bg-blue-50/50 hover:bg-blue-50 transition"
                        >
                          <div className="flex items-center gap-3 text-[14.5px] text-blue-800 font-semibold">
                            <span>
                              Bài tập cuối khóa: Các câu hỏi Quiz trắc nghiệm
                            </span>
                          </div>

                          <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                            {course.questions.length} câu hỏi
                          </span>

                        </Link>

                      ) : (

                        <div
                          className="
      flex justify-between items-center
      px-12 py-3.5
      bg-gray-100
      text-gray-400
      cursor-not-allowed
      "
                        >

                          <div className="flex items-center gap-3 text-[14.5px] font-semibold">

                            <span>
                              Bài tập cuối khóa: Các câu hỏi Quiz trắc nghiệm
                            </span>

                          </div>


                          <span
                            className="
        text-xs 
        bg-gray-200 
        text-gray-500 
        font-bold 
        px-2.5 
        py-0.5 
        rounded-full
        "
                          >
                            {course.questions.length} câu hỏi
                          </span>


                        </div>

                      )
                    }


                  </div>

                </div>
              </div>
            </div>

            {/* 5. Khóa học liên quan (Giao diện mẫu giữ nguyên cấu trúc 3 cột cứng đẹp mắt) */}
            <div className="pt-6">
              <h2 className="text-[24px] font-black mb-8">Khóa học liên quan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl border border-gray-200 shadow-md hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between">
                  <div className="h-32 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center p-5 text-center">
                    <p className="text-white text-[16px] font-black leading-tight drop-shadow-sm">Kiến Thức Nhập Môn IT</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <h4 className="font-bold text-[14.5px] text-gray-900 line-clamp-1">Kiến Thức Nhập Môn IT</h4>
                    <p className="text-[#1d4ed8] font-black text-sm uppercase">Miễn phí</p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1"><span className="text-yellow-400 text-xs">★★★★★</span><span className="text-xs font-bold text-gray-500">4.9</span></div>
                      <div className="flex items-center gap-1 text-gray-400 text-[11px]"><span>👥</span> <span>139.683</span></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200 shadow-md hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between">
                  <div className="h-32 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center p-5 text-center">
                    <p className="text-white text-[16px] font-black leading-tight drop-shadow-sm">Lập trình C++ nâng cao</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <h4 className="font-bold text-[14.5px] text-gray-900 line-clamp-1">Lập trình C++ nâng cao</h4>
                    <p className="text-[#1d4ed8] font-black text-sm uppercase">Miễn phí</p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1"><span className="text-yellow-400 text-xs">★★★★★</span><span className="text-xs font-bold text-gray-500">4.9</span></div>
                      <div className="flex items-center gap-1 text-gray-400 text-[11px]"><span>👥</span> <span>39.975</span></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200 shadow-md hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between">
                  <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-5 text-center">
                    <p className="text-white text-[16px] font-black leading-tight drop-shadow-sm">HTML CSS từ Zero đến Hero</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <h4 className="font-bold text-[14.5px] text-gray-900 line-clamp-1">HTML CSS từ Zero đến Hero</h4>
                    <p className="text-[#1d4ed8] font-black text-sm uppercase">Miễn phí</p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1"><span className="text-yellow-400 text-xs">★★★★★</span><span className="text-xs font-bold text-gray-500">4.9</span></div>
                      <div className="flex items-center gap-1 text-gray-400 text-[11px]"><span>👥</span> <span>219.846</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ==================== PHẦN BÊN PHẢI (SIDEBAR ĐĂNG KÝ) ==================== */}



          <div
            className={
              enrolled
                ? "lg:col-span-4 sticky top-10"
                : "lg:col-span-4 sticky top-10 flex flex-col items-center"
            }
          >


            {
              !enrolled && (
                <div className="w-full flex flex-col items-center">
                  <div className="w-full max-w-[340px] bg-white rounded-3xl p-5 border border-gray-100 shadow-lg flex flex-col items-center">


                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden group cursor-pointer mb-6 shadow-sm">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition duration-300">
                          <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <p className="text-white text-[13px] font-bold mt-3 tracking-wide drop-shadow-md">Xem giới thiệu khóa học</p>
                      </div>
                    </div>


                    <div className="w-full text-center space-y-4 px-2">
                      <p className="text-[13px] text-gray-500 font-bold uppercase tracking-widest">Chi phí khóa học</p>
                      <p className="text-[38px] font-black text-[#1d4ed8]">Miễn phí</p>

                      {
                        !enrolled && (

                          <EnrollButton
                            courseId={course.id}
                          />

                        )
                      }

                    </div>


                    <div className="w-full mt-7 space-y-4 text-[14px] text-gray-700 pl-4">

                      <div className="flex items-center gap-4">
                        <div className="shrink-0">
                          <svg className="w-5 h-5 text-[#1d4ed8]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <span>Trình độ cơ bản</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="shrink-0">
                          <svg className="w-5 h-5 text-[#1d4ed8]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span>Tổng số <span className="font-bold text-gray-900">{course.lessons.length}</span> bài học</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="shrink-0">
                          <svg className="w-5 h-5 text-[#1d4ed8]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span>Tổng số <span className="font-bold text-gray-900">{course.questions.length}</span> câu hỏi quiz</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="shrink-0">
                          <svg className="w-5 h-5 text-[#1d4ed8]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                          </svg>
                        </div>
                        <span>Chứng chỉ hoàn thành</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="shrink-0">
                          <svg className="w-5 h-5 text-[#1d4ed8]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span>Học mọi lúc, mọi nơi</span>
                      </div>

                    </div>

                  </div>
                </div>
              )
            }





            {
              enrolled && (


            <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6">


      <h2 className="text-xl font-black mb-5">
        Tiến độ học tập
      </h2>



      {/* progress bar */}

      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">

        <div
          className="bg-[#1d4ed8] h-3 rounded-full transition-all duration-500"
          style={{
            width: `${progressPercent}%`
          }}
        />

      </div>



      <div className="flex justify-between mb-6">

        <span className="text-gray-500 text-sm">
          Hoàn thành
        </span>

        <span className="font-black text-[#1d4ed8]">
          {progressPercent}%
        </span>

      </div>





      <div className="bg-blue-50 rounded-xl p-4 mb-6">


        <p className="text-xs text-gray-500 font-bold mb-1">
          ĐÃ HỌC
        </p>


        <p className="font-bold text-gray-800 text-sm truncate">

          {
            lastLessonTitle
              ? lastLessonTitle
              : "Chưa bắt đầu bài học nào"
          }

        </p>


      </div>






      <div className="space-y-4 text-sm">


        <div className="flex justify-between">

          <span className="text-gray-500">
            Tổng bài học
          </span>

          <span className="font-bold">
            {course.lessons.length}
          </span>

        </div>




        <div className="flex justify-between">

          <span className="text-gray-500">
            Quiz
          </span>

          <span className="font-bold">
            {course.questions.length}
          </span>

        </div>




        <div className="flex justify-between">

          <span className="text-gray-500">
            Trạng thái
          </span>


          <span className="text-green-600 font-bold">
            Đã tham gia
          </span>

        </div>


      </div>



    </div>



              )
            }


          </div>




        </div>
      </section>
    </div>
  );
}