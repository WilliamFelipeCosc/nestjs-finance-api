import { Exclude } from 'class-transformer';
import { Card } from 'src/card/entities/card.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @OneToMany((_type) => Card, (card) => card.user, { eager: true })
  cards: Card[];

  @OneToMany((_type) => Transaction, (transaction) => transaction.user, {
    eager: true,
  })
  @Exclude({ toPlainOnly: true })
  transactions: Transaction[];
}
