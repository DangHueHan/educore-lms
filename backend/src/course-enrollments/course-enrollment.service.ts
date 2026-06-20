import {
  Injectable,
  BadRequestException,
} from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CourseEnrollmentService {

  constructor(
    private prisma: PrismaService
  ) {}



  async enroll(
    userId: string,
    courseId: string
  ) {

    const course =
      await this.prisma.course.findUnique({

        where: {
          id: courseId
        }

      });


    if (!course) {
      throw new BadRequestException(
        "Course not found"
      );
    }



    const existed =
      await this.prisma.enrollment.findUnique({

        where: {

          userId_courseId: {
            userId,
            courseId
          }

        }

      });



    if (existed) {
      throw new BadRequestException(
        "Already enrolled"
      );
    }



    const enrollment =
      await this.prisma.enrollment.create({

        data: {

          userId,

          courseId

        }

      });



    await this.prisma.courseProgress.create({

      data: {

        userId,

        courseId,

        progressPercent: 0

      }

    });



    return enrollment;

  }



  async findMyCourses(
    userId: string
  ) {

    return this.prisma.enrollment.findMany({

      where: {
        userId
      },

      include: {

        course: true

      },

      orderBy: {

        enrolledAt: "desc"

      }

    });

  }



  async checkEnrollment(
    userId: string,
    courseId: string
  ) {

    const enrollment =
      await this.prisma.enrollment.findUnique({

        where: {

          userId_courseId: {
            userId,
            courseId
          }

        }

      });


    return {

      enrolled: !!enrollment

    };

  }

}