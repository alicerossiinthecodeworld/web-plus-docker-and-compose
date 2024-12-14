import { User } from 'src/users/entities/user.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class WishlistList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => User, (user) => user.wishlistLists)
  owner: User;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.id, {
    cascade: true,
  })
  wishlists: Wishlist[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
