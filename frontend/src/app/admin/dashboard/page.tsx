"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  Bar,
  Pie,
  Doughnut,
} from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const BASE_URL = "http://localhost:3001";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await fetch(`${BASE_URL}/dashboard/report`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error(error);
    }
  }

  if (!data) {
    return (
      <div className="p-6 text-zinc-400 font-medium text-xs bg-[#121624] min-h-screen flex items-center justify-center gap-2">
        <svg className="animate-spin h-4 w-4 text-[#0066FF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Đang tải dữ liệu hệ thống...
      </div>
    );
  }

  /* KEEP LOGIC EXACTLY - COLOR CHANGED FOR MODERN CHIC TECH LOOK */
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#9ca3af",
          font: { family: "sans-serif", size: 11, weight: "bold" as const }
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(34, 40, 61, 0.3)" },
        ticks: { color: "#9ca3af", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(34, 40, 61, 0.5)" },
        ticks: { color: "#9ca3af", font: { size: 11 } },
      },
    },
  };

  const topCourseChart = {
    labels: data.topCourses.map((c: any) => c.title),
    datasets: [
      {
        label: "Học viên đăng ký",
        data: data.topCourses.map((c: any) => c.students),
        backgroundColor: "#06B6D4", // Đổi sang Cyan rực rỡ, công nghệ
        borderRadius: 6,
      },
    ],
  };

  const topStudentChart = {
    labels: data.topStudents.map((s: any) => s.user),
    datasets: [
      {
        label: "Điểm số",
        data: data.topStudents.map((s: any) => s.score),
        backgroundColor: "#6366F1", // Đổi sang Tím Indigo cực sang
        borderRadius: 6,
      },
    ],
  };

  const passRateChart = {
    labels: ["Đạt (Pass)", "Trượt (Fail)"],
    datasets: [
      {
        data: [data.quizPassRate.pass, data.quizPassRate.fail],
        backgroundColor: ["#10B981", "#EF4444"], // Xanh Emerald thanh lịch & Đỏ mờ tinh tế
        borderWidth: 3,
        borderColor: "#171B2A", // Làm viền trùng màu hộp card tạo hiệu ứng đứt đoạn cao cấp
      },
    ],
  };

  const completionChart = {
    labels: ["Hoàn thành", "Chưa xong"],
    datasets: [
      {
        data: [data.courseCompletionRate.completed, data.courseCompletionRate.incomplete],
        backgroundColor: ["#38BDF8", "#F43F5E"], // Xanh Sky mượt mà & Hồng neon dịu mắt
        borderWidth: 3,
        borderColor: "#171B2A",
      },
    ],
  };

  return (
    <div className="p-6 bg-[#121624] min-h-screen text-white font-sans antialiased select-none custom-scrollbar overflow-y-auto">
      
      {/* HEADER TITLE SECTION */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
           Bảng tổng quan báo cáo
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Giám sát dữ liệu vận hành hệ thống, tỷ lệ làm bài tập và tiến trình học tập của học viên Educore
        </p>
      </div>

      {/* STATISTIC METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        {/* CARD 1: TOTAL USERS */}
        <div className="bg-[#171B2A] border border-[#22283D] p-5 rounded-2xl flex items-center justify-between shadow-sm hover:border-[#2B3454] transition duration-200">
          <div className="space-y-1">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tổng thành viên</p>
            <h2 className="text-3xl font-bold text-white font-mono">{data.totalUsers}</h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>

        {/* CARD 2: TOTAL COURSES */}
        <div className="bg-[#171B2A] border border-[#22283D] p-5 rounded-2xl flex items-center justify-between shadow-sm hover:border-[#2B3454] transition duration-200">
          <div className="space-y-1">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Khóa học hiện có</p>
            <h2 className="text-3xl font-bold text-white font-mono">{data.totalCourses}</h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.232.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>

        {/* CARD 3: TOTAL ENROLLMENTS */}
        <div className="bg-[#171B2A] border border-[#22283D] p-5 rounded-2xl flex items-center justify-between shadow-sm hover:border-[#2B3454] transition duration-200">
          <div className="space-y-1">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Lượt đăng ký học</p>
            <h2 className="text-3xl font-bold text-white font-mono">{data.totalEnrollments}</h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
        </div>

        {/* CARD 4: TOTAL QUIZ RESULTS */}
        <div className="bg-[#171B2A] border border-[#22283D] p-5 rounded-2xl flex items-center justify-between shadow-sm hover:border-[#2B3454] transition duration-200">
          <div className="space-y-1">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Lượt nộp bài quiz</p>
            <h2 className="text-3xl font-bold text-white font-mono">{data.totalQuizResults}</h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

      </div>

      {/* BAR CHARTS SECTION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* CHART: TOP COURSES BY ENROLLMENT */}
        <div className="bg-[#171B2A] border border-[#22283D] p-5 rounded-2xl shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
               Khóa học đăng ký nhiều nhất
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Xếp hạng theo tổng số lượng học viên kích hoạt khóa học</p>
          </div>
          <div className="pt-2">
            <Bar data={topCourseChart} options={chartOptions} />
          </div>
        </div>

        {/* CHART: TOP STUDENTS BY SCORE */}
        <div className="bg-[#171B2A] border border-[#22283D] p-5 rounded-2xl shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
             Học viên điểm số cao nhất
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Top những nhân tố xuất sắc đạt thành tích cao trong hệ thống</p>
          </div>
          <div className="pt-2">
            <Bar data={topStudentChart} options={chartOptions} />
          </div>
        </div>

      </div>

      {/* PIE & DOUGHNUT CHARTS SECTION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CHART: QUIZ PASS RATE */}
        <div className="bg-[#171B2A] border border-[#22283D] p-5 rounded-2xl shadow-sm flex flex-col items-center">
          <div className="w-full text-left mb-6">
            <h3 className="text-sm font-bold text-white">
               Tỷ lệ vượt qua bài kiểm tra (Quiz)
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">Tỷ lệ tương quan phần trăm giữa số lượt Đạt và Trượt bài thi</p>
          </div>
          <div className="w-[200px] h-[200px] flex items-center justify-center mb-2">
            <Pie
              data={passRateChart}
              options={{
                plugins: {
                  legend: {
                    position: "bottom" as const,
                    labels: { color: "#9ca3af", boxWidth: 12, padding: 15, font: { size: 11 } },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* CHART: COURSE COMPLETION RATE */}
        <div className="bg-[#171B2A] border border-[#22283D] p-5 rounded-2xl shadow-sm flex flex-col items-center">
          <div className="w-full text-left mb-6">
            <h3 className="text-sm font-bold text-white">
               Tỷ lệ hoàn thành khóa học
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">Đo lường lượng người học đi hết giáo trình so với tổng số đăng ký</p>
          </div>
          <div className="w-[200px] h-[200px] flex items-center justify-center mb-2">
            <Doughnut
              data={completionChart}
              options={{
                plugins: {
                  legend: {
                    position: "bottom" as const,
                    labels: { color: "#9ca3af", boxWidth: 12, padding: 15, font: { size: 11 } },
                  },
                },
              }}
            />
          </div>
        </div>

      </div>

      {/* STYLES FOR SMOOTH CUSTOM SCROLLBAR */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
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