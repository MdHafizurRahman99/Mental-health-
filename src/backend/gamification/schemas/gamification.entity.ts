import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { User } from "src/backend/user/schemas/user.schema"

@Schema({ timestamps: true })
export class Gamification extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true, unique: true })
  userId: User

  @Prop({ default: 0 })
  points: number

  @Prop({ type: [String], default: [] })
  badges: string[]

  @Prop({ default: 0 })
  checkInStreak: number

  @Prop({ type: [String], default: [] })
  achievements: string[]

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date
}

export const GamificationSchema = SchemaFactory.createForClass(Gamification)
