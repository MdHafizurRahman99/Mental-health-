import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateGamificationDto {
  @ApiProperty({ description: "ID of the user", example: "60d21b4667d0d8992e610c85" })
  @IsNotEmpty()
  @IsMongoId()
  userId: string

  @ApiProperty({
    description: "Accumulated points",
    example: 250,
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  points?: number

  @ApiProperty({
    description: "Array of earned badges",
    example: ["first_login", "week_streak", "meditation_master"],
    default: [],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  badges?: string[]

  @ApiProperty({
    description: "Count of consecutive daily check-ins",
    example: 5,
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  checkInStreak?: number

  @ApiProperty({
    description: "Array of additional achievements",
    example: ["completed_all_assessments", "shared_app"],
    default: [],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[]
}
