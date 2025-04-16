import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "src/backend/user/schemas/user.schema"

@Schema()
export class CheckIn extends Document {

  @ApiProperty({ description: "Reference to the user", example: "60d21b4667d0d8992e610c85" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: User

  @ApiProperty({
    description: "Numeric score representing the current mood (1-10)",
    example: 7,
    minimum: 1,
    maximum: 10,
  })
  @Prop({ required: true, min: 1, max: 10 })
  mood: number

  @ApiProperty({ description: "Timestamp of the check-in", example: "2023-01-01T00:00:00.000Z" })
  @Prop({ required: true, default: Date.now })
  date: Date
}

export const CheckInSchema = SchemaFactory.createForClass(CheckIn)
