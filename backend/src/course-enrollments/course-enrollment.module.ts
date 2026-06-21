import { Module } from "@nestjs/common";

import { CourseEnrollmentController } from "./course-enrollment.controller";
import { CourseEnrollmentService } from "./course-enrollment.service";

import { PrismaService } from "../../prisma/prisma.service";

@Module({
  controllers: [
    CourseEnrollmentController
  ],

  providers: [
    CourseEnrollmentService,
    PrismaService
  ],
})
export class CourseEnrollmentModule {}