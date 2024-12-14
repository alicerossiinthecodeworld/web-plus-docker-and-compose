import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(user: Partial<User>): Promise<User> {
    return this.usersRepository.save(user);
  }

  findOne(query: Partial<User>): Promise<User> {
    return this.usersRepository.findOneBy(query);
  }

  findAll(query: Partial<User>): Promise<User[]> {
    return this.usersRepository.findBy(query);
  }

  async findMany(searchTerm: string): Promise<User[]> {
    return this.usersRepository.find({
      where: [
        { username: Like(`%${searchTerm}%`) },
        { email: Like(`%${searchTerm}%`) },
      ],
    });
  }
  async updateOne(id: number, updateData: Partial<User>): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: updateData.email, id: Not(id) },
        { username: updateData.username, id: Not(id) },
      ],
    });

    if (existingUser) {
      throw new BadRequestException('Email or username already in use');
    }

    await this.usersRepository.update(id, updateData);
    return this.usersRepository.findOneBy({ id });
  }


  async removeOne(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
