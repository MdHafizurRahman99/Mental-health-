import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { User } from "src/backend/user/schemas/user.schema"

export enum InteractionType {
  CHATBOT = "chatbot",
  RECOMMENDATION = "recommendation",
  MOOD_ANALYSIS = "moodAnalysis",
}

@Schema()
export class AiLog extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: User

  @Prop({ type: String, enum: InteractionType, required: true })
  interactionType: InteractionType

  @Prop({ required: true })
  request: string

  @Prop({ required: true })
  response: string

  @Prop({ required: true, default: Date.now })
  timestamp: Date
}

export const AiLogSchema = SchemaFactory.createForClass(AiLog)
