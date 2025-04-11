import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { CreateGamificationDto } from "./dto/create-gamification.dto"
import { UpdateGamificationDto } from "./dto/update-gamification.dto"
import { Gamification } from "./schemas/gamification.entity"

@Injectable()
export class GamificationService {
  constructor(
    @InjectModel(Gamification.name) private gamificationModel: Model<Gamification>,
  ) {}

  async create(createGamificationDto: CreateGamificationDto): Promise<Gamification> {
    // Check if gamification profile already exists for this user
    const existing = await this.gamificationModel.findOne({ userId: createGamificationDto.userId }).exec()
    if (existing) {
      throw new ConflictException(`Gamification profile already exists for user ${createGamificationDto.userId}`)
    }

    const newGamification = new this.gamificationModel(createGamificationDto)
    return newGamification.save()
  }

  async findAll(): Promise<Gamification[]> {
    return this.gamificationModel.find().exec()
  }

  async findOne(id: string): Promise<Gamification> {
    const gamification = await this.gamificationModel.findById(id).exec()
    if (!gamification) {
      throw new NotFoundException(`Gamification with ID ${id} not found`)
    }
    return gamification
  }

  async findByUserId(userId: string): Promise<Gamification> {
    const gamification = await this.gamificationModel.findOne({ userId }).exec()
    if (!gamification) {
      throw new NotFoundException(`Gamification for user ${userId} not found`)
    }
    return gamification
  }

  async update(id: string, updateGamificationDto: UpdateGamificationDto): Promise<Gamification> {
    const gamification = await this.gamificationModel.findByIdAndUpdate(id, updateGamificationDto, { new: true }).exec()

    if (!gamification) {
      throw new NotFoundException(`Gamification with ID ${id} not found`)
    }

    return gamification
  }

  async remove(id: string): Promise<Gamification> {
    const gamification = await this.gamificationModel.findByIdAndDelete(id).exec()
    if (!gamification) {
      throw new NotFoundException(`Gamification with ID ${id} not found`)
    }
    return gamification
  }
}
