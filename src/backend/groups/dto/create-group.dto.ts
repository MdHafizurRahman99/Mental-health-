import { ApiProperty } from "@nestjs/swagger"
import { IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator"
import { Types } from "mongoose"

export class CreateGroupDto {
  @ApiProperty({
    description: "Name of the group",
    example: "Photography Enthusiasts",
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: "Description of the group",
    example: "A group for sharing photography tips and showcasing your best shots",
  })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({
    description: "URL to the group's cover image",
    example: "https://example.com/images/photography-cover.jpg",
    required: false,
  })
  @IsOptional()
  @IsUrl()
  coverImageUrl?: string

  @ApiProperty({
    description: "ID of the user creating the group",
    example: "60d21b4667d0d8992e610c85",
  })
  @IsNotEmpty()
  @IsMongoId()
  createdBy: Types.ObjectId
}
