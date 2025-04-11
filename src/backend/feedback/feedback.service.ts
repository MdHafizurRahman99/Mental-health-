import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import type { CreateFeedbackDto } from "./dto/create-feedback.dto"
import type { UpdateFeedbackDto } from "./dto/update-feedback.dto"
import { Feedback } from "./schemas/feedback.entity"
@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<Feedback>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const newFeedback = new this.feedbackModel(createFeedbackDto)
    return newFeedback.save()
  }

  async findAll(userId?: string): Promise<Feedback[]> {
    const query = userId ? { userId } : {}
    return this.feedbackModel.find(query).sort({ createdAt: -1 }).exec()
  }

  async findOne(id: string): Promise<Feedback> {
    const feedback = await this.feedbackModel.findById(id).exec()
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`)
    }
    return feedback
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
    const feedback = await this.feedbackModel.findByIdAndUpdate(id, updateFeedbackDto, { new: true }).exec()

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`)
    }

    return feedback
  }

  async remove(id: string): Promise<Feedback> {
    const feedback = await this.feedbackModel.findByIdAndDelete(id).exec()
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`)
    }
    return feedback
  }
}
