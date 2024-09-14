import { IsString, IsEmail, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMemberDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsDate()
  @Type(() => Date)
  birthDate: Date;
}
