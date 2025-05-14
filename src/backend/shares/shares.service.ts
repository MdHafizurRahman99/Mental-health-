import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Share, ShareDocument } from "./schemas/share.schema"
import { CreateShareDto } from "./dto/create-share.dto"
import { PostsService } from "../posts/posts.service"

@Injectable()
export class SharesService {
  constructor(
    @InjectModel(Share.name)
    private shareModel: Model<ShareDocument>,
    private readonly postsService: PostsService,
  ) {}

  async create(createShareDto: CreateShareDto): Promise<Share> {
    // Check if the post exists
    await this.postsService.findOne(createShareDto.postId.toString())

    // Check if the share already exists
    const existingShare = await this.shareModel
      .findOne({
        userId: createShareDto.userId,
        postId: createShareDto.postId,
      })
      .exec()

    if (existingShare) {
      throw new ConflictException("You have already shared this post")
    }

    const createdShare = new this.shareModel(createShareDto)
    const savedShare = await createdShare.save()

    // Increment the shares count on the post
    await this.postsService.incrementSharesCount(createShareDto.postId.toString())

    return savedShare
  }

  async findAll(userId?: string, postId?: string): Promise<Share[]> {
    const query: any = {}

    if (userId) {
      query.userId = userId
    }

    if (postId) {
      query.postId = postId
    }

    return this.shareModel.find(query).exec()
  }

  async findOne(id: string): Promise<Share> {
    const share = await this.shareModel.findById(id).exec()
    if (!share) {
      throw new NotFoundException(`Share with ID ${id} not found`)
    }
    return share
  }

  async remove(id: string, userId: string): Promise<Share> {
    const share = await this.shareModel.findById(id).exec()

    if (!share) {
      throw new NotFoundException(`Share with ID ${id} not found`)
    }

    // Check if the user is the one who created the share
    if (share.userId.toString() !== userId) {
      throw new NotFoundException(`Share with ID ${id} not found`)
    }

    const deletedShare = await this.shareModel.findByIdAndDelete(id).exec();
      if (!deletedShare) {
        throw new NotFoundException(`Share with ID ${id} not found`);
      }
    return deletedShare;
  }
}
