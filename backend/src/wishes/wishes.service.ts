import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { Offer } from '../offers/entities/offer.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
  ) { }

  async create(wish: Partial<Wish>, userId: number): Promise<Wish> {
    const newWish = this.wishesRepository.create({
      ...wish,
      owner: { id: userId },
    });
    return this.wishesRepository.save(newWish);
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
    if (!wish) throw new NotFoundException('Wish not found');
    return wish;
  }

  async findAll(query: Partial<Wish>): Promise<Wish[]> {
    return this.wishesRepository.find({
      where: query,
      relations: ['owner', 'offers'],
    });
  }

  async updateOne(id: string, updateData: Partial<Wish>, userId: number): Promise<Wish> {
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    const numericId = parseInt(id.toString(), 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID');
    }

    const wish = await this.wishesRepository.findOne({
      where: { id: numericId },
      relations: ['owner', 'offers'],
    });

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Not allowed to edit this wish');
    }

    if (updateData.price !== undefined && wish.offers.length > 0) {
      throw new ForbiddenException('Cannot change price when offers exist');
    }

    Object.assign(wish, updateData);
    return this.wishesRepository.save(wish);
  }

  async copyWish(id: string, userId: number): Promise<Wish> {
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    const numericId = parseInt(id.toString(), 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID');
    }

    const wish = await this.wishesRepository.findOne({
      where: { id: numericId },
      relations: ['owner'],
    });

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    const newWish = this.wishesRepository.create({
      ...wish,
      id: undefined, 
      owner: await this.usersRepository.findOneBy({ id: userId }), 
      offers: [],
    });

    return this.wishesRepository.save(newWish);
  }

  async removeOne(id: number, userId: number): Promise<void> {
    const wish = await this.findOne(id);
    if (wish.owner.id !== userId)
      throw new ForbiddenException('Not allowed to delete this wish');
    await this.wishesRepository.remove(wish);
  }
}
