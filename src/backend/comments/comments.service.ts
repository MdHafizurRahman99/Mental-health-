import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { Comment, CommentDocument } from "./schemas/comment.schema"
import { CreateCommentDto } from "./dto/create-comment.dto"
import { UpdateCommentDto } from "./dto/update-comment.dto"
import { PostsService } from "../posts/posts.service"

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly postsService: PostsService
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    // First check if the post exists
    await this.postsService.findOne(createCommentDto.postId.toString())

    // If it's a reply, check if the parent comment exists
    if (createCommentDto.parentCommentId) {
      const parentComment = await this.commentModel.findById(createCommentDto.parentCommentId).exec()
      if (!parentComment) {
        throw new NotFoundException(`Parent comment with ID ${createCommentDto.parentCommentId} not found`)
      }
    }

    const createdComment = new this.commentModel(createCommentDto)
    const savedComment = await createdComment.save()

    // Increment the comments count on the post
    await this.postsService.incrementCommentsCount(createCommentDto.postId.toString())

    return savedComment
  }

  async findAll(
    postId?: string,
    authorId?: string,
    parentCommentId?: string,
    limit = 10,
    page = 1,
  ): Promise<{ comments: Comment[]; total: number; page: number; limit: number }> {
    const query: any = {}

    if (postId) {
      query.postId = new Types.ObjectId(postId)
    }

    if (authorId) {
      query.authorId = new Types.ObjectId(authorId)
    }

    if (parentCommentId) {
      query.parentCommentId = parentCommentId ? new Types.ObjectId(parentCommentId) : null
    } else {
      // If no parentCommentId is provided, return top-level comments
      query.parentCommentId = { $exists: false }
    }

    const skip = (page - 1) * limit
    const [comments, total] = await Promise.all([
      this.commentModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.commentModel.countDocuments(query).exec(),
    ])

    return {
      comments,
      total,
      page,
      limit,
    }
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentModel.findById(id).exec()
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }
    return comment
  }

  async findReplies(
    commentId: string,
    limit = 10,
    page = 1,
  ): Promise<{ replies: Comment[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit
    const [replies, total] = await Promise.all([
      this.commentModel
        .find({ parentCommentId: new Types.ObjectId(commentId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.commentModel.countDocuments({ parentCommentId: new Types.ObjectId(commentId) }).exec(),
    ])

    return {
      replies,
      total,
      page,
      limit,
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<Comment> {
    const comment = await this.commentModel.findById(id).exec()

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }

    // Check if the user is the author of the comment
    if (comment.authorId.toString() !== userId) {
      throw new ForbiddenException("You can only update your own comments")
    }

    return this.commentModel.findByIdAndUpdate(id, updateCommentDto, { new: true }).exec()
  }

  async remove(id: string, userId: string): Promise<Comment> {
    const comment = await this.commentModel.findById(id).exec()

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }

    // Check if the user is the author of the comment
    if (comment.authorId.toString() !== userId) {
      throw new ForbiddenException("You can only delete your own comments")
    }

    const deletedComment = await this.commentModel.findByIdAndDelete(id).exec()

    // Decrement the comments count on the post
    await this.postsService.decrementCommentsCount(comment.postId.toString())

    return deletedComment
  }

  async incrementReactionsCount(commentId: string): Promise<void> {
    await this.commentModel.findByIdAndUpdate(commentId, { $inc: { reactionsCount: 1 } }).exec()
  }

  async decrementReactionsCount(commentId: string): Promise<void> {
    await this.commentModel.findByIdAndUpdate(commentId, { $inc: { reactionsCount: -1 } }).exec()
  }
}
