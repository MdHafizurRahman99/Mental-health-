import { IsMongoId, IsNotEmpty, IsNumber, Max, Min } from "class-validator"

export class CreateCheckInDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10)
  mood: number
}
