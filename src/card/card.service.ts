import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CardRepository } from './repository/card.repository';
import { User } from 'src/auth/entities/user.entity';
import { Card } from './entities/card.entity';
import { CardDataDto } from './dto/card-data.dto';
import { publicEncrypt, constants, privateDecrypt } from 'node:crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CardService {
  private logger = new Logger('cardService', { timestamp: true });
  constructor(
    private cardRepository: CardRepository,
    private configService: ConfigService,
  ) {}

  async getCards(user: User): Promise<Card[]> {
    try {
      const cards = await this.cardRepository.getCards(user);
      return cards;
    } catch (e) {
      this.logger.error(`Failed to get cards for user "${user.username}"`);
      throw new InternalServerErrorException();
    }
  }

  async getCardsDecrypted(user: User): Promise<Card[]> {
    try {
      const cards = await this.cardRepository.getCards(user);

      const decryptedCards = cards.map((card) => {
        const { cvv, expire_date, number } = card;

        const cvv_buffer = Buffer.from(cvv, 'base64');
        const cvv_decrypted = privateDecrypt(
          {
            key: this.configService.get('RSA_PRIVATE_KEY'),
            padding: constants.RSA_PKCS1_OAEP_PADDING,
          },
          cvv_buffer,
        );

        const expire_date_buffer = Buffer.from(expire_date, 'base64');
        const expire_date_decrypted = privateDecrypt(
          {
            key: this.configService.get('RSA_PRIVATE_KEY'),
            padding: constants.RSA_PKCS1_OAEP_PADDING,
          },
          expire_date_buffer,
        );

        const number_buffer = Buffer.from(number, 'base64');
        const number_decrypted = privateDecrypt(
          {
            key: this.configService.get('RSA_PRIVATE_KEY'),
            padding: constants.RSA_PKCS1_OAEP_PADDING,
          },
          number_buffer,
        );

        return {
          ...card,
          cvv: cvv_decrypted.toString('utf-8'),
          number: number_decrypted.toString('utf-8'),
          expire_date: expire_date_decrypted.toString('utf-8'),
        };
      });

      return decryptedCards;
    } catch (e) {
      this.logger.error(`Failed to get cards for user "${user.username}"`);
      throw new InternalServerErrorException();
    }
  }

  async createCard(cardDataDto: CardDataDto, user: User): Promise<void> {
    const { cvv, expire_date, number, owner_name } = cardDataDto;

    const cvv_buffer = Buffer.from(cvv, 'utf-8');
    const cvv_encrypted = publicEncrypt(
      {
        key: this.configService.get('RSA_PUBLIC_KEY'),
        padding: constants.RSA_PKCS1_OAEP_PADDING,
      },
      cvv_buffer,
    );

    const number_buffer = Buffer.from(number, 'utf-8');
    const number_encrypted = publicEncrypt(
      {
        key: this.configService.get('RSA_PUBLIC_KEY'),
        padding: constants.RSA_PKCS1_OAEP_PADDING,
      },
      number_buffer,
    );

    const expire_date_buffer = Buffer.from(expire_date, 'utf-8');
    const expire_date_encrypted = publicEncrypt(
      {
        key: this.configService.get('RSA_PUBLIC_KEY'),
        padding: constants.RSA_PKCS1_OAEP_PADDING,
      },
      expire_date_buffer,
    );

    const cardDataEncrypted = {
      owner_name,
      expire_date: expire_date_encrypted.toString('base64'),
      number: number_encrypted.toString('base64'),
      cvv: cvv_encrypted.toString('base64'),
    };

    return await this.cardRepository.createCard(cardDataEncrypted, user);
  }
}
