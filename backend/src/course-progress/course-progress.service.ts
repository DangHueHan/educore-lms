// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../../prisma/prisma.service';

// @Injectable()
// export class CourseProgressService {
//   constructor(private prisma: PrismaService) {}

//   // Danh sách tiến độ học
//   findAll() {
//     return this.prisma.courseProgress.findMany({
//       include: {
//         user: {
//           select: {
//             id: true,
//             displayName: true,
//             email: true,
//           },
//         },

//         course: {
//           select: {
//             id: true,
//             title: true,
//           },
//         },
//       },

//       orderBy: {
//         createdAt: 'desc',
//       },
//     });
//   }

//   // Chi tiết tiến độ
//   async findOne(id: string) {
//     const progress =
//       await this.prisma.courseProgress.findUnique({
//         where: {
//           id,
//         },

//         include: {
//           user: {
//             select: {
//               id: true,
//               displayName: true,
//               email: true,
//             },
//           },

//           course: {
//             include: {
//               lessons: {
//                 where: {
//                   isDeleted: false,
//                 },

//                 orderBy: {
//                   createdAt: 'asc',
//                 },
//               },
//             },
//           },
//         },
//       });

//     if (!progress) {
//       throw new NotFoundException(
//         'Course progress not found',
//       );
//     }

//     return progress;
//   }
// }
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CourseProgressService {

  constructor(
    private prisma: PrismaService,
  ) {}



  // =========================
  // ADMIN LIST
  // =========================
  async findAll() {

    const progresses =
      await this.prisma.courseProgress.findMany({

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

        orderBy: {
          createdAt: 'desc',
        },

      });


    return progresses.map((item) => {

      const lastLesson =
        item.course.lessons.find(
          lesson =>
            lesson.id === item.lastLessonId,
        );

      return {

        ...item,

        lastLessonTitle:
          lastLesson?.title ?? null,

      };

    });

  }



  // =========================
  // ADMIN DETAIL
  // =========================
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

          course: true,

        },

      });


    if (!progress) {
      throw new NotFoundException(
        'Course progress not found',
      );
    }



    const lessons =
      await this.prisma.lesson.findMany({

        where: {
          courseId: progress.courseId,
          isDeleted: false,
        },

        orderBy: {
          createdAt: 'asc',
        },

      });



    const lessonProgresses =
      await this.prisma.lessonProgress.findMany({

        where: {

          userId: progress.userId,

          lesson: {
            courseId: progress.courseId,
            isDeleted: false,
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
      lessons.find(
        lesson =>
          lesson.id === progress.lastLessonId,
      );



    return {

      ...progress,

      course: {
        ...progress.course,
        lessons,
      },

      lastLessonTitle:
        lastLesson?.title ?? null,

      lessonProgresses,

    };

  }

}