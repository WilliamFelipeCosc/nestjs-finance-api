import { Exclude } from 'class-transformer';
import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner_name: string;

  @Column()
  number: string;

  @Column()
  cvv: string;

  @Column()
  expire_date: string;

  @ManyToOne(() => User, (user) => user.cards, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
