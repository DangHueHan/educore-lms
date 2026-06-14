import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';

import { CourseProgressService } from './course-progress.service';

@Controller('course-progress')
export class CourseProgressController {
  constructor(
    private readonly courseProgressService: CourseProgressService,
  ) {}

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