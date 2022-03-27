import { Test, TestingModule } from '@nestjs/testing';
import { ChatsUsersController } from './chats-users.controller';

describe('ChatsUsersController', () => {
  let controller: ChatsUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatsUsersController],
    }).compile();

    controller = module.get<ChatsUsersController>(ChatsUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
