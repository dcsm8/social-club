import { IsString, IsDate, IsUrl, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClubDto {
  @IsString()
  name: string;

  @IsDate()
  @Type(() => Date)
  foundationDate: Date;

  @IsUrl()
  image: string;

  @IsString()
  @MaxLength(100, { message: 'Description must not exceed 100 characters' })
  description: string;
}
