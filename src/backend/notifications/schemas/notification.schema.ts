import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "src/backend/user/schemas/user.schema"

export enum NotificationType {
  REACTION = "reaction",
  COMMENT = "comment",
  SHARE = "share",
  MENTION = "mention",
  GROUP_INVITE = "groupInvite",
}

export enum ReferenceType {
  POST = "Post",
  COMMENT = "Comment",
  GROUP = "Group",
  USER = "User",
}

export class Reference {
  @ApiProperty({
    description: "Type of the target",
    enum: ReferenceType,
    example: ReferenceType.POST,
  })
  @Prop({ type: String, enum: ReferenceType, required: true })
  targetType: ReferenceType

  @ApiProperty({ description: "ID of the target" })
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  targetId: MongooseSchema.Types.ObjectId
}

export type NotificationDocument = Notification & Document

@Schema({ timestamps: true })
export class Notification {
  @ApiProperty({ description: "Unique identifier for the notification" })
  _id: MongooseSchema.Types.ObjectId

  @ApiProperty({ description: "Reference to the user receiving the notification" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: User

  @ApiProperty({
    description: "Type of notification",
    enum: NotificationType,
    example: NotificationType.REACTION,
  })
  @Prop({ type: String, enum: NotificationType, required: true })
  type: NotificationType

  @ApiProperty({ description: "Reference to the target object" })
  @Prop({ type: Reference, required: true })
  reference: Reference

  @ApiProperty({ description: "Whether the notification has been read", default: false })
  @Prop({ default: false })
  isRead: boolean

  @ApiProperty({ description: "Timestamp when the notification was created" })
  createdAt: Date
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)

// Create an index for faster queries by userId and isRead status
NotificationSchema.index({ userId: 1, isRead: 1 })
