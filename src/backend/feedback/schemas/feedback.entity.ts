import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { User } from "src/backend/user/schemas/user.schema"

@Schema({ timestamps: true })
export class Feedback extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: User

  @Prop({ required: true })
  subject: string

  @Prop({ required: true })
  message: string

  @Prop({ min: 1, max: 5 })
  rating: number

  @Prop()
  createdAt: Date
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback)
