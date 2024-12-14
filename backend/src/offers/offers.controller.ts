import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() offerData: Partial<Offer>, @Req() req: any) {
    const userId = req.user.id;
    return this.offersService.createOffer(offerData, userId);
  }
}
