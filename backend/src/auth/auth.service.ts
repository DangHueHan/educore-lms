import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";
import { MailService } from "../mail/mail.service";
import { JwtService } from "@nestjs/jwt";

import { randomBytes } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private jwtService: JwtService
  ) {}

  async sendToken(email: string) {
    const token = randomBytes(32).toString("hex");

    const expires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await this.prisma.user.upsert({
      where: {
        email,
      },
      update: {
        magicToken: token,
        magicExpires: expires,
      },
      create: {
        email,
        magicToken: token,
        magicExpires: expires,
      },
    });

    await this.mailService.sendLoginToken(
      email,
      token
    );

    return {
      message: "Token sent",
    };
  }

  async verifyToken(
    email: string,
    token: string
  ) {
    const user =
      await this.prisma.user.findFirst({
        where: {
          email,
          magicToken: token,
          magicExpires: {
            gt: new Date(),
          },
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        "Invalid token"
      );
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        magicToken: null,
        magicExpires: null,
        lastLoginAt: new Date(),
      },
    });

    const jwt = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token: jwt,
      user,
    };
  }

  async getCurrentUser(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
}