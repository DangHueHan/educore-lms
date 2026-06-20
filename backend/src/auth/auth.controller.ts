import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";

import type { Response } from "express";

import { AuthService } from "./auth.service";
import { SendTokenDto } from "./dto/send-magic-link.dto";

import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  // Gửi magic token qua email
  @Post("send-token")
  async sendToken(
    @Body() body: SendTokenDto
  ) {
    return this.authService.sendToken(
      body.email
    );
  }


  // Verify token + tạo cookie login
  @Post("verify-token")
  async verifyToken(
    @Body()
    body: {
      email: string;
      token: string;
    },

    @Res({ passthrough: true })
    res: Response
  ) {

    const result =
      await this.authService.verifyToken(
        body.email,
        body.token
      );


    // Cookie chứa JWT
    res.cookie(
      "token",
      result.token,
      {
        httpOnly: true,
        maxAge:
          24 * 60 * 60 * 1000,
        sameSite: "lax",
      }
    );


    // Cookie chứa id user
    res.cookie(
      "userId",
      result.user.id,
      {
        httpOnly: false,
        maxAge:
          24 * 60 * 60 * 1000,
        sameSite: "lax",
      }
    );


   

    return {
      user: result.user,
    };
  }



  // Lấy user hiện tại từ JWT
  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(
    @CurrentUser() user: any
  ) {

    console.log(
      "CURRENT USER ID:",
      user.id
    );


    return this.authService.getCurrentUser(
      user.id
    );
  }



  // Logout
  @Post("logout")
  logout(
    @Res({ passthrough: true })
    res: Response
  ) {

    res.clearCookie(
      "token"
    );

    res.clearCookie(
      "userId"
    );


    return {
      message:
        "Logged out",
    };
  }
}