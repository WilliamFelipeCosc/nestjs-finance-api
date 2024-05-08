import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from '../entities/card.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { CardDataDto } from '../dto/card-data.dto';

@Injectable()
export class CardRepository {
  constructor(@InjectRepository(Card) private repository: Repository<Card>) {}

  async getCards(user: User): Promise<Card[]> {
    const cards = await this.repository.findBy({ user });

    return cards;
  }

  async createCard(cardDataDto: CardDataDto, user: User): Promise<void> {
    const { cvv, expire_date, number, owner_name } = cardDataDto;

    const card = this.repository.create({
      owner_name,
      number,
      cvv,
      expire_date,
      user,
    });

    await this.repository.save(card);
  }
}
