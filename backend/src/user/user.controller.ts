// import {
//   Controller,
//   Get,
//   Patch,
//   Param,
//   Body,
// } from '@nestjs/common';

// import { UserService } from './user.service';
// import { UpdateRoleDto } from './dto/update-role.dto';

// @Controller('users')
// export class UserController {
//   constructor(
//     private readonly userService: UserService,
//   ) {}

//   @Get()
//   findAll() {
//     return this.userService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.userService.findOne(id);
//   }

//   @Patch(':id/role')
//   updateRole(
//     @Param('id') id: string,
//     @Body() dto: UpdateRoleDto,
//   ) {
//     return this.userService.updateRole(id, dto);
//   }

//   @Patch(':id/lock')
//   lock(@Param('id') id: string) {
//     return this.userService.lock(id);
//   }

//   @Patch(':id/restore')
//   restore(@Param('id') id: string) {
//     return this.userService.restore(id);
//   }
// }
import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';

import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) { }

  // ===========================
  // USER
  // ===========================

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(
    @CurrentUser() user: any,
  ) {
    return this.userService.findOne(
      user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(
      user.id,
      dto,
    );
  }

  // ===========================
  // ADMIN
  // ===========================

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.userService.findOne(id);
  }

  @Patch(':id/role')
  updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.userService.updateRole(
      id,
      dto,
    );
  }

  @Patch(':id/lock')
  lock(
    @Param('id') id: string,
  ) {
    return this.userService.lock(id);
  }

  @Patch(':id/restore')
  restore(
    @Param('id') id: string,
  ) {
    return this.userService.restore(id);
  }

}