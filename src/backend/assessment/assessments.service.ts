import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import type { CreateAssessmentDto } from "./dto/create-assessment.dto"
import type { UpdateAssessmentDto } from "./dto/update-assessment.dto"
import { Assessment, type AssessmentType } from "./entities/assessment.entity"

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectModel(Assessment.name) private assessmentModel: Model<Assessment>,
  ) {}

  async create(createAssessmentDto: CreateAssessmentDto): Promise<Assessment> {
    const newAssessment = new this.assessmentModel(createAssessmentDto)
    return newAssessment.save()
  }

  async findAll(userId?: string, type?: AssessmentType): Promise<Assessment[]> {
    const query: any = {}

    if (userId) {
      query.userId = userId
    }

    if (type) {
      query.type = type
    }

    return this.assessmentModel.find(query).sort({ date: -1 }).exec()
  }

  async findOne(id: string): Promise<Assessment> {
    const assessment = await this.assessmentModel.findById(id).exec()
    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`)
    }
    return assessment
  }

  async update(id: string, updateAssessmentDto: UpdateAssessmentDto): Promise<Assessment> {
    const assessment = await this.assessmentModel.findByIdAndUpdate(id, updateAssessmentDto, { new: true }).exec()

    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`)
    }

    return assessment
  }

  async remove(id: string): Promise<Assessment> {
    const assessment = await this.assessmentModel.findByIdAndDelete(id).exec()
    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`)
    }
    return assessment
  }
}
