import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
      validateUserByEmail: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token when credentials are valid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        username: 'test',
        email: 'test@example.com',
        createdAt: '2023-01-01T00:00:00Z',
      };

      const mockToken = 'jwt-token-123';

      usersService.validateUserByEmail.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        access_token: mockToken,
        user: mockUser,
      });
      expect(usersService.validateUserByEmail).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      usersService.validateUserByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.validateUserByEmail).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });
  });

  describe('register', () => {
    it('should create user and return access token', async () => {
      const registerDto: RegisterDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        username: 'test',
        email: 'test@example.com',
        createdAt: '2023-01-01T00:00:00Z',
      };

      const mockToken = 'jwt-token-123';

      usersService.create.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.register(registerDto);

      expect(result).toEqual({
        access_token: mockToken,
        user: mockUser,
      });
      expect(usersService.create).toHaveBeenCalledWith({
        username: 'test',
        email: registerDto.email,
        password: registerDto.password,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
        email: mockUser.email,
      });
    });
  });
});