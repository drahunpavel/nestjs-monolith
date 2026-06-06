import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(@Body() chatDto: ChatDto) {
    return this.chatService.sendMessage(chatDto);
  }

  @Get(':senderId/:receiverId/messages')
  getMessages(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    return this.chatService.getMessages(senderId, receiverId);
  }

  // @Get('get')
  // async getMessages(@Query() chatDto: ChatDto) {
  //   return this.chatService.getMessages(chatDto);
  // }
}
