import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { Wish } from './entities/wish.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() wishData: Partial<Wish>, @Req() req: any) {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('User not authenticated');
    }
    return this.wishesService.create(wishData, req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID');
    }
    return this.wishesService.findOne(numericId);
  }

  @Get()
  async findAll(@Body() query: Partial<Wish>) {
    return this.wishesService.findAll(query);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateData: Partial<Wish>,
    @Req() req: any,
  ) {
    return this.wishesService.updateOne(id, updateData, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeOne(@Param('id') id: number, @Req() req: any) {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('User not authenticated');
    }
    return this.wishesService.removeOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copyWish(@Param('id') id: string, @Req() req: any) {
    return this.wishesService.copyWish(id, req.user.userId);
  }
}
