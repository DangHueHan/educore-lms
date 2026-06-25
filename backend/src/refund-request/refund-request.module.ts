import { Module } from '@nestjs/common';

import { RefundRequestController } from './refund-request.controller';
import { RefundRequestService } from './refund-request.service';

import { PrismaService } from '../../prisma/prisma.service';


@Module({

  controllers: [
    RefundRequestController
  ],

  providers: [
    RefundRequestService,
    PrismaService
  ],

})

export class RefundRequestModule {}