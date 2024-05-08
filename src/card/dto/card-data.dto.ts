import {
  IsInt,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CardDataDto {
  @IsString()
  @MinLength(8)
  @MaxLength(48)
  owner_name: string;

  @IsString()
  @MinLength(12)
  @MaxLength(20)
  number: string;

  @IsString()
  @Matches(/^\d{3}$/)
  cvv: string;

  @IsString()
  expire_date: string;
}
