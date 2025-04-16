import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"
import { ApiProperty } from "@nestjs/swagger"

export enum ContentType {
  ARTICLE = "article",
  AUDIO = "audio",
  VIDEO = "video",
}

@Schema({ timestamps: true })
export class Content extends Document {

  @ApiProperty({ description: "Title of the content item", example: "Managing Stress in Daily Life" })
  @Prop({ required: true })
  title: string

  @ApiProperty({
    description: "Type of content",
    enum: ContentType,
    example: ContentType.ARTICLE,
  })
  @Prop({ type: String, enum: ContentType, required: true })
  type: ContentType

  @ApiProperty({
    description: "Brief description of the content",
    example: "Learn effective strategies to manage stress in your daily routine.",
  })
  @Prop({ required: true })
  description: string

  @ApiProperty({
    description: "URL linking to the hosted content",
    example: "https://example.com/content/stress-management",
  })
  @Prop({ required: true })
  url: string

  @ApiProperty({ description: "Timestamp when the content was created", example: "2023-01-01T00:00:00.000Z" })
  @Prop()
  createdAt: Date

  @ApiProperty({ description: "Timestamp when the content was last updated", example: "2023-01-01T00:00:00.000Z" })
  @Prop()
  updatedAt: Date
}

export const ContentSchema = SchemaFactory.createForClass(Content)
