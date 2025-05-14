import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsMongoId, IsNotEmpty, IsString, MaxLength } from "class-validator"
import { ReportTargetType } from "../schemas/report.schema"
import { Types } from "mongoose"

export class CreateReportDto {
  @ApiProperty({
    description: "ID of the user submitting the report",
    example: "60d21b4667d0d8992e610c85",
  })
  @IsNotEmpty()
  @IsMongoId()
  reporterId: Types.ObjectId

  @ApiProperty({
    description: "Type of content being reported",
    enum: ReportTargetType,
    example: ReportTargetType.POST,
  })
  @IsNotEmpty()
  @IsEnum(ReportTargetType)
  targetType: ReportTargetType

  @ApiProperty({
    description: "ID of the content being reported",
    example: "60d21b4667d0d8992e610c86",
  })
  @IsNotEmpty()
  @IsMongoId()
  targetId: Types.ObjectId

  @ApiProperty({
    description: "Reason for the report",
    example: "This post contains inappropriate content",
    maxLength: 500,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  reason: string
}
