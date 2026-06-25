import { IsNotEmpty, IsString } from "class-validator";


export class CreateRefundRequestDto {


  @IsString()
  @IsNotEmpty()
  paymentId:string;



  @IsString()
  @IsNotEmpty()
  reason:string;


}