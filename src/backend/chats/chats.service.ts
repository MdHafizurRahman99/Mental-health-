import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import type { CreateChatDto } from "./dto/create-chat.dto"
import type { UpdateChatDto } from "./dto/update-chat.dto"
import { Chat } from "./schemas/chat.entity"

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
  ) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const newChat = new this.chatModel(createChatDto)
    return newChat.save()
  }

  async findAll(userId?: string): Promise<Chat[]> {
    const query = userId ? { userId } : {}
    return this.chatModel.find(query).sort({ timestamp: 1 }).exec()
  }

  async findOne(id: string): Promise<Chat> {
    const chat = await this.chatModel.findById(id).exec()
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`)
    }
    return chat
  }

  async update(id: string, updateChatDto: UpdateChatDto): Promise<Chat> {
    const chat = await this.chatModel.findByIdAndUpdate(id, updateChatDto, { new: true }).exec()

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`)
    }

    return chat
  }

  async remove(id: string): Promise<Chat> {
    const chat = await this.chatModel.findByIdAndDelete(id).exec()
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`)
    }
    return chat
  }
}
