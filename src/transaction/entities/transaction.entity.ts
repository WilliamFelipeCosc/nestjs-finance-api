import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionStatus } from '../enums/transaction.-tatus.enum';
import { User } from 'src/auth/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  value: string;

  @Column()
  status: TransactionStatus;

  @ManyToOne(() => User, (user) => user.transactions, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
