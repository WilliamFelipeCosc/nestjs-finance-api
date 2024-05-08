import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CardService } from './card.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { CardDataDto } from './dto/card-data.dto';

@Controller('card')
@UseGuards(AuthGuard())
export class CardController {
  private logger = new Logger('CardController');
  constructor(private cardService: CardService) {}

  @Get()
  getCards(@GetUser() user: User) {
    this.logger.log(`User "${user.username} retrieving all cards"`);

    return this.cardService.getCards(user);
  }

  @Get('/decrypt')
  getDecryptedCards(@GetUser() user: User) {
    this.logger.log(`User "${user.username} retrieving all cards"`);

    return this.cardService.getCardsDecrypted(user);
  }

  @Post()
  createCard(@Body() cardDataDto: CardDataDto, @GetUser() user: User) {
    this.logger.log(`User "${user.username} creating a card"`);

    return this.cardService.createCard(cardDataDto, user);
  }
}
