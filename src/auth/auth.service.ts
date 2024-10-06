import { Injectable, Logger } from '@nestjs/common';
import { LoggedInDto } from './dto/logged-in.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  private logger = new Logger();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService:  ConfigService) {}

  async validateUser(username: string, password: string): Promise<LoggedInDto> {

    // find user by username
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      this.logger.debug(`user not found: username=${username}`, AuthService.name)
      return null
    }

    // found & compare
    if (await bcrypt.compare(password, user.password)) {
      const { password, ...userWithoutPassword} = user;
      return userWithoutPassword;
    }{
      this.logger.debug(`wrong password: username=${username}`)
      return null
    }
  }

  login(loggedInDto: LoggedInDto) {
  
    // sign access_token
    const payload: LoggedInDto = {...loggedInDto, sub: loggedInDto.id };
    const access_token = this.jwtService.sign(payload,{
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN')
    });

    //sign refresh_token
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_JWT_SECRET'),
      expiresIn: this.configService.get('REFRESH_JWT_EXPIRES_IN')
    })
    
    // return access_token & refresh_token
    return { access_token, refresh_token }
  }

  refreshToken(loggedInDto: LoggedInDto) {
    // sign new access_token (refresh it!)
    const payload: LoggedInDto = {...loggedInDto, sub: loggedInDto.id };
    const access_token = this.jwtService.sign(payload,{
      secret: this.configService.get('REFRESH_JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN')
    });
    return { access_token }
  }

}
