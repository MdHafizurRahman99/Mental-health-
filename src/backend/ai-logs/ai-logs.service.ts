import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import type { CreateAiLogDto } from "./dto/create-ai-log.dto"
import type { UpdateAiLogDto } from "./dto/update-ai-log.dto"
import { AiLog, InteractionType } from "./schemas/ai-log.entity"

@Injectable()
export class AiLogsService {
  constructor(
    @InjectModel(AiLog.name) private aiLogModel: Model<AiLog>,
  ) {}

  async create(createAiLogDto: CreateAiLogDto): Promise<AiLog> {
    const newAiLog = new this.aiLogModel(createAiLogDto)
    return newAiLog.save()
  }

  async findAll(userId?: string, interactionType?: InteractionType): Promise<AiLog[]> {
    const query: any = {}

    if (userId) {
      query.userId = userId
    }

    if (interactionType) {
      query.interactionType = interactionType
    }

    return this.aiLogModel.find(query).sort({ timestamp: -1 }).exec()
  }

  async findOne(id: string): Promise<AiLog> {
    const aiLog = await this.aiLogModel.findById(id).exec()
    if (!aiLog) {
      throw new NotFoundException(`AI Log with ID ${id} not found`)
    }
    return aiLog
  }

  async update(id: string, updateAiLogDto: UpdateAiLogDto): Promise<AiLog> {
    const aiLog = await this.aiLogModel.findByIdAndUpdate(id, updateAiLogDto, { new: true }).exec()

    if (!aiLog) {
      throw new NotFoundException(`AI Log with ID ${id} not found`)
    }

    return aiLog
  }

  async remove(id: string): Promise<AiLog> {
    const aiLog = await this.aiLogModel.findByIdAndDelete(id).exec()
    if (!aiLog) {
      throw new NotFoundException(`AI Log with ID ${id} not found`)
    }
    return aiLog
  }
}
