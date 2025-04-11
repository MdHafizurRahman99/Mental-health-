import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common"
import  { ChatsService } from "./chats.service"
import  { CreateChatDto } from "./dto/create-chat.dto"
import  { UpdateChatDto } from "./dto/update-chat.dto"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("chats")
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.chatsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(id);
  }

  @Patch(":id")
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(id, updateChatDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatsService.remove(id);
  }
}
