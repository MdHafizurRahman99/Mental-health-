import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import type { CreateContentDto } from "./dto/create-content.dto"
import type { UpdateContentDto } from "./dto/update-content.dto"
import { Content, ContentType } from "./schemas/content.entity"

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<Content>,
  ) {}

  async create(createContentDto: CreateContentDto): Promise<Content> {
    const newContent = new this.contentModel(createContentDto)
    return newContent.save()
  }

  async findAll(type?: ContentType): Promise<Content[]> {
    const query = type ? { type } : {}
    return this.contentModel.find(query).sort({ createdAt: -1 }).exec()
  }

  async findOne(id: string): Promise<Content> {
    const content = await this.contentModel.findById(id).exec()
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`)
    }
    return content
  }

  async update(id: string, updateContentDto: UpdateContentDto): Promise<Content> {
    const content = await this.contentModel.findByIdAndUpdate(id, updateContentDto, { new: true }).exec()

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`)
    }

    return content
  }

  async remove(id: string): Promise<Content> {
    const content = await this.contentModel.findByIdAndDelete(id).exec()
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`)
    }
    return content
  }
}
