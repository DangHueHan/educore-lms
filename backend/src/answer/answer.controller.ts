import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerDto } from './dto/answer.dto';

@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  create(@Body() dto: AnswerDto) {
    return this.answerService.create(dto);
  }

  @Get()
  findAll() {
    return this.answerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.answerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: AnswerDto) {
    return this.answerService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.answerService.remove(id);
  }
}