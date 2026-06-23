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

import { QuizController } from './quiz/quiz.controller';
import { QuizService } from './quiz/quiz.service';

import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

import { ProgressController } from './progress/progress.controller';
import { ProgressService } from './progress/progress.service';

import { CourseEnrollmentService } from './course-enrollments/course-enrollment.service';
import { CourseEnrollmentController } from './course-enrollments/course-enrollment.controller';

import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';

import { CouponController } from './coupon/coupon.controller';
import { CouponService } from './coupon/coupon.service';

import { PaymentManagementController } from './payment-management/payment-management.controller';
import { PaymentManagementService } from './payment-management/payment-management.service';

import { UploadController } from './upload/upload.controller';

import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    MailModule,
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
    QuizController,
    ProgressController,
    CourseEnrollmentController,
    PaymentController,
    CouponController,
    PaymentManagementController,
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
    QuizService,
    ProgressService,
    CourseEnrollmentService,
    PaymentService,
    CouponService,
    PaymentManagementService,
  ],
})
export class AppModule { }