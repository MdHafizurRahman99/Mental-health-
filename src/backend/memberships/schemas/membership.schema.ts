import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { Group } from "../../groups/schemas/group.schema"
import { User } from "src/backend/user/schemas/user.schema"

export enum MembershipRole {
  MEMBER = "member",
  MODERATOR = "moderator",
  ADMIN = "admin",
}

export type MembershipDocument = Membership & Document

@Schema({ timestamps: true })
export class Membership {
  @ApiProperty({ description: "Unique identifier for the membership" })
  _id: MongooseSchema.Types.ObjectId

  @ApiProperty({ description: "Reference to the group" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Group", required: true })
  groupId: Group

  @ApiProperty({ description: "Reference to the user" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: User

  @ApiProperty({
    description: "Role of the user in the group",
    enum: MembershipRole,
    default: MembershipRole.MEMBER,
  })
  @Prop({ type: String, enum: MembershipRole, default: MembershipRole.MEMBER })
  role: MembershipRole

  @ApiProperty({ description: "Timestamp when the user joined the group" })
  @Prop({ default: Date.now })
  joinedAt: Date
}

export const MembershipSchema = SchemaFactory.createForClass(Membership)

// Create a compound index to ensure a user can only be a member of a group once
MembershipSchema.index({ groupId: 1, userId: 1 }, { unique: true })
