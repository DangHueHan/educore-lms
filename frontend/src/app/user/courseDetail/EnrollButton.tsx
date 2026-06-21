"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = "http://localhost:3001";

type Props = {
  courseId: string;
};

export default function EnrollButton({
  courseId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const handleEnroll = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/course-enrollments`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            courseId,
          }),
        }
      );

      if (res.status === 401) {
        alert(
          "Vui lòng đăng nhập để đăng ký khóa học"
        );

        router.push("/auth");

        return;
      }

      const data =
        await res.json();

      if (!res.ok) {
        alert(
          data.message ||
            "Đăng ký thất bại"
        );

        return;
      }

      alert(
        "Đăng ký khóa học thành công"
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      alert("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full bg-[#1d4ed8] hover:bg-[#1a3fb5] text-white font-black py-3.5 rounded-full text-[16px] shadow-md transition duration-200 uppercase tracking-wide disabled:opacity-60"
    >
      {loading
        ? "Đang đăng ký..."
        : "Đăng ký học"}
    </button>
  );
}