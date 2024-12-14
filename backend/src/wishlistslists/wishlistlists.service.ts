import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WishlistList } from './entities/wishlistlist.entity';

@Injectable()
export class WishlistListsService {
  constructor(
    @InjectRepository(WishlistList)
    private wishlistListsRepository: Repository<WishlistList>,
  ) {}

  create(wishlistList: Partial<WishlistList>): Promise<WishlistList> {
    const newWishlistList = this.wishlistListsRepository.create(wishlistList);
    return this.wishlistListsRepository.save(newWishlistList);
  }

  findAll(): Promise<WishlistList[]> {
    return this.wishlistListsRepository.find({
      relations: ['owner', 'wishlists'],
    });
  }

  findOne(id: number): Promise<WishlistList> {
    return this.wishlistListsRepository.findOne({
      where: { id },
      relations: ['owner', 'wishlists'],
    });
  }

  async update(
    id: number,
    updateData: Partial<WishlistList>,
    user: User,
  ): Promise<WishlistList> {
    const wishlistList = await this.findOne(id);
    if (!wishlistList) {
      throw new NotFoundException('WishlistList not found');
    }
    if (wishlistList.owner.id !== user.id) {
      throw new ForbiddenException('You can only edit your own wishlist lists');
    }
    Object.assign(wishlistList, updateData);
    return this.wishlistListsRepository.save(wishlistList);
  }

  async remove(id: number, user: User): Promise<void> {
    const wishlistList = await this.findOne(id);
    if (!wishlistList) {
      throw new NotFoundException('WishlistList not found');
    }
    if (wishlistList.owner.id !== user.id) {
      throw new ForbiddenException(
        'You can only delete your own wishlist lists',
      );
    }
    await this.wishlistListsRepository.remove(wishlistList);
  }
}
