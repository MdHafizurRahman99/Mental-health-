import { IsEnum, IsMongoId, IsNotEmpty, IsObject } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { AssessmentType } from "../schemas/assessment.entity"

export class CreateAssessmentDto {
  @ApiProperty({ description: "ID of the user taking the assessment", example: "60d21b4667d0d8992e610c85" })
  @IsNotEmpty()
  @IsMongoId()
  userId: string

  @ApiProperty({
    description: "Type of assessment",
    enum: AssessmentType,
    example: AssessmentType.QUIZ,
  })
  @IsNotEmpty()
  @IsEnum(AssessmentType)
  type: AssessmentType

  @ApiProperty({
    description: "Assessment responses as key-value pairs",
    example: { stress: 5, anxiety: 4, depression: 3 },
  })
  @IsNotEmpty()
  @IsObject()
  responses: Record<string, number>
}
