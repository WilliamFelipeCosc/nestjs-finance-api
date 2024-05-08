import { IsString } from 'class-validator';

export class TransactionDataDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  value: string;
}
