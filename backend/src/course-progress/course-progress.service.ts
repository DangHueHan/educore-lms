
// import {
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';

// import { PrismaService } from '../../prisma/prisma.service';

// @Injectable()
// export class CourseProgressService {

//   constructor(
//     private prisma: PrismaService,
//   ) {}



//   // =========================
//   // ADMIN LIST
//   // =========================
//   async findAll() {

//     const progresses =
//       await this.prisma.courseProgress.findMany({

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

//         orderBy: {
//           createdAt: 'desc',
//         },

//       });


//     return progresses.map((item) => {

//       const lastLesson =
//         item.course.lessons.find(
//           lesson =>
//             lesson.id === item.lastLessonId,
//         );

//       return {

//         ...item,

//         lastLessonTitle:
//           lastLesson?.title ?? null,

//       };

//     });

//   }



//   // =========================
//   // ADMIN DETAIL
//   // =========================
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

//           course: true,

//         },

//       });


//     if (!progress) {
//       throw new NotFoundException(
//         'Course progress not found',
//       );
//     }



//     const lessons =
//       await this.prisma.lesson.findMany({

//         where: {
//           courseId: progress.courseId,
//           isDeleted: false,
//         },

//         orderBy: {
//           createdAt: 'asc',
//         },

//       });



//     const lessonProgresses =
//       await this.prisma.lessonProgress.findMany({

//         where: {

//           userId: progress.userId,

//           lesson: {
//             courseId: progress.courseId,
//             isDeleted: false,
//           },

//         },

//         select: {

//           lessonId: true,
//           watchedSeconds: true,
//           isCompleted: true,
//           updatedAt: true,

//         },

//       });



//     const lastLesson =
//       lessons.find(
//         lesson =>
//           lesson.id === progress.lastLessonId,
//       );



//     return {

//       ...progress,

//       course: {
//         ...progress.course,
//         lessons,
//       },

//       lastLessonTitle:
//         lastLesson?.title ?? null,

//       lessonProgresses,

//     };

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
  // USER PROGRESS
  // =========================
  // async findMyProgress(userId: string) {

  //   const progresses =
  //     await this.prisma.courseProgress.findMany({

  //       where: {
  //         userId,
  //       },

  //       include: {

  //         course: {

  //           include: {

  //             lessons: {

  //               where: {
  //                 isDeleted: false,
  //               },

  //               orderBy: {
  //                 createdAt: 'asc',
  //               },

  //             },

  //           },

  //         },

  //       },

  //       orderBy: {
  //         updatedAt: 'desc',
  //       },

  //     });



  //   return progresses.map((item) => {

  //     const lastLesson =
  //       item.course.lessons.find(
  //         lesson =>
  //           lesson.id === item.lastLessonId,
  //       );



  //     return {

  //       id: item.id,

  //       courseId: item.course.id,

  //       courseTitle: item.course.title,

  //       thumbnail: item.course.thumbnail,

  //       price: item.course.price,

  //       progressPercent:
  //         item.progressPercent,

  //       lastLessonId:
  //         item.lastLessonId,

  //       lastLessonTitle:
  //         lastLesson?.title ?? null,

  //       updatedAt:
  //         item.updatedAt,

  //     };

  //   });

  // }
async findMyProgress(userId: string) {

  const progresses =
    await this.prisma.courseProgress.findMany({

      where: {
        userId,
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

          },

        },

      },

      orderBy: {
        updatedAt: 'desc',
      },

    });



  const result = await Promise.all(

    progresses.map(async (item) => {

      const lastLesson =
        item.course.lessons.find(
          lesson =>
            lesson.id === item.lastLessonId,
        );



      const completedLessons =
        await this.prisma.lessonProgress.count({

          where: {

            userId,

            isCompleted: true,

            lesson: {
              courseId: item.course.id,
            },

          },

        });



      const totalLessons =
        item.course.lessons.length;



      let status = 'Chưa bắt đầu';

      if (
        item.progressPercent > 0 &&
        item.progressPercent < 100
      ) {
        status = 'Đang học';
      }

      if (
        item.progressPercent === 100
      ) {
        status = 'Hoàn thành';
      }



      return {

        id: item.id,

        courseId: item.course.id,

        courseTitle: item.course.title,

        thumbnail: item.course.thumbnail,

        progressPercent:
          item.progressPercent,

        totalLessons,

        completedLessons,

        status,

        lastLessonId:
          item.lastLessonId,

        lastLessonTitle:
          lastLesson?.title ?? null,

        updatedAt:
          item.updatedAt,

      };

    }),

  );



  return result;

}
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