import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WishlistsService } from './wishlists.service';
import { Wishlist } from './entities/wishlist.entity';
import { User } from 'src/users/entities/user.entity';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() wishlistData: Partial<Wishlist>, @Req() req: any) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User not authenticated');
    }
    const user: User = { id: req.user.userId } as User;
    const newWishlist: Wishlist = {
      ...wishlistData,
      owner: user,
      id: wishlistData.id ?? 0,
    } as Wishlist;

    return this.wishlistsService.create(newWishlist);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID');
    }
    return this.wishlistsService.findOne({ id: numericId });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Body() query: Partial<Wishlist>) {
    return this.wishlistsService.findAll(query);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Param('id') id: number,
    @Body() updateData: Partial<Wishlist>,
    @Req() req: any,
  ) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User not authenticated');
    }
    return this.wishlistsService.updateOne(id, {
      ...updateData,
      owner: req.user,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeOne(@Param('id') id: number, @Req() req: any) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User not authenticated');
    }
    return this.wishlistsService.removeOne(id);
  }
}
