import { ApiProperty } from "@nestjs/swagger"
import { IsEnum } from "class-validator"
import { ReportStatus } from "../schemas/report.schema"

export class UpdateReportDto {
  @ApiProperty({
    description: "Current status of the report",
    enum: ReportStatus,
    example: ReportStatus.REVIEWED,
  })
  @IsEnum(ReportStatus)
  status: ReportStatus
}
