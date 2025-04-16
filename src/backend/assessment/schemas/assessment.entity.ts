import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "src/backend/user/schemas/user.schema"

export enum AssessmentType {
  QUIZ = "quiz",
  CHECKIN = "checkin",
}

@Schema()
export class Assessment extends Document {
  @ApiProperty({ description: "Reference to the user who took the assessment", example: "60d21b4667d0d8992e610c85" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: User

  @ApiProperty({
    description: "Type of assessment",
    enum: AssessmentType,
    example: AssessmentType.QUIZ,
  })
  @Prop({ type: String, enum: AssessmentType, required: true })
  type: AssessmentType

  @ApiProperty({
    description: "Assessment responses as key-value pairs",
    example: { stress: 5, anxiety: 4, depression: 3 },
  })
  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  responses: Record<string, number>

  @ApiProperty({ description: "Timestamp when the assessment was submitted", example: "2023-01-01T00:00:00.000Z" })
  @Prop({ required: true, default: Date.now })
  date: Date
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment)
