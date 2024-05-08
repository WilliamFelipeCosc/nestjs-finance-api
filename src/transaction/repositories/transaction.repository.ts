import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { TransactionDataDto } from '../dto/transaction-data.dto';
import { TransactionStatus } from '../enums/transaction.-tatus.enum';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction) private repository: Repository<Transaction>,
  ) {}

  async getTransactions(user: User): Promise<Transaction[]> {
    const transactions = await this.repository.findBy({ user });

    return transactions;
  }

  async createTransaction(
    transactionDataDto: TransactionDataDto,
    user: User,
  ): Promise<Transaction> {
    const transaction = this.repository.create({
      ...transactionDataDto,
      status: TransactionStatus.CREATED,
      user,
    });

    return await this.repository.save(transaction);
  }
}
