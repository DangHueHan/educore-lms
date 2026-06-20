// import { Controller, Get, Post, Param, Body } from "@nestjs/common";
// import { QuizService } from "./quiz.service";
// import { SubmitQuizDto } from "./dto/submit-quiz.dto";

// @Controller("courses/:courseId/quiz")
// export class QuizController {
//     constructor(private readonly quizService: QuizService) { }

//     @Get()
//     getQuiz(@Param("courseId") courseId: string) {
//         console.log("COURSE ID:", courseId);
//         return this.quizService.getQuiz(courseId);
//     }

//     @Post("submit")
//     submitQuiz(
//         @Param("courseId") courseId: string,
//         @Body() body: SubmitQuizDto
//     ) {
//         return this.quizService.submitQuiz(courseId, body);
//     }
// }
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
} from "@nestjs/common";

import type { Request } from "express";

import { QuizService } from "./quiz.service";
import { SubmitQuizDto } from "./dto/submit-quiz.dto";



@Controller()
export class QuizController {


  constructor(
    private readonly quizService: QuizService
  ) {}





  // ======================
  // GET QUIZ
  // ======================
  @Get(
    "courses/:courseId/quiz"
  )
  getQuiz(

    @Param("courseId")
    courseId:string

  ){


    return this.quizService.getQuiz(
      courseId
    );

  }








  // ======================
  // SUBMIT QUIZ
  // ======================
  @Post(
    "courses/:courseId/quiz/submit"
  )
  submitQuiz(


    @Param("courseId")
    courseId:string,


    @Body()
    body:SubmitQuizDto,


    @Req()
    req:Request

  ){



    const userId =
      req.cookies.userId as string;



    return this.quizService.submitQuiz(

      courseId,

      userId,

      body

    );

  }









  // ======================
  // GET RESULT
  // ======================
  @Get(
    "quiz/result/:id"
  )
  getResult(

    @Param("id")
    id:string

  ){


    return this.quizService.getResult(
      id
    );

  }

// ======================
// GET QUIZ HISTORY
// ======================
@Get("quiz/history")
getHistory(
  @Req()
  req:Request
){

  const userId =
    req.cookies.userId as string;


  return this.quizService.getHistory(
    userId
  );

}
@Get("quiz/history/:id")
getHistoryDetail(

 @Param("id")
 id:string,


 @Req()
 req:Request

){

 const userId =
 req.cookies.userId;


 return this.quizService.getResultDetail(
   id,
   userId
 );

}


}