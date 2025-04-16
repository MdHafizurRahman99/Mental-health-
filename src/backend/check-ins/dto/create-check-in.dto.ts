import { IsMongoId, IsNotEmpty, IsNumber, Max, Min } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateCheckInDto {
  @ApiProperty({ description: "ID of the user", example: "60d21b4667d0d8992e610c85" })
  @IsNotEmpty()
  @IsMongoId()
  userId: string

  @ApiProperty({
    description: "Numeric score representing the current mood (1-10)",
    example: 7,
    minimum: 1,
    maximum: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10)
  mood: number
}
