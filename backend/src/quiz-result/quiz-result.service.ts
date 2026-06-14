import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuizResultService {
  constructor(private prisma: PrismaService) {}

  // Danh sách kết quả quiz
  findAll() {
    return this.prisma.quizResult.findMany({
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

  // Chi tiết bài làm
  async findOne(id: string) {
    const result = await this.prisma.quizResult.findUnique({
      where: { id },

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

        details: {
          include: {
            question: {
              include: {
                answers: true,
              },
            },

            answer: true,
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Quiz result not found');
    }

    return result;
  }
}