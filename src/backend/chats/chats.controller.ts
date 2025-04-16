import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common"
import { ChatsService } from "./chats.service"
import { CreateChatDto } from "./dto/create-chat.dto"
import { UpdateChatDto } from "./dto/update-chat.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { Chat } from "./schemas/chat.entity"

@ApiTags("chats")
@Controller("chats")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @ApiOperation({ summary: 'Create a new chat message' })
  @ApiBody({ type: CreateChatDto })
  @ApiResponse({ 
    status: 201, 
    description: 'The chat message has been successfully created.',
    type: Chat
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }

  @ApiOperation({ summary: 'Get all chat messages with optional filtering by user' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all chat messages matching the criteria',
    type: [Chat]
  })
  @Get()
  findAll(@Query('userId') userId: string) {
    return this.chatsService.findAll(userId);
  }

  @ApiOperation({ summary: 'Get a chat message by id' })
  @ApiParam({ name: 'id', description: 'Chat message ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the chat message with the specified id',
    type: Chat
  })
  @ApiResponse({ status: 404, description: 'Chat message not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(id);
  }

  @ApiOperation({ summary: "Update a chat message" })
  @ApiParam({ name: "id", description: "Chat message ID" })
  @ApiBody({ type: UpdateChatDto })
  @ApiResponse({
    status: 200,
    description: "The chat message has been successfully updated.",
    type: Chat,
  })
  @ApiResponse({ status: 404, description: "Chat message not found." })
  @Patch(":id")
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(id, updateChatDto)
  }

  @ApiOperation({ summary: 'Delete a chat message' })
  @ApiParam({ name: 'id', description: 'Chat message ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The chat message has been successfully deleted.',
    type: Chat
  })
  @ApiResponse({ status: 404, description: 'Chat message not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatsService.remove(id);
  }
}
