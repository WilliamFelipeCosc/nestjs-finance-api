import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CardRepository } from './repository/card.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), AuthModule, ConfigModule],
  controllers: [CardController],
  providers: [CardService, CardRepository],
})
export class CardModule {}
