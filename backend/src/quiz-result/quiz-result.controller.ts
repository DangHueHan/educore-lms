import { Controller, Get, Param } from '@nestjs/common';
import { QuizResultService } from './quiz-result.service';

@Controller('quiz-results')
export class QuizResultController {
  constructor(
    private readonly quizResultService: QuizResultService,
  ) {}

  @Get()
  findAll() {
    return this.quizResultService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizResultService.findOne(id);
  }
}