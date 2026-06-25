import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateRefundRequestDto } from "./dto/create-refund-request.dto";


@Injectable()
export class RefundRequestService {


  constructor(
    private prisma: PrismaService
  ) { }





  // USER tạo yêu cầu hoàn tiền
  async create(
    dto: CreateRefundRequestDto
  ) {


    return this.prisma.refundRequest.create({

      data: {

        paymentId: dto.paymentId,

        reason: dto.reason,

        status: "PENDING"

      }

    });


  }





  // ADMIN lấy danh sách refund

  async findAll() {


    return this.prisma.refundRequest.findMany({


      include: {


        payment: {


          include: {


            user: true,


            course: true


          }


        }


      },


      orderBy: {


        createdAt: "desc"


      }


    });


  }







  // ADMIN duyệt

  async approve(
    id: string,
    adminNote?: string
  ) {


    return this.prisma.refundRequest.update({


      where: {

        id

      },


      data: {


        status: "APPROVED",

        adminNote


      }


    });



  }








  // ADMIN từ chối


  async reject(
    id: string,
    adminNote?: string
  ) {


    return this.prisma.refundRequest.update({


      where: {

        id

      },


      data: {


        status: "REJECTED",

        adminNote


      }


    });


  }







  // USER xem refund của mình

  async findByUser(
    userId: string
  ) {


    return this.prisma.refundRequest.findMany({


      where: {


        payment: {


          userId: userId


        }


      },


      include: {


        payment: {


          include: {


            course: true


          }


        }


      }


    });


  }



}