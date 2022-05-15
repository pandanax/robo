import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from '../auth.resolver';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authservice: AuthService;

  const AuthServiceApi = {
    provide: AuthService,
    useFactory: () => ({
      login: jest.fn(() => ({ email: 'email', _id: 'id' })),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthResolver, AuthServiceApi],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authservice = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
