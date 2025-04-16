import { PartialType } from "@nestjs/mapped-types"
import { CreateContentDto } from "./create-content.dto"
import { ApiProperty } from "@nestjs/swagger"
import { ContentType } from "../schemas/content.entity"

export class UpdateContentDto extends PartialType(CreateContentDto) {
  @ApiProperty({ description: "Title of the content item", example: "Managing Stress in Daily Life", required: false })
  title?: string

  @ApiProperty({
    description: "Type of content",
    enum: ContentType,
    example: ContentType.ARTICLE,
    required: false,
  })
  type?: ContentType

  @ApiProperty({
    description: "Brief description of the content",
    example: "Learn effective strategies to manage stress in your daily routine.",
    required: false,
  })
  description?: string

  @ApiProperty({
    description: "URL linking to the hosted content",
    example: "https://example.com/content/stress-management",
    required: false,
  })
  url?: string
}
