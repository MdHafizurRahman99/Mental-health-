import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Group, GroupDocument } from "./schemas/group.schema"
import { CreateGroupDto } from "./dto/create-group.dto"
import { UpdateGroupDto } from "./dto/update-group.dto"

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    private readonly membershipsService: MembershipsService
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const createdGroup = new this.groupModel(createGroupDto)
    const savedGroup = await createdGroup.save()

    // Automatically add the creator as an admin
    await this.membershipsService.create({
      groupId: savedGroup._id,
      userId: createGroupDto.createdBy,
      role: MembershipRole.ADMIN,
    })

    return savedGroup
  }

  async findAll(limit = 10, page = 1): Promise<{ groups: Group[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit
    const [groups, total] = await Promise.all([
      this.groupModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.groupModel.countDocuments().exec(),
    ])

    return {
      groups,
      total,
      page,
      limit,
    }
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupModel.findById(id).exec()
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`)
    }
    return group
  }

  async update(id: string, updateGroupDto: UpdateGroupDto, userId: string): Promise<Group> {
    const group = await this.groupModel.findById(id).exec()

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`)
    }

    // Check if the user is an admin or moderator of the group
    const membership = await this.membershipsService.findByUserAndGroup(userId, id)
    if (!membership || (membership.role !== MembershipRole.ADMIN && membership.role !== MembershipRole.MODERATOR)) {
      throw new ForbiddenException("You do not have permission to update this group")
    }

    return this.groupModel.findByIdAndUpdate(id, updateGroupDto, { new: true }).exec()
  }

  async remove(id: string, userId: string): Promise<Group> {
    const group = await this.groupModel.findById(id).exec()

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`)
    }

    // Check if the user is the creator of the group
    if (group.createdBy.toString() !== userId) {
      throw new ForbiddenException("Only the group creator can delete the group")
    }

    return this.groupModel.findByIdAndDelete(id).exec()
  }
}
