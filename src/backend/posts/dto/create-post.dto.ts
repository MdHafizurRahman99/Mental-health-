import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Types } from "mongoose"

export class CreatePostDto {
  @ApiProperty({
    description: "ID of the user creating the post",
    example: "60d21b4667d0d8992e610c85",
  })
  @IsNotEmpty()
  @IsMongoId()
  authorId: Types.ObjectId

  @ApiProperty({
    description: "ID of the group where the post is being created (optional)",
    example: "60d21b4667d0d8992e610c86",
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  groupId?: Types.ObjectId

  @ApiProperty({
    description: "Text content of the post",
    example: "This is my first post!",
  })
  @IsNotEmpty()
  @IsString()
  content: string

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
