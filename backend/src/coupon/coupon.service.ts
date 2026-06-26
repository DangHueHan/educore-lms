import {
  Injectable,
  NotFoundException
} from '@nestjs/common';


import { PrismaService } from '../../prisma/prisma.service';


import {
  CouponDto
} from './dto/coupon.dto';



@Injectable()
export class CouponService {


  constructor(
    private prisma: PrismaService,
  ) { }




  create(dto: CouponDto) {


    return this.prisma.coupon.create({

      data: {

        code: dto.code,

        discountPercent: dto.discountPercent,

        quantity: dto.quantity,

        isActive: dto.isActive ?? true,

        startDate: new Date(dto.startDate),

        endDate: new Date(dto.endDate),

      }

    });


  }





  findAll() {


    return this.prisma.coupon.findMany({

      where: {

        isDeleted: false,

      },

      include: {

        _count: {

          select: {

            courseCoupons: true

          }

        }

      },

      orderBy: {

        createdAt: 'desc'

      }

    });


  }







  async findOne(id: string) {


    const coupon =
      await this.prisma.coupon.findFirst({

        where: {

          id,

          isDeleted: false

        }

      });



    if (!coupon) {

      throw new NotFoundException(
        'Coupon not found'
      );

    }



    return coupon;

  }








  async update(
    id: string,
    dto: CouponDto
  ) {


    await this.findOne(id);



    return this.prisma.coupon.update({

      where: {
        id,
      },


      data: {

        code: dto.code,

        discountPercent: dto.discountPercent,

        quantity: dto.quantity,

        isActive: dto.isActive,

        startDate: new Date(dto.startDate),

        endDate: new Date(dto.endDate),

      }


    });


  }








  async remove(id: string) {


    await this.findOne(id);



    return this.prisma.coupon.update({

      where: {
        id
      },


      data: {

        isDeleted: true,

        deletedAt: new Date(),

      }

    });


  }









  // =======================
  // LẤY KHÓA HỌC CỦA COUPON
  // =======================

  async getCourses(
    couponId: string
  ) {


    await this.findOne(couponId);



    const data =
      await this.prisma.courseCoupon.findMany({

        where: {

          couponId

        },


        include: {

          course: true

        }

      });



    return data.map(
      (item) => item.course
    );


  }









  // =======================
  // ÁP DỤNG KHÓA HỌC
  // =======================

  async assignCourses(

    couponId: string,

    courseIds: string[]

  ) {



    await this.findOne(couponId);




    // xóa liên kết cũ

    await this.prisma.courseCoupon.deleteMany({

      where: {

        couponId

      }

    });




    // tạo liên kết mới

    if (courseIds.length) {


      await this.prisma.courseCoupon.createMany({

        data:

          courseIds.map(
            (courseId) => ({

              courseId,

              couponId

            })

          )


      });


    }




    return {

      message:
        "Áp dụng khóa học thành công"

    };


  }



}