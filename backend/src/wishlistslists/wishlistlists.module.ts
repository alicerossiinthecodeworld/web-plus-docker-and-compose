import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { WishlistList } from './entities/wishlistlist.entity';
import { WishlistListsController } from './wishlistlists.controller';
import { WishlistListsService } from './wishlistlists.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, WishlistList])],
  controllers: [WishlistListsController],
  providers: [WishlistListsService],
})
export class WishlistModule {}
