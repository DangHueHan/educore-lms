import { Module } from '@nestjs/common';

import { PaymentManagementController } from './payment-management.controller';
import { PaymentManagementService } from './payment-management.service';

import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PaymentManagementController],
  providers: [PaymentManagementService, PrismaService],
})
export class PaymentManagementModule {}