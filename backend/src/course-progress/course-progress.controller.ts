// import {
//   Controller,
//   Get,
//   Param,
// } from '@nestjs/common';

// import { CourseProgressService } from './course-progress.service';

// @Controller('course-progress')
// export class CourseProgressController {
//   constructor(
//     private readonly courseProgressService: CourseProgressService,
//   ) {}

//   @Get()
//   findAll() {
//     return this.courseProgressService.findAll();
//   }

//   @Get(':id')
//   findOne(
//     @Param('id') id: string,
//   ) {
//     return this.courseProgressService.findOne(id);
//   }
// }
import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { CourseProgressService } from './course-progress.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('course-progress')
export class CourseProgressController {

  constructor(
    private readonly courseProgressService: CourseProgressService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyProgress(
    @CurrentUser() user: any,
  ) {
    return this.courseProgressService.findMyProgress(
      user.id,
    );
  }

  @Get()
  findAll() {
    return this.courseProgressService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.courseProgressService.findOne(id);
  }

}