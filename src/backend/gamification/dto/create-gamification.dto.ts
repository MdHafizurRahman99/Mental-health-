import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateGamificationDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string

  @IsOptional()
  @IsNumber()
  points?: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  badges?: string[]

  @IsOptional()
  @IsNumber()
  checkInStreak?: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[]
}
