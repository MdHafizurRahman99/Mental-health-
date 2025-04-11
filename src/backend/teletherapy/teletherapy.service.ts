import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { CreateTeletherapySessionDto } from "./dto/create-teletherapy-session.dto"
import { UpdateTeletherapySessionDto } from "./dto/update-teletherapy-session.dto"
import { TeletherapySession, SessionStatus } from "./schemas/teletherapy-session.entity"
@Injectable()
export class TeletherapyService {
  constructor(
    @InjectModel(TeletherapySession.name) private teletherapySessionModel: Model<TeletherapySession>,
  ) {}

  async create(createTeletherapySessionDto: CreateTeletherapySessionDto): Promise<TeletherapySession> {
    const newSession = new this.teletherapySessionModel(createTeletherapySessionDto)
    return newSession.save()
  }

  async findAll(userId?: string, therapistId?: string, status?: SessionStatus): Promise<TeletherapySession[]> {
    const query: any = {}

    if (userId) {
      query.userId = userId
    }

    if (therapistId) {
      query.therapistId = therapistId
    }

    if (status) {
      query.status = status
    }

    return this.teletherapySessionModel.find(query).sort({ sessionDate: 1 }).exec()
  }

  async findOne(id: string): Promise<TeletherapySession> {
    const session = await this.teletherapySessionModel.findById(id).exec()
    if (!session) {
      throw new NotFoundException(`Teletherapy session with ID ${id} not found`)
    }
    return session
  }

  async update(id: string, updateTeletherapySessionDto: UpdateTeletherapySessionDto): Promise<TeletherapySession> {
    const session = await this.teletherapySessionModel
      .findByIdAndUpdate(id, updateTeletherapySessionDto, { new: true })
      .exec()

    if (!session) {
      throw new NotFoundException(`Teletherapy session with ID ${id} not found`)
    }

    return session
  }

  async remove(id: string): Promise<TeletherapySession> {
    const session = await this.teletherapySessionModel.findByIdAndDelete(id).exec()
    if (!session) {
      throw new NotFoundException(`Teletherapy session with ID ${id} not found`)
    }
    return session
  }
}
