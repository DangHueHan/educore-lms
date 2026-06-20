// import { Injectable } from "@nestjs/common";
// import { PrismaService } from "../../prisma/prisma.service";
// import { Prisma } from "@prisma/client";

// @Injectable()
// export class QuizService {
//   constructor(private prisma: PrismaService) {}

//   // ======================
//   // GET QUIZ
//   // ======================
//   async getQuiz(courseId: string) {
//   return this.prisma.question.findMany({
//     where: { courseId },
//     include: {
//       answers: {
//         select: {
//           id: true,
//           text: true,
//           isCorrect: true, // thêm dòng này
//         },
//       },
//     },
//   });
// }

//   // ======================
//   // SUBMIT QUIZ
//   // ======================
//   async submitQuiz(courseId: string, body: any) {
//     const { userId, answers } = body;

//     // 1. Load questions + answers
//     const questions = await this.prisma.question.findMany({
//       where: { courseId },
//       include: {
//         answers: true,
//       },
//     });

//     // 2. Create result record first
//     const result = await this.prisma.quizResult.create({
//       data: {
//         userId,
//         courseId,
//         totalQuestions: questions.length,
//         correctAnswers: 0,
//         score: 0,
//         passed: false,
//       },
//     });

//     let correct = 0;

//     // 3. FIX TYPE (quan trọng tránh lỗi "never")
//     const details: Prisma.QuizResultDetailCreateManyInput[] = [];

//     // 4. Evaluate answers
//     for (const q of questions) {
//       const userAnswer = answers.find(
//         (a: any) => a.questionId === q.id
//       );

//       const correctAnswer = q.answers.find(
//         (a) => a.isCorrect
//       );

//       const isCorrect =
//         userAnswer?.selectedAnswerId === correctAnswer?.id;

//       if (isCorrect) correct++;

//       details.push({
//         quizResultId: result.id,
//         questionId: q.id,
//         selectedAnswerId:
//           userAnswer?.selectedAnswerId ?? null,
//         isCorrect,
//       });
//     }

//     // 5. Bulk insert details
//     await this.prisma.quizResultDetail.createMany({
//       data: details,
//     });

//     // 6. Calculate score
//     const score = Math.round(
//       (correct / questions.length) * 100
//     );

//     const passed = score >= 50;

//     // 7. Update result
//     return this.prisma.quizResult.update({
//       where: { id: result.id },
//       data: {
//         correctAnswers: correct,
//         score,
//         passed,
//       },
//     });
//   }
// }
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class QuizService {

  constructor(
    private prisma: PrismaService
  ) { }



  // ======================
  // GET QUIZ
  // ======================
  async getQuiz(
    courseId: string
  ) {

    return this.prisma.question.findMany({

      where: {
        courseId
      },

      include: {
        answers: {
          select: {
            id: true,
            text: true,
            isCorrect: true,
          }
        }
      }

    });

  }





  // ======================
  // SUBMIT QUIZ
  // ======================
  async submitQuiz(
    courseId: string,
    userId: string,
    body: any
  ) {

    const {
      answers
    } = body;



    const questions =
      await this.prisma.question.findMany({

        where: {
          courseId
        },

        include: {
          answers: true
        }

      });



    let correct = 0;



    const details:
      Prisma.QuizResultDetailCreateManyInput[]
      = [];



    for (const question of questions) {


      const userAnswer =
        answers.find(
          (a: any) =>
            a.questionId === question.id
        );



      const correctAnswer =
        question.answers.find(
          a => a.isCorrect
        );



      const selectedAnswerId =
        userAnswer?.answerId ?? null;



      const isCorrect =
        selectedAnswerId === correctAnswer?.id;



      if (isCorrect) {
        correct++;
      }



      details.push({

        questionId:
          question.id,

        selectedAnswerId,

        isCorrect,

        quizResultId: ""

      });

    }





    const score =
      Math.round(
        correct /
        questions.length *
        100
      );



    const result =
      await this.prisma.quizResult.create({

        data: {

          userId,

          courseId,

          totalQuestions:
            questions.length,

          correctAnswers:
            correct,

          score,

          passed:
            score >= 50

        }

      });





    await this.prisma.quizResultDetail.createMany({

      data:

        details.map(item => ({

          ...item,

          quizResultId:
            result.id

        }))

    });




    return result;

  }





  // ======================
  // GET RESULT
  // ======================
  async getResult(
    id: string
  ) {

    return this.prisma.quizResult.findUnique({

      where: {
        id
      },

      include: {

        course: true,


        details: {

          include: {

            question: true,

            answer: true

          }

        }

      }

    });

  }

  async getHistory(userId:string){

  return this.prisma.quizResult.findMany({

    where:{
      userId
    },

    include:{
      course:{
        select:{
          title:true,
          thumbnail:true
        }
      }

    },

    orderBy:{
      createdAt:"desc"
    }

  });

}
async getResultDetail(
  resultId:string,
  userId:string
){

 return this.prisma.quizResult.findFirst({

  where:{
    id:resultId,
    userId
  },


  include:{

    course:true,


    details:{

      include:{

        question:true,

        answer:true

      }

    }

  }


 });


}


}