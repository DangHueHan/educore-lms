import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EnrollmentService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async findMyCourses(userId: string) {

    const courses = await this.prisma.course.findMany({

      where: {
        isDeleted: false,
      },

      include: {

        // Khóa học miễn phí đã đăng ký
        enrollments: {
          where: {
            userId,
          },
        },

        // Khóa học trả phí đã mua
        payments: {
          where: {
            userId,
            status: 'SUCCESS',
          },
        },

        // Tiến độ học
        progress: {
          where: {
            userId,
          },
        },

      },

    });

    return courses

      .filter((course) => {

        const enrolled =
          course.enrollments.length > 0;

        const bought =
          course.payments.length > 0;

        return enrolled || bought;

      })

      .map((course) => {

        const payment =
          course.payments[0];

        const progress =
          course.progress[0];

        return {

          id: course.id,

          title: course.title,

          description: course.description,

          thumbnail: course.thumbnail,

          price: course.price,

          isFree:
            course.price === 0,

          progressPercent:
            progress?.progressPercent ?? 0,

          lastLessonId:
            progress?.lastLessonId ?? null,

          purchaseInfo:
            payment
              ? {
                  originalAmount:
                    payment.originalAmount,

                  discountAmount:
                    payment.discountAmount,

                  paidAmount:
                    payment.amount,

                  paidAt:
                    payment.paidAt,
                }
              : null,

        };

      });

  }

  findAll() {

    return this.prisma.enrollment.findMany({

      include: {

        user: {
          select: {
            displayName: true,
            email: true,
          },
        },

        course: {
          select: {
            title: true,
          },
        },

      },

      orderBy: {
        enrolledAt: 'desc',
      },

    });

  }

}