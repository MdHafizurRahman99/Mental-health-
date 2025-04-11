import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { User } from "src/backend/user/schemas/user.schema"

export enum SessionStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Schema()
export class TeletherapySession extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: User

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  therapistId: User

  @Prop({ required: true })
  sessionDate: Date

  @Prop({ required: true })
  duration: number

  @Prop({ type: String, enum: SessionStatus, default: SessionStatus.SCHEDULED })
  status: SessionStatus

  @Prop()
  notes: string
}

export const TeletherapySessionSchema = SchemaFactory.createForClass(TeletherapySession)
