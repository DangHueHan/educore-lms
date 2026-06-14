import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id/role')
  updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.userService.updateRole(id, dto);
  }

  @Patch(':id/lock')
  lock(@Param('id') id: string) {
    return this.userService.lock(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.userService.restore(id);
  }
}