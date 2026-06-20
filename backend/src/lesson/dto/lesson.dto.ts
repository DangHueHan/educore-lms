export class LessonDto {
  title: string;
  description?: string;
  videoUrl: string;
  courseId: string;

// ===== THÊM MỚI =====
  // thời lượng video tính bằng giây
  durationSeconds: number;
}