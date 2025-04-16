import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateFeedbackDto {
  @ApiProperty({ description: "ID of the user providing feedback", example: "60d21b4667d0d8992e610c85" })
  @IsNotEmpty()
  @IsMongoId()
  userId: string

  @ApiProperty({ description: "Brief subject/title for the feedback", example: "App Suggestion" })
  @IsNotEmpty()
  @IsString()
  subject: string

  @ApiProperty({
    description: "Detailed feedback content",
    example: "I would like to suggest adding a dark mode option to the app.",
  })
  @IsNotEmpty()
  @IsString()
  message: string

  @ApiProperty({
    description: "Optional rating (1-5)",
    example: 4,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number
}
