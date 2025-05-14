import { Injectable, NotFoundException, ConflictException, ForbiddenException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Membership, MembershipDocument, MembershipRole } from "./schemas/membership.schema"
import { CreateMembershipDto } from "./dto/create-membership.dto"
import { UpdateMembershipDto } from "./dto/update-membership.dto"

@Injectable()
export class MembershipsService {
  constructor(
    @InjectModel(Membership.name) private membershipModel: Model<MembershipDocument>
  ) {}

  async create(createMembershipDto: CreateMembershipDto): Promise<Membership> {
    // Check if membership already exists
    const existingMembership = await this.membershipModel
      .findOne({
        groupId: createMembershipDto.groupId,
        userId: createMembershipDto.userId,
      })
      .exec()

    if (existingMembership) {
      throw new ConflictException("User is already a member of this group")
    }

    const createdMembership = new this.membershipModel(createMembershipDto)
    return createdMembership.save()
  }

  async findAll(groupId?: string, userId?: string): Promise<Membership[]> {
    const query: any = {}

    if (groupId) {
      query.groupId = groupId
    }

    if (userId) {
      query.userId = userId
    }

    return this.membershipModel.find(query).exec()
  }

  async findOne(id: string): Promise<Membership> {
    const membership = await this.membershipModel.findById(id).exec()
    if (!membership) {
      throw new NotFoundException(`Membership with ID ${id} not found`)
    }
    return membership
  }

  async findByUserAndGroup(userId: string, groupId: string): Promise<Membership> {
    const membership = await this.membershipModel.findOne({ userId, groupId }).exec()
    if (!membership) {
      throw new NotFoundException(`Membership for user ${userId} in group ${groupId} not found`)
    }
    return membership
  }

  async update(id: string, updateMembershipDto: UpdateMembershipDto, currentUserId: string): Promise<Membership> {
    const membership = await this.membershipModel.findById(id).exec()

    if (!membership) {
      throw new NotFoundException(`Membership with ID ${id} not found`)
    }

    // Check if the current user has permission to update the membership
    const currentUserMembership = await this.membershipModel
      .findOne({
        groupId: membership.groupId,
        userId: currentUserId,
      })
      .exec()

    if (!currentUserMembership || currentUserMembership.role !== MembershipRole.ADMIN) {
      throw new ForbiddenException("Only group admins can update membership roles")
    }

    // Prevent demoting the last admin
    if (membership.role === MembershipRole.ADMIN && updateMembershipDto.role !== MembershipRole.ADMIN) {
      const adminCount = await this.membershipModel
        .countDocuments({
          groupId: membership.groupId,
          role: MembershipRole.ADMIN,
        })
        .exec()

      if (adminCount <= 1) {
        throw new ForbiddenException("Cannot demote the last admin of the group")
      }
    }

    return this.membershipModel.findByIdAndUpdate(id, updateMembershipDto, { new: true }).exec()
  }

  async remove(id: string, currentUserId: string): Promise<Membership> {
    const membership = await this.membershipModel.findById(id).exec()

    if (!membership) {
      throw new NotFoundException(`Membership with ID ${id} not found`)
    }

    // Users can leave groups themselves
    if (membership.userId.toString() === currentUserId) {
      // Check if this is the last admin
      if (membership.role === MembershipRole.ADMIN) {
        const adminCount = await this.membershipModel
          .countDocuments({
            groupId: membership.groupId,
            role: MembershipRole.ADMIN,
          })
          .exec()

        if (adminCount <= 1) {
          throw new ForbiddenException("The last admin cannot leave the group. Transfer admin role first.")
        }
      }

      return this.membershipModel.findByIdAndDelete(id).exec()
    }

    // Otherwise, check if the current user is an admin of the group
    const currentUserMembership = await this.membershipModel
      .findOne({
        groupId: membership.groupId,
        userId: currentUserId,
      })
      .exec()

    if (!currentUserMembership || currentUserMembership.role !== MembershipRole.ADMIN) {
      throw new ForbiddenException("Only group admins can remove members")
    }

    return this.membershipModel.findByIdAndDelete(id).exec()
  }
}
