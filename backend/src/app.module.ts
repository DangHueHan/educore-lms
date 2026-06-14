import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CourseController } from './course/course.controller';
import { CourseService } from './course/course.service';

import { LessonController } from './lesson/lesson.controller';
import { LessonService } from './lesson/lesson.service';

import { QuestionController } from './question/question.controller';
import { QuestionService } from './question/question.service';

import { AnswerController } from './answer/answer.controller';
import { AnswerService } from './answer/answer.service';

import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

import { EnrollmentController } from './enrollment/enrollment.controller';
import { EnrollmentService } from './enrollment/enrollment.service';

import { QuizResultController } from './quiz-result/quiz-result.controller';
import { QuizResultService } from './quiz-result/quiz-result.service';

import { CourseProgressController } from './course-progress/course-progress.controller';
import { CourseProgressService } from './course-progress/course-progress.service';

import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';

import { UploadController } from './upload/upload.controller';

import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],

  controllers: [
    AppController,
    CourseController,
    LessonController,   
    UploadController,
    QuestionController,
    AnswerController,
    UserController, 
    EnrollmentController,
    QuizResultController, 
    CourseProgressController,
    DashboardController,
  ],

  providers: [
    AppService,
    CourseService,
    LessonService,     
    PrismaService,
    QuestionService,
    AnswerService,
    UserService,
    EnrollmentService,
    QuizResultService,
    CourseProgressService,
    DashboardService,
  ],
})
export class AppModule { }