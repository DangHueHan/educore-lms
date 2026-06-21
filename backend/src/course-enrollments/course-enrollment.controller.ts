import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Param,
  UnauthorizedException,
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



  // =========================
  // ĐĂNG KÝ KHÓA HỌC
  // POST /course-enrollments
  // =========================
  @Post()
  enroll(

    @Body()
    body: CreateCourseEnrollmentDto,

    @Req()
    req: Request

  ) {

    const userId =
      req.cookies.userId;

    if (!userId) {
      throw new UnauthorizedException(
        "Please login first"
      );
    }

    return this.service.enroll(
      userId,
      body.courseId
    );

  }



  // =========================
  // KHÓA HỌC CỦA TÔI
  // GET /course-enrollments/my
  // =========================
  @Get("my")
  findMyCourses(

    @Req()
    req: Request

  ) {

    const userId =
      req.cookies.userId;

    if (!userId) {
      throw new UnauthorizedException(
        "Please login first"
      );
    }

    return this.service.findMyCourses(
      userId
    );

  }



  // =========================
  // CHECK ĐÃ ĐĂNG KÝ CHƯA
  // GET /course-enrollments/check/:courseId
  // =========================
  @Get("check/:courseId")
  checkEnrollment(

    @Param("courseId")
    courseId: string,

    @Req()
    req: Request

  ) {

    const userId =
      req.cookies.userId;

    if (!userId) {
      return {
        enrolled: false,
      };
    }

    return this.service.checkEnrollment(
      userId,
      courseId
    );

  }

}