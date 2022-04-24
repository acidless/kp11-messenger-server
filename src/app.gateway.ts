import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessageDocument } from '../schemas/message.schema';
import { TypingDTO, WSService } from './chats/WS.service';

@WebSocketGateway(1488)
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  public constructor(private wsService: WSService) {}

  afterInit(server: any) {
    this.wsService.server = server;
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, message: MessageDocument) {
    await this.handleTyping(client, {
      chatId: message.chat as unknown as string,
      isTyping: false,
      userId: this.wsService.clients.find((cl2) => cl2.socketId === client.id).userId,
    });
    await this.wsService.sendMessage(message);
  }

  @SubscribeMessage('typing')
  async handleTyping(client: Socket, message: TypingDTO) {
    await this.wsService.sendTyping(client.id, message);
  }

  @SubscribeMessage('registerClient')
  registerClient(client: Socket, userId: string): void {
    this.wsService.registerClient(client.id, userId);
  }

  handleDisconnect(client: Socket) {
    this.wsService.unregisterClient(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }
}
