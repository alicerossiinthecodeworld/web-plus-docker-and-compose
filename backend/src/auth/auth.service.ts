import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { HashService } from './hash.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ username });
    if (
      user &&
      (await this.hashService.comparePassword(password, user.password))
    ) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findUserById(id: number): Promise<any> {
    return this.usersService.findOne({ id });
  }

  async hashPassword(password: string): Promise<string> {
    return this.hashService.hashPassword(password);
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findOne({
      username: createUserDto.username,
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    const existingEmail = await this.usersService.findOne({
      email: createUserDto.email,
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.hashService.hashPassword(
      createUserDto.password,
    );

    try {
      const user = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
}
