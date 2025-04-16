import { IsDate, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { SessionStatus } from "../schemas/teletherapy-session.entity"

export class CreateTeletherapySessionDto {
  @ApiProperty({ description: "ID of the user booking the session", example: "60d21b4667d0d8992e610c85" })
  @IsNotEmpty()
  @IsMongoId()
  userId: string

  @ApiProperty({ description: "ID of the therapist", example: "60d21b4667d0d8992e610c85" })
  @IsNotEmpty()
  @IsMongoId()
  therapistId: string

  @ApiProperty({ description: "Scheduled date and time of the session", example: "2023-01-01T14:00:00.000Z" })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  sessionDate: Date

  @ApiProperty({
    description: "Length of the session in minutes",
    example: 60,
    minimum: 15,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(15)
  duration: number

  @ApiProperty({
    description: "Current status of the session",
    enum: SessionStatus,
    example: SessionStatus.SCHEDULED,
    default: SessionStatus.SCHEDULED,
    required: false,
  })
  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus

  @ApiProperty({
    description: "Session notes or feedback",
    example: "Patient showed progress in managing anxiety triggers.",
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string
}
