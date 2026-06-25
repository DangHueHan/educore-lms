import {
 Controller,
 Post,
 Get,
 Patch,
 Body,
 Param,
 Query
} from "@nestjs/common";


import { RefundRequestService } from "./refund-request.service";

import { CreateRefundRequestDto } from "./dto/create-refund-request.dto";



@Controller("refund-request")
export class RefundRequestController{



constructor(
 private service:RefundRequestService
){}






// user gửi yêu cầu

@Post()
create(
 @Body() dto:CreateRefundRequestDto
){

 return this.service.create(dto);

}






// admin xem tất cả

@Get()
findAll(){

 return this.service.findAll();

}







// user xem trạng thái

@Get("user/:userId")
findByUser(
 @Param("userId") userId:string
){

 return this.service.findByUser(userId);

}







// approve

@Patch(":id/approve")
approve(

 @Param("id") id:string,

 @Body("adminNote") adminNote:string

){


 return this.service.approve(
  id,
  adminNote
 );

}







// reject

@Patch(":id/reject")
reject(

 @Param("id") id:string,

 @Body("adminNote") adminNote:string

){


 return this.service.reject(
  id,
  adminNote
 );

}




}