import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponse } from '../users/interfaces/user.interface';

export interface AuthResponse {
  access_token: string;
  user: UserResponse;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    this.logger.log(`Tentativa de registro para usuário: ${registerDto.email}`);
    
    // Converter RegisterDto para CreateUserDto
    const createUserDto: CreateUserDto = {
      username: registerDto.email.split('@')[0], // usar parte antes do @ como username
      email: registerDto.email,
      password: registerDto.password
    };
    
    const user = await this.usersService.create(createUserDto);
    
    const payload = { 
      username: user.username, 
      sub: user.id,
      email: user.email 
    };
    
    const access_token = this.jwtService.sign(payload);
    
    this.logger.log(`Usuário registrado com sucesso: ${user.username}`);
    
    return {
      access_token,
      user
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    this.logger.log(`Tentativa de login para usuário: ${loginDto.email}`);
    
    const user = await this.usersService.validateUserByEmail(loginDto.email, loginDto.password);
    
    if (!user) {
      this.logger.warn(`Falha no login para usuário: ${loginDto.email}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    const payload = { 
      username: user.username, 
      sub: user.id,
      email: user.email 
    };
    
    const access_token = this.jwtService.sign(payload);
    
    this.logger.log(`Login realizado com sucesso para usuário: ${user.username}`);
    
    return {
      access_token,
      user
    };
  }

  async validateToken(payload: any): Promise<UserResponse> {
    const user = await this.usersService.findById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }
    
    return user;
  }
}