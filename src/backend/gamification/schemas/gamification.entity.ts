import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "src/backend/user/schemas/user.schema"

@Schema({ timestamps: true })
export class Gamification extends Document {
  

  @ApiProperty({ description: "Reference to the user", example: "60d21b4667d0d8992e610c85" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true, unique: true })
  userId: User

  @ApiProperty({ description: "Accumulated points", example: 250, default: 0 })
  @Prop({ default: 0 })
  points: number

  @ApiProperty({
    description: "Array of earned badges",
    example: ["first_login", "week_streak", "meditation_master"],
    default: [],
  })
  @Prop({ type: [String], default: [] })
  badges: string[]

  @ApiProperty({ description: "Count of consecutive daily check-ins", example: 5, default: 0 })
  @Prop({ default: 0 })
  checkInStreak: number

  @ApiProperty({
    description: "Array of additional achievements",
    example: ["completed_all_assessments", "shared_app"],
    default: [],
  })
  @Prop({ type: [String], default: [] })
  achievements: string[]

  @ApiProperty({ description: "Timestamp when the profile was created", example: "2023-01-01T00:00:00.000Z" })
  @Prop()
  createdAt: Date

  @ApiProperty({ description: "Timestamp when the profile was last updated", example: "2023-01-01T00:00:00.000Z" })
  @Prop()
  updatedAt: Date
}

export const GamificationSchema = SchemaFactory.createForClass(Gamification)
