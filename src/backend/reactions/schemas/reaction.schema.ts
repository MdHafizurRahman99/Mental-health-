import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "src/backend/user/schemas/user.schema"

export enum TargetType {
  POST = "Post",
  COMMENT = "Comment",
}

export type ReactionDocument = Reaction & Document

@Schema({ timestamps: true })
export class Reaction {
  @ApiProperty({ description: "Unique identifier for the reaction" })
  _id: MongooseSchema.Types.ObjectId

  @ApiProperty({ description: "Reference to the user who created the reaction" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: User

  @ApiProperty({
    description: "Type of target (Post or Comment)",
    enum: TargetType,
  })
  @Prop({ type: String, enum: TargetType, required: true })
  targetType: TargetType

  @ApiProperty({ description: "ID of the target (Post or Comment)" })
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  targetId: MongooseSchema.Types.ObjectId

  @ApiProperty({ description: "Timestamp when the reaction was created" })
  createdAt: Date
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction)

// Create a compound index to ensure a user can only react once to a target
ReactionSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true })
