import { PartialType } from "@nestjs/mapped-types"
import { CreateGamificationDto } from "./create-gamification.dto"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateGamificationDto extends PartialType(CreateGamificationDto) {
  @ApiProperty({
    description: "Accumulated points",
    example: 250,
    required: false,
  })
  points?: number

  @ApiProperty({
    description: "Array of earned badges",
    example: ["first_login", "week_streak", "meditation_master"],
    required: false,
  })
  badges?: string[]

  @ApiProperty({
    description: "Count of consecutive daily check-ins",
    example: 5,
    required: false,
  })
  checkInStreak?: number

  @ApiProperty({
    description: "Array of additional achievements",
    example: ["completed_all_assessments", "shared_app"],
    required: false,
  })
  achievements?: string[]
}
