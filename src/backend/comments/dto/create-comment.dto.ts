import { ApiProperty } from "@nestjs/swagger"
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Types } from "mongoose"

export class CreateCommentDto {
  @ApiProperty({
    description: "ID of the post being commented on",
    example: "60d21b4667d0d8992e610c85",
  })
  @IsNotEmpty()
  @IsMongoId()
  postId: Types.ObjectId

  @ApiProperty({
    description: "ID of the user creating the comment",
    example: "60d21b4667d0d8992e610c86",
  })
  @IsNotEmpty()
  @IsMongoId()
  authorId: Types.ObjectId

  @ApiProperty({
    description: "Text content of the comment",
    example: "This is a great post!",
  })
  @IsNotEmpty()
  @IsString()
  content: string

  @ApiProperty({
    description: "ID of the parent comment (for replies)",
    example: "60d21b4667d0d8992e610c87",
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  parentCommentId?: Types.ObjectId
}
