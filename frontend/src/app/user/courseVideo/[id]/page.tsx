import Link from "next/link";
import VideoPlayer from "./VideoPlayer";
const BASE_URL = "http://localhost:3001";

export default async function CourseVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`${BASE_URL}/lessons/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="p-10 text-center font-medium text-gray-500">
        Không tìm thấy bài học
      </div>
    );
  }

  const lesson = await res.json();

  return (
    <div className="w-full bg-white min-h-screen text-black font-sans antialiased select-none">
      {/* Lưới chính: Chia làm 2 phần (Trái: Video & Thông tin | Phải: Danh sách bài học) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full">
        
        {/* ========================================================================= */}
        {/* ==================== PHẦN BÊN TRÁI: VIDEO & NỘI DUNG ==================== */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 p-6 space-y-6">
          
          {/* Khung chứa Video Player (iframe YouTube lồng vào giao diện cao cấp) */}
          {/* <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-sm relative group">
            <iframe
              src={`https://www.youtube.com/embed/${lesson.videoUrl}`}
              title={lesson.title}
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div> */}
          <VideoPlayer
            lessonId={lesson.id}
            videoUrl={lesson.videoUrl}
          />
          {/* Tiêu đề Video */}
          <h1 className="text-[22px] font-bold text-[#242424] leading-snug">
            {lesson.title}
          </h1>

          {/* Thanh tương tác: Kênh, Đăng ký, Like, Share */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-gray-100 pb-5">
            {/* Thông tin kênh EduCore */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#1d4ed8] text-white font-black flex items-center justify-center text-xs shadow-sm border border-blue-200 tracking-tighter">
                EDU
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-[15px] text-gray-900">EduCore Official</span>
                  <span className="text-blue-500 text-xs">✓</span>
                </div>
                <p className="text-xs text-gray-500">143 N người đăng ký</p>
              </div>
              <button className="ml-4 bg-black hover:bg-zinc-800 text-white text-[13px] font-bold px-5 py-2 rounded-full transition-colors">
                Đăng ký
              </button>
            </div>

            {/* Cụm nút tương tác (Like/Dislike Đen Trắng) */}
            <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-700">
              {/* Nút Like / Dislike */}
              <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                {/* Nút Like */}
                <button className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-200 transition text-black">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                  </svg>
                  <span>2,4 N</span>
                </button>

                {/* Vạch chia đôi */}
                <div className="w-[1px] h-4 bg-gray-300"></div>

                {/* Nút Dislike */}
                <button className="px-4 py-2.5 hover:bg-gray-200 transition text-black">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h3a2 2 0 012 2v7a2 2 0 01-2 2h3" />
                  </svg>
                </button>
              </div>

              {/* Nút Chia sẻ */}
              <button className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-full transition text-black">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Chia sẻ</span>
              </button>

              {/* Nút Đặt câu hỏi */}
              <button className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-full transition text-[#1d4ed8]">
                <span>✦</span> <span>Đặt câu hỏi</span>
              </button>

              {/* Nút ba chấm */}
              <button className="bg-gray-100 hover:bg-gray-200 w-9 h-9 flex items-center justify-center rounded-full transition font-bold text-lg text-black">
                •••
              </button>
            </div>
          </div>

          {/* Khung mô tả video */}
          <div className="bg-gray-100 rounded-2xl p-5 text-[14px] text-gray-800 leading-relaxed space-y-3">
            <div className="font-bold text-gray-900 flex flex-wrap items-center gap-2">
              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs font-semibold uppercase">
                Khóa học: {lesson.course.title}
              </span>
              <span>•</span>
              <span>{lesson.course.lessons.length} bài học</span>
              <span>•</span>
              <span>{lesson.course.enrollments.length} học viên</span>
              <span>•</span>
              <span>{lesson.course.questions.length} câu hỏi</span>
            </div>
            
            <div className="text-gray-700 whitespace-pre-line pt-1">
              {lesson.description || "Chưa có mô tả cho bài học này."}
            </div>
          </div>

          {/* Khu vực bình luận (Giữ thiết kế mẫu) */}
          <div className="pt-2 space-y-6">
            <div className="flex items-center gap-8">
              <h3 className="text-[20px] font-bold text-gray-900">127 bình luận</h3>
              <button className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <span>≡</span> <span>Sắp xếp theo</span>
              </button>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* ==================== PHẦN BÊN PHẢI: MENU DANH SÁCH BÀI HỌC ============== */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 border-l border-gray-200 h-[calc(100vh-20px)] lg:sticky lg:top-0 overflow-y-auto bg-white">
          
          {/* Hộp thông báo bài học tiêu đề trên cùng */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="font-bold text-[15px] text-gray-900">
              Nội dung khóa học
            </h2>
            <p className="text-[12px] text-gray-500 mt-0.5">
              Tổng số: {lesson.course.lessons.length} bài học
            </p>
          </div>

          {/* Danh sách bài học lặp qua map() */}
          <div className="divide-y divide-gray-100">
            {lesson.course.lessons.map((item: any, index: number) => {
              const isActive = item.id === lesson.id;
              return (
                <Link key={item.id} href={`/user/courseVideo/${item.id}`}>
                  <div
                    className={`flex justify-between items-center px-5 py-3.5 transition text-[13.5px] cursor-pointer ${
                      isActive
                        ? "bg-blue-50/70 border-l-4 border-l-[#1d4ed8]"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3 pr-2 overflow-hidden">
                      {/* Biểu tượng phát Video */}
                      <span
                        className={`w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          isActive
                            ? "bg-[#1d4ed8] text-white"
                            : "bg-white border border-[#1d4ed8] text-[#1d4ed8]"
                        }`}
                      >
                        ▶
                      </span>
                      <span className={`line-clamp-2 ${isActive ? "font-bold text-[#1d4ed8]" : "font-medium text-gray-800"}`}>
                        {index + 1}. {item.title}
                      </span>
                    </div>
                    
                    {/* Trạng thái thời gian / Đang học */}
                    <span className={`text-xs shrink-0 font-mono ${isActive ? "text-[#1d4ed8] font-bold" : "text-gray-400"}`}>
                      {isActive ? "Đang học" : "04:30"}
                    </span>
                  </div>
                </Link>
              );
            })}

            {/* Bài kiểm tra cuối khóa */}
            {/* Bài kiểm tra cuối khóa */}
<Link href={`/user/quiz/${lesson.course.id}`}>
  <div className="p-4 hover:bg-emerald-100/50 cursor-pointer transition bg-[#ebf3ed]">
    <div className="flex items-center gap-3">
      {/* Thay cúp bằng icon hình tròn chứa dấu Check hoặc ký tự đơn giản */}
      <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
        ✓
      </span>
      <div className="font-bold text-[13.5px] text-emerald-800">
        Bài kiểm tra cuối khóa
      </div>
    </div>
    
    {/* Thay bàn tay bằng khoảng trống lề (ml-7) để thẳng hàng đẹp đẽ */}
    <div className="text-[12px] text-emerald-600 font-medium mt-1 ml-7">
      Gồm {lesson.course.questions.length} câu hỏi tổng hợp
    </div>
  </div>
</Link>
          </div>

        </div>

      </div>
    </div>
  );
}