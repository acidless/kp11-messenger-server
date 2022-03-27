import { Test, TestingModule } from '@nestjs/testing';
import { ChatsMessagesService } from './chats-messages.service';

describe('ChatsMessagesService', () => {
  let service: ChatsMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatsMessagesService],
    }).compile();

    service = module.get<ChatsMessagesService>(ChatsMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
