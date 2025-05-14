import { PartialType } from "@nestjs/mapped-types"
import { CreateGroupDto } from "./create-group.dto"
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, IsUrl } from "class-validator"

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @ApiProperty({
    description: "Name of the group",
    example: "Photography Enthusiasts",
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({
    description: "Description of the group",
    example: "A group for sharing photography tips and showcasing your best shots",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    description: "URL to the group's cover image",
    example: "https://example.com/images/photography-cover.jpg",
    required: false,
  })
  @IsOptional()
  @IsUrl()
  coverImageUrl?: string
}
