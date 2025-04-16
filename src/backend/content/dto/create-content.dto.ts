import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsString, IsUrl } from "class-validator"
import { ContentType } from "../schemas/content.entity"

export class CreateContentDto {
  @ApiProperty({ description: "Title of the content item", example: "Managing Stress in Daily Life" })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty({
    description: "Type of content",
    enum: ContentType,
    example: ContentType.ARTICLE,
  })
  @IsNotEmpty()
  @IsEnum(ContentType)
  type: ContentType

  @ApiProperty({
    description: "Brief description of the content",
    example: "Learn effective strategies to manage stress in your daily routine.",
  })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({
    description: "URL linking to the hosted content",
    example: "https://example.com/content/stress-management",
  })
  @IsNotEmpty()
  @IsUrl()
  url: string
}
