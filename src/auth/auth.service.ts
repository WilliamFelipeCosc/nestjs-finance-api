import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { SignInResponse } from './interfaces/sign-in-response.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { password, username, email, phone } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return await this.usersRepository.createUser({
      username,
      password: hashedPassword,
      email,
      phone,
    });
  }

  async signIn(signInDto: SignInDto): Promise<SignInResponse> {
    const { username, password } = signInDto;

    const user = await this.usersRepository.signIn(signInDto);
    const comparedPassword = await bcrypt.compare(password, user.password);

    if (user && comparedPassword) {
      const payload: JwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
