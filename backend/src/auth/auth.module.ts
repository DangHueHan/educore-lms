import { Module } from "@nestjs/common";

import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { MailModule } from "../mail/mail.module";

import { PrismaService } from "../../prisma/prisma.service";

import { JwtStrategy } from "../common/strategies/jwt.strategy";

@Module({
  imports: [
    MailModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: "1d",
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
  ],

  exports: [AuthService],
})
export class AuthModule {}