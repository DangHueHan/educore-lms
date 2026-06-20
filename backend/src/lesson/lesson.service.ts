// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../../prisma/prisma.service';

// @Injectable()
// export class LessonService {
//   constructor(private prisma: PrismaService) { }

//   // ================= CREATE =================
//   create(dto: any) {
//     return this.prisma.lesson.create({
//       data: dto,
//     });
//   }

//   // ================= GET ALL (FIX COURSE INCLUDE) =================
//   findAll() {
//     return this.prisma.lesson.findMany({
//       where: { isDeleted: false },
//       orderBy: { createdAt: 'desc' },

//       include: {
//         course: {
//           select: {
//             id: true,
//             title: true,
//           },
//         },
//       },
//     });
//   }
//   async findOne(id: string) {
//   const lesson = await this.prisma.lesson.findFirst({
//     where: {
//       id,
//       isDeleted: false,
//     },

//     include: {
//       course: {
//         include: {
//           lessons: {
//             where: {
//               isDeleted: false,
//             },
//             orderBy: {
//               createdAt: 'asc',
//             },
//           },

//           enrollments: {
//             include: {
//               user: true,
//             },
//           },

//           questions: {
//             where: {
//               isDeleted: false,
//             },
//             include: {
//               answers: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   if (!lesson) {
//     throw new NotFoundException('Lesson not found');
//   }

//   return lesson;
// }

//   // ================= UPDATE =================
//   async update(id: string, dto: any) {
//     await this.findOne(id);

//     return this.prisma.lesson.update({
//       where: { id },
//       data: dto,
//     });
//   }

//   // ================= SOFT DELETE =================
//   async remove(id: string) {
//     await this.findOne(id);

//     return this.prisma.lesson.update({
//       where: { id },
//       data: {
//         isDeleted: true,
//         deletedAt: new Date(),
//       },
//     });
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  // ================= CREATE =================
  create(dto: any) {
    return this.prisma.lesson.create({
      data: {
        title: dto.title,
        description: dto.description,
        videoUrl: dto.videoUrl,
        courseId: dto.courseId,

        // ===== THÊM MỚI =====
        // thời lượng video (giây)
        durationSeconds: dto.durationSeconds ?? 0,
      },
    });
  }

  // ================= GET ALL =================
  findAll() {
    return this.prisma.lesson.findMany({
      where: { isDeleted: false },

      orderBy: {
        createdAt: 'desc',
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
          include: {
            lessons: {
              where: {
                isDeleted: false,
              },

              orderBy: {
                createdAt: 'asc',
              },
            },

            enrollments: {
              include: {
                user: true,
              },
            },

            questions: {
              where: {
                isDeleted: false,
              },

              include: {
                answers: true,
              },
            },
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

      data: {
        title: dto.title,
        description: dto.description,
        videoUrl: dto.videoUrl,

        // ===== THÊM MỚI =====
        // cập nhật thời lượng video
        durationSeconds: dto.durationSeconds,
      },
    });
  }

  // ================= SOFT DELETE =================
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.lesson.update({
      where: {
        id,
      },

      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}