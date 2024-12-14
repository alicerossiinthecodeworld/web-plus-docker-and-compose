import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  private checkTotalAmount(existingOffers: Offer[], offerData: Partial<Offer>, wish: any) {
    const totalAmount = existingOffers.reduce(
      (sum, offer) => sum + offer.amount,
      0,
    );

    if (totalAmount + (offerData.amount ?? 0) > wish.price) {
      throw new BadRequestException(
        'Offer amount exceeds the remaining needed amount',
      );
    }
    return totalAmount;
  }

  private checkWish(wish: any, userId: number) {
    if (!wish) {
      throw new BadRequestException('Wish not found');
    }
    if (wish.owner.id === userId) {
      throw new ForbiddenException('Cannot donate to your own wish');
    }
  }

  private checkAuth(userId: number) {
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }
  }

  private async findWish(wishId: number) {
    if (!wishId) {
      throw new BadRequestException('Invalid wish ID');
    }

    const wish = await this.wishesService.findOne(wishId);
    return wish;
  }

  private async findOffer (wishId) {
    const data = await this.offersRepository.find({
      where: { item: { id: wishId } },
    });
    return data
  }

  async createOffer(offerData: Partial<Offer>, userId: number): Promise<Offer> {
    this.checkAuth(userId);

    const wishId = offerData.item?.id;
    const wish = await this.findWish(wishId);

    this.checkWish(wish, userId);

    const existingOffers = await this.findOffer(wishId)

    this.checkTotalAmount(existingOffers, offerData, wish);

    await this.wishesService.updateOne(String(wishId), { 
      raised: Number(wish.raised) + (offerData.amount ?? 0), 
    }, userId);


    const newOffer = this.offersRepository.create({
      user: { id: userId } as User,
      item: wish,
      amount: offerData.amount,
      hidden: offerData.hidden,
    } as Offer);

    return this.offersRepository.save(newOffer);
  }

  create(offer: Offer): Promise<Offer> {
    return this.offersRepository.save(offer);
  }

  findOne(query: Partial<Offer>): Promise<Offer> {
    return this.offersRepository.findOneBy(query);
  }

  findAll(query: Partial<Offer>): Promise<Offer[]> {
    return this.offersRepository.findBy(query);
  }

  async updateOne(id: number, updateData: Partial<Offer>): Promise<Offer> {
    await this.offersRepository.update(id, updateData);
    return this.offersRepository.findOneBy({ id });
  }

  async removeOne(id: number): Promise<void> {
    await this.offersRepository.delete(id);
  }
}
