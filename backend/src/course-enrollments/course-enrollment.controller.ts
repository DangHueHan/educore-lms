import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Param,
} from "@nestjs/common";

import type { Request } from "express";

import { CourseEnrollmentService }
from "./course-enrollment.service";

import { CreateCourseEnrollmentDto }
from "./dto/create-course-enrollment.dto";

@Controller("course-enrollments")
export class CourseEnrollmentController {

  constructor(
    private readonly service: CourseEnrollmentService
  ) {}



  @Post()
  enroll(

    @Body()
    body: CreateCourseEnrollmentDto,

    @Req()
    req: Request

  ) {

    const userId =
      req.cookies.userId;

    return this.service.enroll(
      userId,
      body.courseId
    );

  }



  @Get("my")
  findMyCourses(

    @Req()
    req: Request

  ) {

    const userId =
      req.cookies.userId;

    return this.service.findMyCourses(
      userId
    );

  }



  @Get("check/:courseId")
  checkEnrollment(

    @Param("courseId")
    courseId: string,

    @Req()
    req: Request

  ) {

    const userId =
      req.cookies.userId;

    return this.service.checkEnrollment(
      userId,
      courseId
    );

  }

}