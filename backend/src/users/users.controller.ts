import {
  Controller,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  Logger,
  Patch,
  Query,
  BadRequestException,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const userId = req.user.id;
    return this.usersService.findOne({ id: userId });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.userId;
    if (updateUserDto.password) {
      updateUserDto.password = await this.authService.hashPassword(
        updateUserDto.password,
      );
    }
    return this.usersService.updateOne(userId, updateUserDto);
  }

  @Get('search')
  async searchUsers(@Query('q') searchTerm: string) {
    if (!searchTerm) {
      throw new BadRequestException('Search term is required');
    }
    const result = await this.usersService.findMany(searchTerm);
    return result;
  }

  @Get(':id')
  async getUserProfile(@Param('id') id: number) {
    return this.usersService.findOne({ id });
  }
}
