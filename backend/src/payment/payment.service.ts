import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { VNPay, HashAlgorithm, ignoreLogger } from "vnpay";

@Injectable()
export class PaymentService {
  private vnpay: VNPay;

  constructor(private prisma: PrismaService) {
    this.vnpay = new VNPay({
      tmnCode: process.env.VNP_TMN_CODE!,
      secureSecret: process.env.VNP_HASH_SECRET!,
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      hashAlgorithm: HashAlgorithm.SHA512,
      loggerFn: ignoreLogger,
    });
  }

  async createPayment(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { courseCoupons: { include: { coupon: true } } },
    });

    if (!course) throw new Error("Course not found");

    const existed = await this.prisma.payment.findFirst({
      where: { userId, courseId, status: "SUCCESS" },
    });

    if (existed) return { message: "Already paid" };

    const now = new Date();
    const validCoupon = course.courseCoupons
      .map((x) => x.coupon)
      .find((c) => c.isActive && !c.isDeleted && c.quantity > c.usedCount && c.startDate <= now && c.endDate >= now);

    const originalAmount = course.price;
    let discountAmount = validCoupon ? (originalAmount * validCoupon.discountPercent) / 100 : 0;
    const amount = Math.max(0, originalAmount - discountAmount);

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        courseId,
        originalAmount,
        discountAmount,
        amount,
        couponCode: validCoupon?.code ?? null,
        status: "PENDING",
      },
    });

    const url = this.vnpay.buildPaymentUrl({
      vnp_Amount: Math.round(amount * 100),
      vnp_TxnRef: payment.id,
      vnp_OrderInfo: `Thanh toan ${course.title}`,
      vnp_ReturnUrl: process.env.VNP_RETURN_URL!,
      vnp_IpAddr: "127.0.0.1",
      vnp_CreateDate: Number(new Date().toISOString().replace(/\D/g, "").slice(0, 14)),
    });

    return { url };
  }

  async verifyPayment(query: any) {
    const verify = this.vnpay.verifyReturnUrl(query);
    if (!verify.isVerified) return { success: false };

    const payment = await this.prisma.payment.update({
      where: { id: query.vnp_TxnRef },
      data: {
        status: "SUCCESS",
        method: "VNPAY",
        transactionNo: query.vnp_TransactionNo,
        paidAt: new Date(),
      },
    });

    if (payment.couponCode) {
      await this.prisma.coupon.update({
        where: { code: payment.couponCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    await this.prisma.enrollment.upsert({
      where: { userId_courseId: { userId: payment.userId, courseId: payment.courseId } },
      update: {},
      create: { userId: payment.userId, courseId: payment.courseId },
    });

await this.prisma.courseProgress.upsert({

  where: {

    userId_courseId: {

      userId:
        payment.userId,

      courseId:
        payment.courseId

    }

  },


  update: {},


  create: {

    userId:
      payment.userId,

    courseId:
      payment.courseId,

    progressPercent:
      0

  }


});


    return { success: true };
  }

  async myPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId, status: "SUCCESS" },
      include: {
        course: { select: { id: true, title: true, thumbnail: true, price: true } },
        refundRequests: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}