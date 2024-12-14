import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { Offer } from '../offers/entities/offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, User, Offer])],
  providers: [WishesService],
  controllers: [WishesController],
  exports: [WishesService],
})
export class WishesModule {}
