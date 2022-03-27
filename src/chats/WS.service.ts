import { Injectable } from '@nestjs/common';
import { Message } from '../../schemas/message.schema';
import { ChatsService } from './chats.service';
import { Server } from 'socket.io';

export type TypingDTO = {
  chatId: string;
  userId: string;
  isTyping: boolean;
};

@Injectable()
export class WSService {
  public constructor(private chatsService: ChatsService) {}

  public server: Server;

  private clients: Array<{ userId: string; socketId: string }> = [];

  public async sendMessage(message: Message) {
    const chat = await this.chatsService.getChat(message.chat.toString());

    this.clients.forEach((cl) => {
      if (
        chat.users.find((user) => (user as any)._id.toString() === cl.userId)
      ) {
        this.server.to(cl.socketId).emit('message', message);
      }
    });
  }

  public async sendTyping(clientId: string, message: TypingDTO) {
    const chat = await this.chatsService.getChat(message.chatId);
    const sender = this.clients.find((cl2) => cl2.socketId === clientId);

    this.clients.forEach((cl) => {
      if (
        chat.users.find((user) => (user as any)._id.toString() === cl.userId)
      ) {
        this.server.to(cl.socketId).emit('typing', {
          ...message,
          userId: sender?.userId,
        });
      }
    });
  }

  public registerClient(clientId: string, userId: string) {
    const newClient = { userId, socketId: clientId };
    const findIndex = this.clients.findIndex((cl) => cl.userId === userId);

    if (findIndex !== -1) {
      this.clients[findIndex] = newClient;
    } else {
      this.clients.push(newClient);
    }
  }

  public unregisterClient(clientId: string) {
    this.clients = this.clients.filter((c) => c.socketId !== clientId);
  }
}
