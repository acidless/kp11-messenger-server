import { Test, TestingModule } from '@nestjs/testing';
import { ChatsMessagesController } from './chats-messages.controller';

describe('ChatsMessagesController', () => {
  let controller: ChatsMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatsMessagesController],
    }).compile();

    controller = module.get<ChatsMessagesController>(ChatsMessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
