// "use client";

// import { useRef } from "react";

// const BASE_URL = "http://localhost:3001";

// export default function VideoPlayer({
//     lessonId,
//     videoUrl,
// }: {
//     lessonId: string;
//     videoUrl: string;
// }) {
//     const lastSent = useRef(0);

//     async function updateProgress(
//         watchedSeconds: number
//     ) {
//         try {
//             await fetch(
//                 `${BASE_URL}/progress/lesson`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type":
//                             "application/json",
//                     },
//                     credentials: "include",
//                     body: JSON.stringify({
//                         lessonId,
//                         watchedSeconds,
//                     }),
//                 }
//             );
//         } catch { }
//     }

//     return (
//         <video
//             controls
//             className="w-full h-full"
//             onTimeUpdate={(e) => {
//                 const current = Math.floor(
//                     e.currentTarget.currentTime
//                 );

//                 if (
//                     current - lastSent.current >=
//                     10
//                 ) {
//                     lastSent.current = current;

//                     updateProgress(current);
//                 }
//             }}
//             onEnded={(e) => {
//                 updateProgress(
//                     Math.floor(
//                         e.currentTarget.duration
//                     )
//                 );
//             }}
//         >
//             <source
//                 src={videoUrl}
//                 type="video/mp4"
//             />
//         </video>
//     );
// }
"use client";

import { useRef, useState } from "react";

const BASE_URL = "http://localhost:3001";

export default function VideoPlayer({
  lessonId,
  videoUrl,
}: {
  lessonId: string;
  videoUrl: string;
}) {
  const lastSent = useRef(0);
  const [isWaiting, setIsWaiting] = useState(false);

  async function updateProgress(watchedSeconds: number) {
    try {
      await fetch(`${BASE_URL}/progress/lesson`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          lessonId,
          watchedSeconds,
        }),
      });
    } catch {
      // Hạn chế log trống để code sạch hơn
    }
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#0D111C] border border-[#2B3454]/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group/player">
      
      {/* Hiệu ứng viền phát sáng nhẹ xung quanh player khi lướt qua */}
      <div className="absolute inset-0 border-2 border-transparent group-hover/player:border-blue-500/10 rounded-2xl pointer-events-none z-10 transition-colors duration-500" />

      {/* Video Element thực tế */}
      <video
        src={videoUrl}
        controls
        className="w-full h-full object-contain bg-black"
        // Tự động kích hoạt xoay vòng load khi mạng yếu / buffering
        onWaiting={() => setIsWaiting(true)}
        onPlaying={() => setIsWaiting(false)}
        onSeeked={() => setIsWaiting(false)}
        onTimeUpdate={(e) => {
          const current = Math.floor(e.currentTarget.currentTime);

          // Gửi tiến trình mỗi khi xem qua thêm 10 giây
          if (current - lastSent.current >= 10) {
            lastSent.current = current;
            updateProgress(current);
          }
        }}
        onEnded={(e) => {
          updateProgress(Math.floor(e.currentTarget.duration));
        }}
      />

      {/* UI LOADING SCREEN: Hiện đè lên khi video đang bị khựng (Buffering) */}
      {isWaiting && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-0 pointer-events-none animate-fade-in">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-xs text-zinc-400 font-medium tracking-wide">Đang tải video...</p>
        </div>
      )}
    </div>
  );
}