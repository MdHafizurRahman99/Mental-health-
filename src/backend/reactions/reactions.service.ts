import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Reaction, ReactionDocument, TargetType } from "./schemas/reaction.schema"
import { CreateReactionDto } from "./dto/create-reaction.dto"
import { PostsService } from "../posts/posts.service"
import { CommentsService } from "../comments/comments.service"

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>,
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}

  async create(createReactionDto: CreateReactionDto): Promise<Reaction> {
    // Check if the target exists
    if (createReactionDto.targetType === TargetType.POST) {
      await this.postsService.findOne(createReactionDto.targetId.toString())
    } else if (createReactionDto.targetType === TargetType.COMMENT) {
      await this.commentsService.findOne(createReactionDto.targetId.toString())
    }

    // Check if the reaction already exists
    const existingReaction = await this.reactionModel
      .findOne({
        userId: createReactionDto.userId,
        targetType: createReactionDto.targetType,
        targetId: createReactionDto.targetId,
      })
      .exec()

    if (existingReaction) {
      throw new ConflictException("You have already reacted to this item")
    }

    const createdReaction = new this.reactionModel(createReactionDto)
    const savedReaction = await createdReaction.save()

    // Increment the reactions count on the target
    if (createReactionDto.targetType === TargetType.POST) {
      await this.postsService.incrementReactionsCount(createReactionDto.targetId.toString())
    } else if (createReactionDto.targetType === TargetType.COMMENT) {
      await this.commentsService.incrementReactionsCount(createReactionDto.targetId.toString())
    }

    return savedReaction
  }

  async findAll(userId?: string, targetType?: TargetType, targetId?: string): Promise<Reaction[]> {
    const query: any = {}

    if (userId) {
      query.userId = userId
    }

    if (targetType) {
      query.targetType = targetType
    }

    if (targetId) {
      query.targetId = targetId
    }

    return this.reactionModel.find(query).exec()
  }

  async findOne(id: string): Promise<Reaction> {
    const reaction = await this.reactionModel.findById(id).exec()
    if (!reaction) {
      throw new NotFoundException(`Reaction with ID ${id} not found`)
    }
    return reaction
  }

  async remove(id: string, userId: string): Promise<Reaction> {
    const reaction = await this.reactionModel.findById(id).exec()

    if (!reaction) {
      throw new NotFoundException(`Reaction with ID ${id} not found`)
    }

    // Check if the user is the one who created the reaction
    if (reaction.userId.toString() !== userId) {
      throw new NotFoundException(`Reaction with ID ${id} not found`)
    }

    const deletedReaction = await this.reactionModel.findByIdAndDelete(id).exec()

    // Decrement the reactions count on the target
    if (reaction.targetType === TargetType.POST) {
      await this.postsService.decrementReactionsCount(reaction.targetId.toString())
    } else if (reaction.targetType === TargetType.COMMENT) {
      await this.commentsService.decrementReactionsCount(reaction.targetId.toString())
    }
      if (!deletedReaction) {
        throw new NotFoundException(`Reaction with ID ${id} not found`);
      }
      return deletedReaction;
  }

  async removeByTarget(userId: string, targetType: TargetType, targetId: string): Promise<void> {
    const reaction = await this.reactionModel
      .findOne({
        userId,
        targetType,
        targetId,
      })
      .exec()

    if (reaction) {
      await this.remove(reaction._id.toString(), userId)
    }
  }
}
