import { PartialType } from "@nestjs/mapped-types"
import { CreateCommentDto } from "./create-comment.dto"
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty({
    description: "Text content of the comment",
    example: "Updated comment content",
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string
}
