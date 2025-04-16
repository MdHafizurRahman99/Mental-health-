import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
// Add imports at the top
import { ApiProperty } from "@nestjs/swagger"
import { User } from "src/backend/user/schemas/user.schema"

export enum InteractionType {
  CHATBOT = "chatbot",
  RECOMMENDATION = "recommendation",
  MOOD_ANALYSIS = "moodAnalysis",
}

@Schema()
export class AiLog extends Document {
  // @ApiProperty({ description: "The unique identifier of the AI log", example: "60d21b4667d0d8992e610c85" })
  // _id: string

  @ApiProperty({ description: "Reference to the user", example: "60d21b4667d0d8992e610c85" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: User

  @ApiProperty({
    description: "Type of AI interaction",
    enum: InteractionType,
    example: InteractionType.CHATBOT,
  })
  @Prop({ type: String, enum: InteractionType, required: true })
  interactionType: InteractionType

  @ApiProperty({
    description: "The input sent to the AI",
    example: "How can I improve my sleep habits?",
  })
  @Prop({ required: true })
  request: string

  @ApiProperty({
    description: "The AI-generated response",
    example: "To improve your sleep habits, consider establishing a regular sleep schedule...",
  })
  @Prop({ required: true })
  response: string

  @ApiProperty({ description: "Timestamp when the interaction occurred", example: "2023-01-01T00:00:00.000Z" })
  @Prop({ required: true, default: Date.now })
  timestamp: Date
}

export const AiLogSchema = SchemaFactory.createForClass(AiLog)
