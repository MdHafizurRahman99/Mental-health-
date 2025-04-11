import { IsDate, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator"
import { Type } from "class-transformer"
import { SessionStatus } from "../schemas/teletherapy-session.entity"
export class CreateTeletherapySessionDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string

  @IsNotEmpty()
  @IsMongoId()
  therapistId: string

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  sessionDate: Date

  @IsNotEmpty()
  @IsNumber()
  @Min(15)
  duration: number

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus

  @IsOptional()
  @IsString()
  notes?: string
}
