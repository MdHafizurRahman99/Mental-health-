import { IsEnum, IsMongoId, IsNotEmpty, IsObject } from "class-validator"
import { AssessmentType } from "../entities/assessment.entity"

export class CreateAssessmentDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string

  @IsNotEmpty()
  @IsEnum(AssessmentType)
  type: AssessmentType

  @IsNotEmpty()
  @IsObject()
  responses: Record<string, number>
}
