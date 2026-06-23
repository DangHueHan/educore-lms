import { Controller, Get } from "@nestjs/common";
import { PaymentManagementService } from "./payment-management.service";

@Controller("payment-management")
export class PaymentManagementController {

  constructor(
    private readonly service: PaymentManagementService,
  ) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

}