import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { Post } from "../../posts/schemas/post.schema"
import { User } from "src/backend/user/schemas/user.schema"

export type CommentDocument = Comment & Document

@Schema({ timestamps: true })
export class Comment {
  @ApiProperty({ description: "Unique identifier for the comment" })
  _id: MongooseSchema.Types.ObjectId

  @ApiProperty({ description: "Reference to the post being commented on" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Post", required: true })
  postId: Post

  @ApiProperty({ description: "Reference to the user who created the comment" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  authorId: User

  @ApiProperty({ description: "Text content of the comment" })
  @Prop({ required: true })
  content: string

  @ApiProperty({ description: "Reference to the parent comment (for replies)" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Comment" })
  parentCommentId?: Comment

  @ApiProperty({ description: "Count of reactions on the comment" })
  @Prop({ default: 0 })
  reactionsCount: number

  @ApiProperty({ description: "Timestamp when the comment was created" })
  createdAt: Date

  @ApiProperty({ description: "Timestamp when the comment was last updated" })
  updatedAt: Date
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
