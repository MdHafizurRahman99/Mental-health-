import { PartialType } from "@nestjs/mapped-types"
import { CreatePostDto } from "./create-post.dto"
import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsOptional, IsString } from "class-validator"

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: "Text content of the post",
    example: "Updated post content",
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string

  @ApiProperty({
    description: "Array of media URLs (images, videos)",
    example: ["https://example.com/image1.jpg", "https://example.com/video1.mp4"],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaUrls?: string[]

  @ApiProperty({
    description: "Array of tags associated with the post",
    example: ["travel", "photography"],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]
}
