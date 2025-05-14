import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "src/backend/user/schemas/user.schema"

export type GroupDocument = Group & Document

@Schema({ timestamps: true })
export class Group {
  @ApiProperty({ description: "Unique identifier for the group" })
  _id: MongooseSchema.Types.ObjectId

  @ApiProperty({ description: "Name of the group" })
  @Prop({ required: true })
  name: string

  @ApiProperty({ description: "Description of the group" })
  @Prop({ required: true })
  description: string

  @ApiProperty({ description: "URL to the group's cover image" })
  @Prop()
  coverImageUrl?: string

  @ApiProperty({ description: "Reference to the user who created the group" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  createdBy: User

  @ApiProperty({ description: "Timestamp when the group was created" })
  createdAt: Date
}

export const GroupSchema = SchemaFactory.createForClass(Group)
