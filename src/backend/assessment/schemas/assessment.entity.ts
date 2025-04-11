import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import type { User } from "../../users/entities/user.entity"

export enum AssessmentType {
  QUIZ = "quiz",
  CHECKIN = "checkin",
}

@Schema()
export class Assessment extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: User

  @Prop({ type: String, enum: AssessmentType, required: true })
  type: AssessmentType

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  responses: Record<string, number>

  @Prop({ required: true, default: Date.now })
  date: Date
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment)
