import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';


import {
  CouponDto,
  AssignCoursesDto,
} from './dto/coupon.dto';


import { CouponService } from './coupon.service';



@Controller('coupons')
export class CouponController {


  constructor(
    private readonly service: CouponService,
  ) {}



  @Post()
  create(
    @Body() dto: CouponDto,
  ) {

    return this.service.create(dto);

  }



  @Get()
  findAll() {

    return this.service.findAll();

  }



  @Get(':id')
  findOne(
    @Param('id') id:string,
  ) {

    return this.service.findOne(id);

  }



  @Patch(':id')
  update(
    @Param('id') id:string,
    @Body() dto:CouponDto,
  ) {

    return this.service.update(
      id,
      dto
    );

  }



  @Delete(':id')
  remove(
    @Param('id') id:string,
  ) {

    return this.service.remove(id);

  }




  // lấy khóa học đang áp dụng coupon

  @Get(':id/courses')
  getCourses(
    @Param('id') id:string,
  ){

    return this.service.getCourses(id);

  }





  // gán khóa học cho coupon

  @Post(':id/courses')
  assignCourses(
    @Param('id') id:string,
    @Body() dto:AssignCoursesDto,
  ){

    return this.service.assignCourses(
      id,
      dto.courseIds
    );

  }


}