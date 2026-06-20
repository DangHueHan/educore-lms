
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ProgressService {
  constructor(
    private prisma: PrismaService
  ) {}

  async updateProgress(
    userId: string,
    lessonId: string,
    watchedSeconds: number
  ) {

    // ===================== LẤY BÀI HỌC =====================
    const lesson =
      await this.prisma.lesson.findUnique({
        where: {
          id: lessonId,
        },

        include: {
          course: true,
        },
      });

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    // ===================== XÁC ĐỊNH HOÀN THÀNH =====================
    const isCompleted =
      watchedSeconds >=
      lesson.durationSeconds * 0.95;

    // ===================== LƯU TIẾN ĐỘ BÀI HỌC =====================
    await this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },

      create: {
        userId,
        lessonId,
        watchedSeconds,
        isCompleted,
      },

      update: {
        watchedSeconds,
        isCompleted,
      },
    });

    // ===================== ĐẾM TỔNG SỐ BÀI HỌC =====================
    const totalLessons =
      await this.prisma.lesson.count({
        where: {
          courseId: lesson.courseId,
          isDeleted: false,
        },
      });

    // ===================== ĐẾM SỐ BÀI ĐÃ HOÀN THÀNH =====================
    const completedLessons =
      await this.prisma.lessonProgress.count({
        where: {
          userId,
          isCompleted: true,

          lesson: {
            courseId: lesson.courseId,
          },
        },
      });

    // ===================== TÍNH % KHÓA HỌC =====================
    const progressPercent =
      totalLessons === 0
        ? 0
        : Math.round(
            (completedLessons / totalLessons) * 100
          );

    // ===================== LƯU TIẾN ĐỘ KHÓA HỌC =====================
    const courseProgress =
      await this.prisma.courseProgress.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId: lesson.courseId,
          },
        },

        create: {
          userId,
          courseId: lesson.courseId,
          lastLessonId: lessonId,
          progressPercent,
        },

        update: {
          lastLessonId: lessonId,
          progressPercent,
        },
      });

    return courseProgress;
  }

  // async getProgress(
  //   userId: string,
  //   courseId: string
  // ) {
  //   return this.prisma.courseProgress.findUnique({
  //     where: {
  //       userId_courseId: {
  //         userId,
  //         courseId,
  //       },
  //     },

  //     include: {
  //       course: true,
  //     },
  //   });
  // }

  async getProgress(
  userId: string,
  courseId: string
) {
  const progress =
    await this.prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },

      include: {
        course: {
          include: {
            lessons: {
              where: {
                isDeleted: false,
              },

              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
      },
    });

  if (!progress) {
    return null;
  }

  const lessonProgresses =
    await this.prisma.lessonProgress.findMany({
      where: {
        userId,

        lesson: {
          courseId,
        },
      },

      select: {
        lessonId: true,
        watchedSeconds: true,
        isCompleted: true,
        updatedAt: true,
      },
    });

  const lastLesson =
    progress.course.lessons.find(
      (lesson) =>
        lesson.id === progress.lastLessonId
    );

  return {
    id: progress.id,

    progressPercent:
      progress.progressPercent,

    lastLessonId:
      progress.lastLessonId,

    lastLessonTitle:
      lastLesson?.title || null,

    updatedAt:
      progress.updatedAt,

    course: progress.course,

    lessonProgresses,
  };
}
}
