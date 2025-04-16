import { PartialType } from "@nestjs/mapped-types"
import { CreateAssessmentDto } from "./create-assessment.dto"
import { ApiProperty } from "@nestjs/swagger"
import { AssessmentType } from "../schemas/assessment.entity"

// enum AssessmentType {
//   QUIZ = "quiz",
//   SURVEY = "survey",
// }

export class UpdateAssessmentDto extends PartialType(CreateAssessmentDto) {
  @ApiProperty({
    description: "Type of assessment",
    enum: AssessmentType,
    example: AssessmentType.QUIZ,
    required: false,
  })
  type?: AssessmentType

  @ApiProperty({
    description: "Assessment responses as key-value pairs",
    example: { stress: 5, anxiety: 4, depression: 3 },
    required: false,
  })
  responses?: Record<string, number>
}
