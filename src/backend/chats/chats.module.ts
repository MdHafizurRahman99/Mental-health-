import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ChatsService } from "./chats.service"
import { ChatsController } from "./chats.controller"
import { Chat, ChatSchema } from "./schemas/chat.entity"

@Module({
  imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }])],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
