import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { User } from "src/backend/user/schemas/user.schema"

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
}

@Schema()
export class Chat extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: User

  @Prop({ type: String, enum: MessageRole, required: true })
  role: MessageRole

  @Prop({ required: true })
  message: string

  @Prop({ required: true, default: Date.now })
  timestamp: Date
}

export const ChatSchema = SchemaFactory.createForClass(Chat)
