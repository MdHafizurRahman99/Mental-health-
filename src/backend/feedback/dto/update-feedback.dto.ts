import { PartialType } from "@nestjs/mapped-types"
import { CreateFeedbackDto } from "./create-feedback.dto"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {
  @ApiProperty({ description: "Brief subject/title for the feedback", example: "App Suggestion", required: false })
  subject?: string

  @ApiProperty({
    description: "Detailed feedback content",
    example: "I would like to suggest adding a dark mode option to the app.",
    required: false,
  })
  message?: string

  @ApiProperty({
    description: "Optional rating (1-5)",
    example: 4,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  rating?: number
}
