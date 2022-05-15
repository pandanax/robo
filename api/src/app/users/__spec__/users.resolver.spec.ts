import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from '../users.resolver';
import { UsersService } from '../users.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: UsersService;

  const UsersServiceApi = {
    provide: UsersService,
    useFactory: () => ({
      findByIdNoPass: jest.fn(() => ({ email: 'email', _id: 'id' })),
      register: jest.fn(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersResolver, UsersServiceApi],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('register', () => {
    it('should call usersService.register', async () => {
      await resolver.register({
        email: 'email',
        firstName: 'name',
        lastName: 'last',
        password: 'pass',
      });
      expect(usersService.register).toHaveBeenCalled();
    });
  });

  describe('whoAmI', () => {
    it('should call usersService.findByIdNoPass', async () => {
      await resolver.whoAmI({ userId: '1' });
      expect(usersService.findByIdNoPass).toHaveBeenCalled();
    });
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
