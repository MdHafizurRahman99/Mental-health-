import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { User } from "src/backend/user/schemas/user.schema"

@Schema()
export class CheckIn extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: User

  @Prop({ required: true, min: 1, max: 10 })
  mood: number

  @Prop({ required: true, default: Date.now })
  date: Date
}

export const CheckInSchema = SchemaFactory.createForClass(CheckIn)
