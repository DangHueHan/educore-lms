import {
  IsNotEmpty,
  IsString,
} from "class-validator";

export class CreateCourseEnrollmentDto {

  @IsString()
  @IsNotEmpty()
  courseId: string;

}