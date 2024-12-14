import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  @IsOptional()
  readonly username?: string;

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  readonly avatar?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  readonly about?: string;
}
