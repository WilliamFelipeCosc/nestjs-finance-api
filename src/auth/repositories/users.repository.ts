import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { SignInDto } from '../dto/sign-in.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async createUser(authCredentialsDto: AuthCredentialsDto) {
    const { password, username, email, phone } = authCredentialsDto;

    const user = this.repository.create({
      username,
      password,
      email,
      phone,
    });

    try {
      await this.repository.save(user);
    } catch (e) {
      if (e.code === '23505')
        throw new ConflictException('Username already exists');

      throw new InternalServerErrorException();
    }
  }

  async signIn(signInDto: SignInDto) {
    const { username } = signInDto;

    return await this.repository.findOneBy({ username });
  }
}
