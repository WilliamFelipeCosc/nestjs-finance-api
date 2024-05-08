import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TransactionRepository } from './repositories/transaction.repository';
import { User } from 'src/auth/entities/user.entity';
import { TransactionDataDto } from './dto/transaction-data.dto';

@Injectable()
export class TransactionService {
  private logger = new Logger('transactionService', { timestamp: true });
  constructor(private transactionRepository: TransactionRepository) {}

  async getTransactions(user: User) {
    try {
      const transactions =
        await this.transactionRepository.getTransactions(user);
      return transactions;
    } catch (e) {
      this.logger.error(
        `Failed to get transactions for user "${user.username}"`,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTransaction(transactionDataDto: TransactionDataDto, user: User) {
    try {
      const transactions = await this.transactionRepository.createTransaction(
        transactionDataDto,
        user,
      );
      return transactions;
    } catch (e) {
      this.logger.error(
        `Failed to get transactions for user "${user.username}"`,
      );
      throw new InternalServerErrorException();
    }
  }
}
