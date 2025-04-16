import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
// Add imports at the top
import { ApiProperty } from "@nestjs/swagger"
import { User } from "src/backend/user/schemas/user.schema"

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
}

@Schema()
export class Chat extends Document {


  @ApiProperty({ description: "Reference to the user in the conversation", example: "60d21b4667d0d8992e610c85" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: User

  @ApiProperty({
    description: "Role of the message sender",
    enum: MessageRole,
    example: MessageRole.USER,
  })
  @Prop({ type: String, enum: MessageRole, required: true })
  role: MessageRole

  @ApiProperty({
    description: "Text content of the message",
    example: "How can I manage my anxiety?",
  })
  @Prop({ required: true })
  message: string

  @ApiProperty({ description: "Timestamp when the message was sent", example: "2023-01-01T00:00:00.000Z" })
  @Prop({ required: true, default: Date.now })
  timestamp: Date
}

export const ChatSchema = SchemaFactory.createForClass(Chat)
