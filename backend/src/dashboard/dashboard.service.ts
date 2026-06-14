import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getReport() {
    // =====================
    // TOTAL
    // =====================

    const totalUsers =
      await this.prisma.user.count({
        where: {
          isDeleted: false,
        },
      });

    const totalCourses =
      await this.prisma.course.count({
        where: {
          isDeleted: false,
        },
      });

    const totalEnrollments =
      await this.prisma.enrollment.count();

    const totalQuizResults =
      await this.prisma.quizResult.count();

    // =====================
    // TOP COURSES
    // =====================

    const courses =
      await this.prisma.course.findMany({
        where: {
          isDeleted: false,
        },

        include: {
          enrollments: true,
        },
      });

    const topCourses = courses
      .map((course) => ({
        id: course.id,
        title: course.title,
        students:
          course.enrollments.length,
      }))
      .sort(
        (a, b) =>
          b.students - a.students,
      )
      .slice(0, 5);

    // =====================
    // TOP STUDENTS
    // =====================

    const results =
      await this.prisma.quizResult.findMany({
        include: {
          user: true,
          course: true,
        },
      });

    const topStudents = results
      .sort(
        (a, b) =>
          b.score - a.score,
      )
      .slice(0, 5)
      .map((item) => ({
        user:
          item.user.displayName ||
          item.user.email,

        course:
          item.course.title,

        score:
          item.score,
      }));

    // =====================
    // PASS RATE
    // =====================

    const passCount =
      await this.prisma.quizResult.count({
        where: {
          passed: true,
        },
      });

    const failCount =
      await this.prisma.quizResult.count({
        where: {
          passed: false,
        },
      });

    // =====================
    // COURSE COMPLETION
    // =====================

    const completed =
      await this.prisma.courseProgress.count({
        where: {
          progressPercent: 100,
        },
      });

    const incomplete =
      await this.prisma.courseProgress.count({
        where: {
          progressPercent: {
            lt: 100,
          },
        },
      });

    return {
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalQuizResults,

      topCourses,

      topStudents,

      quizPassRate: {
        pass: passCount,
        fail: failCount,
      },

      courseCompletionRate: {
        completed,
        incomplete,
      },
    };
  }
}