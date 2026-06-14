import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CourseProgressService {
  constructor(private prisma: PrismaService) {}

  // Danh sách tiến độ học
  findAll() {
    return this.prisma.courseProgress.findMany({
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },

        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Chi tiết tiến độ
  async findOne(id: string) {
    const progress =
      await this.prisma.courseProgress.findUnique({
        where: {
          id,
        },

        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              email: true,
            },
          },

          course: {
            include: {
              lessons: {
                where: {
                  isDeleted: false,
                },

                orderBy: {
                  createdAt: 'asc',
                },
              },
            },
          },
        },
      });

    if (!progress) {
      throw new NotFoundException(
        'Course progress not found',
      );
    }

    return progress;
  }
}