// import { Controller, Get } from '@nestjs/common';
// import { EnrollmentService } from './enrollment.service';

// @Controller('enrollments')
// export class EnrollmentController {
//   constructor(
//     private readonly enrollmentService: EnrollmentService,
//   ) {}

//   @Get()
//   findAll() {
//     return this.enrollmentService.findAll();
//   }
// }
import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { EnrollmentService } from './enrollment.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('enrollments')
export class EnrollmentController {

  constructor(
    private readonly enrollmentService: EnrollmentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyCourses(
    @CurrentUser() user: any,
  ) {
    return this.enrollmentService.findMyCourses(
      user.id,
    );
  }

  @Get()
  findAll() {
    return this.enrollmentService.findAll();
  }
}