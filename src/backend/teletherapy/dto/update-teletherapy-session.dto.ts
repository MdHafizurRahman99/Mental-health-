import { PartialType } from "@nestjs/mapped-types"
import { CreateTeletherapySessionDto } from "./create-teletherapy-session.dto"
import { ApiProperty } from "@nestjs/swagger"
import { SessionStatus } from "../schemas/teletherapy-session.entity"

export class UpdateTeletherapySessionDto extends PartialType(CreateTeletherapySessionDto) {
  @ApiProperty({
    description: "Scheduled date and time of the session",
    example: "2023-01-01T14:00:00.000Z",
    required: false,
  })
  sessionDate?: Date

  @ApiProperty({
    description: "Length of the session in minutes",
    example: 60,
    minimum: 15,
    required: false,
  })
  duration?: number

  @ApiProperty({
    description: "Current status of the session",
    enum: SessionStatus,
    example: SessionStatus.COMPLETED,
    required: false,
  })
  status?: SessionStatus

  @ApiProperty({
    description: "Session notes or feedback",
    example: "Patient showed progress in managing anxiety triggers.",
    required: false,
  })
  notes?: string
}
