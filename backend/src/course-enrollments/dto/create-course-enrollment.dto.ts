import {
  IsString,
  IsNotEmpty,
} from "class-validator";

export class CreateCourseEnrollmentDto {

  @IsString()
  @IsNotEmpty()
  courseId: string;

}