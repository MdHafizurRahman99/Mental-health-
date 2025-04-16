import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "src/backend/user/schemas/user.schema"

export enum SessionStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Schema()
export class TeletherapySession extends Document {


  @ApiProperty({ description: "Reference to the user booking the session", example: "60d21b4667d0d8992e610c85" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: User
  @ApiProperty({ description: "Reference to the therapist", example: "60d21b4667d0d8992e610c85" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  therapistId: User

  @ApiProperty({ description: "Scheduled date and time of the session", example: "2023-01-01T14:00:00.000Z" })
  @Prop({ required: true })
  sessionDate: Date

  @ApiProperty({
    description: "Length of the session in minutes",
    example: 60,
    minimum: 15,
  })
  @Prop({ required: true })
  duration: number

  @ApiProperty({
    description: "Current status of the session",
    enum: SessionStatus,
    example: SessionStatus.SCHEDULED,
    default: SessionStatus.SCHEDULED,
  })
  @Prop({ type: String, enum: SessionStatus, default: SessionStatus.SCHEDULED })
  status: SessionStatus

  @ApiProperty({
    description: "Session notes or feedback",
    example: "Patient showed progress in managing anxiety triggers.",
    required: false,
  })
  @Prop()
  notes: string
}

export const TeletherapySessionSchema = SchemaFactory.createForClass(TeletherapySession)
