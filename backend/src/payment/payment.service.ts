import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

import {
  VNPay,
  HashAlgorithm,
  ignoreLogger,
} from "vnpay";


@Injectable()
export class PaymentService {


  private vnpay: VNPay;


  constructor(
    private prisma: PrismaService
  ){

    this.vnpay = new VNPay({

      tmnCode: process.env.VNP_TMN_CODE!,

      secureSecret: process.env.VNP_HASH_SECRET!,

      vnpayHost:
        "https://sandbox.vnpayment.vn",

      testMode:true,

      hashAlgorithm:
        HashAlgorithm.SHA512,

      loggerFn:
        ignoreLogger

    });

  }





  async createPayment(
    userId:string,
    courseId:string
  ){


    const course =
      await this.prisma.course.findUnique({
        where:{
          id:courseId
        }
      });


    if(!course){
      throw new Error("Course not found");
    }



    const existed =
      await this.prisma.payment.findFirst({
        where:{
          userId,
          courseId,
          status:"SUCCESS"
        }
      });



    if(existed){

      return {
        message:"Already paid"
      };

    }




    const payment =
      await this.prisma.payment.create({

        data:{

          userId,

          courseId,

          amount:
            course.price,

          status:"PENDING"

        }

      });





    const url =
      this.vnpay.buildPaymentUrl({

        vnp_Amount:
          Math.round(course.price * 100),

        vnp_TxnRef:
          payment.id,


        vnp_OrderInfo:
          `Thanh toan ${course.title}`,


        vnp_ReturnUrl:
          process.env.VNP_RETURN_URL!,


        vnp_IpAddr:
          "127.0.0.1",


        vnp_CreateDate:
          Number(
            new Date()
              .toISOString()
              .replace(/\D/g,'')
              .slice(0,14)
          )

      });



    return {
      url
    };


  }






  async verifyPayment(query:any){


    const verify =
      this.vnpay.verifyReturnUrl(query);



    if(!verify.isVerified){

      return {
        success:false
      };

    }




    const payment =
      await this.prisma.payment.update({

        where:{
          id:
          query.vnp_TxnRef
        },


        data:{

          status:"SUCCESS",

          transactionNo:
            query.vnp_TransactionNo

        }

      });





    await this.prisma.enrollment.upsert({

      where:{

        userId_courseId:{

          userId:
            payment.userId,

          courseId:
            payment.courseId

        }

      },


      update:{},


      create:{

        userId:
          payment.userId,

        courseId:
          payment.courseId

      }


    });




    return {
      success:true
    };


  }


}