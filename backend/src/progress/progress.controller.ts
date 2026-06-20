
import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
} from "@nestjs/common";

import type { Request } from "express";

import { ProgressService } from "./progress.service";

@Controller("progress")
export class ProgressController {
  constructor(
    private readonly service: ProgressService
  ) {}

  @Post("lesson")
  updateProgress(
    @Body()
    body: {
      lessonId: string;
      watchedSeconds: number;
    },

    @Req()
    req: Request
  ) {
    const userId =
      req.cookies.userId;

    return this.service.updateProgress(
      userId,
      body.lessonId,
      body.watchedSeconds
    );
  }

  @Get(":courseId")
  getProgress(
    @Param("courseId")
    courseId: string,

    @Req()
    req: Request
  ) {
    const userId =
      req.cookies.userId;

    return this.service.getProgress(
      userId,
      courseId
    );
  }
}
