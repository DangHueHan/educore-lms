import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) { }

  // ================= CREATE =================
  create(dto: any) {
    return this.prisma.lesson.create({
      data: dto,
    });
  }

  // ================= GET ALL (FIX COURSE INCLUDE) =================
  findAll() {
    return this.prisma.lesson.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },

      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  // ================= GET ONE =================
  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  // ================= UPDATE =================
  async update(id: string, dto: any) {
    await this.findOne(id);

    return this.prisma.lesson.update({
      where: { id },
      data: dto,
    });
  }

  // ================= SOFT DELETE =================
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.lesson.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}