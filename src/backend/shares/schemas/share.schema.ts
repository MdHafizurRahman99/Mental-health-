import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import {ApiProperty } from "@nestjs/swagger"
import { Post } from "../../posts/schemas/post.schema"
import { User } from "src/backend/user/schemas/user.schema"

export type ShareDocument = Share & Document

@Schema({ timestamps: true })
export class Share {
  @ApiProperty({ description: "Unique identifier for the share" })
  _id: MongooseSchema.Types.ObjectId

  @ApiProperty({ description: "Reference to the user who shared the post" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: User

  @ApiProperty({ description: "Reference to the post being shared" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Post", required: true })
  postId: Post

  @ApiProperty({ description: "Timestamp when the share was created" })
  createdAt: Date
}

export const ShareSchema = SchemaFactory.createForClass(Share)

// Create a compound index to ensure a user can only share a post once
ShareSchema.index({ userId: 1, postId: 1 }, { unique: true })
