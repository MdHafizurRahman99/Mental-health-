import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { Post, PostDocument } from "./schemas/post.schema"
import { CreatePostDto } from "./dto/create-post.dto"
import { UpdatePostDto } from "./dto/update-post.dto"

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(createPostDto)
    return createdPost.save()
  }

  async findAll(
    limit = 10,
    page = 1,
    authorId?: string,
    groupId?: string,
    tags?: string[],
  ): Promise<{ posts: Post[]; total: number; page: number; limit: number }> {
    const query: any = {}

    if (authorId) {
      query.authorId = new Types.ObjectId(authorId)
    }

    if (groupId) {
      query.groupId = new Types.ObjectId(groupId)
    }

    if (tags && tags.length > 0) {
      query.tags = { $in: tags }
    }

    const skip = (page - 1) * limit
    const [posts, total] = await Promise.all([
      this.postModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.postModel.countDocuments(query).exec(),
    ])

    return {
      posts,
      total,
      page,
      limit,
    }
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec()
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }
    return post
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec()

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    // Check if the user is the author of the post
    if (post.authorId.toString() !== userId) {
      throw new ForbiddenException("You can only update your own posts")
    }

    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec()
  }

  async remove(id: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec()

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    // Check if the user is the author of the post
    if (post.authorId.toString() !== userId) {
      throw new ForbiddenException("You can only delete your own posts")
    }

    return this.postModel.findByIdAndDelete(id).exec()
  }

  async incrementCommentsCount(postId: string): Promise<void> {
    await this.postModel.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } }).exec()
  }

  async decrementCommentsCount(postId: string): Promise<void> {
    await this.postModel.findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } }).exec()
  }

  async incrementReactionsCount(postId: string): Promise<void> {
    await this.postModel.findByIdAndUpdate(postId, { $inc: { reactionsCount: 1 } }).exec()
  }

  async decrementReactionsCount(postId: string): Promise<void> {
    await this.postModel.findByIdAndUpdate(postId, { $inc: { reactionsCount: -1 } }).exec()
  }

  async incrementSharesCount(postId: string): Promise<void> {
    await this.postModel.findByIdAndUpdate(postId, { $inc: { sharesCount: 1 } }).exec()
  }
}
