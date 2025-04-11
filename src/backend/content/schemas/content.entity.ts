import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export enum ContentType {
  ARTICLE = "article",
  AUDIO = "audio",
  VIDEO = "video",
}

@Schema({ timestamps: true })
export class Content extends Document {
  @Prop({ required: true })
  title: string

  @Prop({ type: String, enum: ContentType, required: true })
  type: ContentType

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  url: string

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date
}

export const ContentSchema = SchemaFactory.createForClass(Content)
