import { Test, TestingModule } from '@nestjs/testing';
import { ChatsUsersService } from './chats-users.service';

describe('ChatsUsersService', () => {
  let service: ChatsUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatsUsersService],
    }).compile();

    service = module.get<ChatsUsersService>(ChatsUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
