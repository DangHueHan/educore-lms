import {
  Controller,
  Post,
  Get,
  Res,
  Body,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";

import type { Response } from "express";

import { PaymentService } from "./payment.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("payment")
export class PaymentController {

  constructor(
    private paymentService: PaymentService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post("create")
  create(
    @Body()
    body: {
      courseId: string;
    },

    @Req() req: any
  ) {

    return this.paymentService.createPayment(
      req.user.id,
      body.courseId
    );

  }

  @Get("vnpay-return")
  async vnpayReturn(
    @Query() query: any,
    @Res() res: Response
  ) {

    const result =
      await this.paymentService.verifyPayment(
        query
      );

    if (result.success) {

      return res.redirect(
        "http://localhost:3000/user/payment-success"
      );

    }

    return res.redirect(
      "http://localhost:3000/user/payment-failed"
    );

  }

}