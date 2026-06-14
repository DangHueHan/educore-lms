import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnswerService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  create(dto: any) {
    return this.prisma.answer.create({
      data: dto,
    });
  }

  // GET ALL (include question text)
  findAll() {
    return this.prisma.answer.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      include: {
        question: {
          select: {
            id: true,
            question: true,
          },
        },
      },
    });
  }

  // GET ONE
  async findOne(id: string) {
    const data = await this.prisma.answer.findFirst({
      where: { id, isDeleted: false },
      include: {
        question: {
          select: {
            id: true,
            question: true,
          },
        },
      },
    });

    if (!data) throw new NotFoundException('Answer not found');
    return data;
  }

  // UPDATE
  async update(id: string, dto: any) {
    await this.findOne(id);

    return this.prisma.answer.update({
      where: { id },
      data: dto,
    });
  }

  // SOFT DELETE
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.answer.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}