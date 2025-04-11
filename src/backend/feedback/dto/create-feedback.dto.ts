import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string

  @IsNotEmpty()
  @IsString()
  subject: string

  @IsNotEmpty()
  @IsString()
  message: string

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number
}
