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
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { WishlistList } from './entities/wishlistlist.entity';
import { WishlistListsService } from './wishlistlists.service';

@Controller('wishlistlists')
export class WishlistListsController {
  constructor(private readonly wishlistListsService: WishlistListsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() wishlistListData: Partial<WishlistList>,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    const newWishlistList = await this.wishlistListsService.create({
      ...wishlistListData,
      owner: { id: userId } as User,
    });
    return newWishlistList;
  }

  @Get()
  async findAll() {
    return this.wishlistListsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const wishlistList = await this.wishlistListsService.findOne(id);
    if (!wishlistList) {
      throw new NotFoundException('WishlistList not found');
    }
    return wishlistList;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateData: Partial<WishlistList>,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    const updatedWishlistList = await this.wishlistListsService.update(
      id,
      updateData,
      { id: userId } as User,
    );
    return updatedWishlistList;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: any) {
    const userId = req.user.userId;
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    await this.wishlistListsService.remove(id, { id: userId } as User);
    return { message: 'WishlistList deleted successfully' };
  }
}
