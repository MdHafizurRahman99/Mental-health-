import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "src/backend/user/schemas/user.schema"

@Schema({ timestamps: true })
export class Feedback extends Document {

  @ApiProperty({ description: "Reference to the user providing feedback", example: "60d21b4667d0d8992e610c85" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: User

  @ApiProperty({ description: "Brief subject/title for the feedback", example: "App Suggestion" })
  @Prop({ required: true })
  subject: string

  @ApiProperty({
    description: "Detailed feedback content",
    example: "I would like to suggest adding a dark mode option to the app.",
  })
  @Prop({ required: true })
  message: string

  @ApiProperty({
    description: "Optional rating (1-5)",
    example: 4,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @Prop({ min: 1, max: 5 })
  rating: number

  @ApiProperty({ description: "Timestamp of submission", example: "2023-01-01T00:00:00.000Z" })
  @Prop()
  createdAt: Date
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback)
