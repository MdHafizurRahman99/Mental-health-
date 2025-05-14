import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { Group } from "src/backend/groups/schemas/group.schema"
import { User } from "src/backend/user/schemas/user.schema"

export type PostDocument = Post & Document

@Schema({ timestamps: true })
export class Post {
  @ApiProperty({ description: "Unique identifier for the post" })
  _id: MongooseSchema.Types.ObjectId

  @ApiProperty({ description: "Reference to the user who created the post" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  authorId: User

  @ApiProperty({ description: "Reference to the group where the post was created (optional)" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Group" })
  groupId?: Group

  @ApiProperty({ description: "Text content of the post" })
  @Prop({ required: true })
  content: string

  @ApiProperty({ description: "Array of media URLs (images, videos)" })
  @Prop([String])
  mediaUrls: string[]

  @ApiProperty({ description: "Array of tags associated with the post" })
  @Prop([String])
  tags: string[]

  @ApiProperty({ description: "Count of comments on the post" })
  @Prop({ default: 0 })
  commentsCount: number

  @ApiProperty({ description: "Count of reactions on the post" })
  @Prop({ default: 0 })
  reactionsCount: number

  @ApiProperty({ description: "Count of shares of the post" })
  @Prop({ default: 0 })
  sharesCount: number

  @ApiProperty({ description: "Timestamp when the post was created" })
  createdAt: Date

  @ApiProperty({ description: "Timestamp when the post was last updated" })
  updatedAt: Date
}

export const PostSchema = SchemaFactory.createForClass(Post)
