import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}

  async create(wishlist: Wishlist): Promise<Wishlist> {
    return this.wishlistsRepository.save(wishlist);
  }

  async findOne(query: Partial<Wishlist>): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOneBy(query);
    if (!wishlist) throw new NotFoundException('Wishlist not found');
    return wishlist;
  }

  async findAll(query: Partial<Wishlist>): Promise<Wishlist[]> {
    return this.wishlistsRepository.findBy(query);
  }

  async updateOne(
    id: number,
    updateData: Partial<Wishlist>,
  ): Promise<Wishlist> {
    const existingWishlist = await this.findOne({ id });
    if (!existingWishlist) throw new NotFoundException('Wishlist not found');

    await this.wishlistsRepository.update(id, updateData);
    return this.wishlistsRepository.findOneBy({ id });
  }

  async removeOne(id: number): Promise<void> {
    const existingWishlist = await this.findOne({ id });
    if (!existingWishlist) throw new NotFoundException('Wishlist not found');

    await this.wishlistsRepository.delete(id);
  }
}
