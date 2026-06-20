export class SubmitQuizDto {
  userId: string;

  answers: {
    questionId: string;
    selectedAnswerId: string | null;
  }[];
}