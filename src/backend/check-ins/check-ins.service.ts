import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { CreateCheckInDto } from "./dto/create-check-in.dto"
import { UpdateCheckInDto } from "./dto/update-check-in.dto"
import { CheckIn } from "./schemas/check-in.entity"

@Injectable()
export class CheckInsService {
  constructor(
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckIn>,
  ) {}

  async create(createCheckInDto: CreateCheckInDto): Promise<CheckIn> {
    const newCheckIn = new this.checkInModel(createCheckInDto)
    return newCheckIn.save()
  }

  async findAll(userId?: string): Promise<CheckIn[]> {
    const query = userId ? { userId } : {}
    return this.checkInModel.find(query).sort({ date: -1 }).exec()
  }

  async findOne(id: string): Promise<CheckIn> {
    const checkIn = await this.checkInModel.findById(id).exec()
    if (!checkIn) {
      throw new NotFoundException(`Check-in with ID ${id} not found`)
    }
    return checkIn
  }

  async update(id: string, updateCheckInDto: UpdateCheckInDto): Promise<CheckIn> {
    const checkIn = await this.checkInModel.findByIdAndUpdate(id, updateCheckInDto, { new: true }).exec()

    if (!checkIn) {
      throw new NotFoundException(`Check-in with ID ${id} not found`)
    }

    return checkIn
  }

  async remove(id: string): Promise<CheckIn> {
    const checkIn = await this.checkInModel.findByIdAndDelete(id).exec()
    if (!checkIn) {
      throw new NotFoundException(`Check-in with ID ${id} not found`)
    }
    return checkIn
  }
}
