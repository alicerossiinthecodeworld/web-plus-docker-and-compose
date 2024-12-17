// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { WishlistListsModule } from './wishlistslists/wishlistlists.module';
import { Offer } from './offers/entities/offer.entity';
import { WishlistList } from './wishlistslists/entities/wishlistlist.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'), 
        port: configService.get<number>('POSTGRES_PORT') || 5432, 
        username: configService.get<string>('POSTGRES_USER'), 
        password: configService.get<string>('POSTGRES_PASSWORD'), 
        database: configService.get<string>('POSTGRES_DB'),
        entities: [User, Wish, Wishlist, Offer, WishlistList],
        synchronize: true,
      }),
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
    WishlistListsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
