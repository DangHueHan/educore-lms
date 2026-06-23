import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PaymentManagementService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll() {

    return this.prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },

        course: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  }

}