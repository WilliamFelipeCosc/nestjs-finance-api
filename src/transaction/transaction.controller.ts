import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionService } from './transaction.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { userInfo } from 'os';
import { User } from 'src/auth/entities/user.entity';
import { TransactionDataDto } from './dto/transaction-data.dto';

@Controller('transaction')
@UseGuards(AuthGuard())
export class TransactionController {
  private logger = new Logger('TransactionController');
  constructor(private transactionService: TransactionService) {}

  @Get()
  getTransaction(@GetUser() user: User) {
    this.logger.log(`User "${user.username}" retrieving all transactions`);

    return this.transactionService.getTransactions(user);
  }

  @Post()
  createTransaction(
    @Body() transactionDataDto: TransactionDataDto,
    @GetUser() user: User,
  ) {
    this.logger.log(`User "${user.username}" creating a transaction`);

    return this.transactionService.createTransaction(transactionDataDto, user);
  }
}
