import * as bcrypt from 'bcrypt';
import { AuthenticationError } from 'apollo-server-express';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UsersService;

  beforeEach(async () => {
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation((p1, p2) => Promise.resolve(p1 === p2));

    const JwtServiceApi = {
      provide: JwtService,
      useFactory: () => ({
        sign: jest.fn(() => 'test'),
      }),
    };

    const UsersServiceApi = {
      provide: UsersService,
      useFactory: () => ({
        findOne: jest.fn(() => ({
          password: 'pass',
          email: 'email',
          _id: 'id',
        })),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtServiceApi, UsersServiceApi],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UsersService>(UsersService);
  });

  describe('sign', () => {
    it('authService.login should call jwtService.sign', async () => {
      await service.login({ id: 'id', email: 'email' });
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('authService.validateUser should call userService.findOne', async () => {
      await service.validateUser('user', 'pass');
      expect(userService.findOne).toHaveBeenCalled();
    });

    it('authService.validateUser should return user', async () => {
      const result = await service.validateUser('user', 'pass');
      expect(result).toEqual({ id: 'id', email: 'email' });
    });

    it('authService.validateUser should throw when wrong password', async () => {
      const promise = service.validateUser('user', 'passWrong');
      await expect(promise).rejects.toThrow(AuthenticationError);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
