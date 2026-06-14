import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  create(dto: any) {
    return this.prisma.question.create({
      data: dto,
    });
  }

  // GET ALL (include course name)
  findAll() {
    return this.prisma.question.findMany({
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

  // GET ONE
  async findOne(id: string) {
    const data = await this.prisma.question.findFirst({
      where: { id, isDeleted: false },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!data) throw new NotFoundException('Question not found');
    return data;
  }

  // UPDATE
  async update(id: string, dto: any) {
    await this.findOne(id);

    return this.prisma.question.update({
      where: { id },
      data: dto,
    });
  }

  // SOFT DELETE
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.question.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}