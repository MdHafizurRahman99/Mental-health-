import { PartialType } from "@nestjs/mapped-types"
import { CreateCheckInDto } from "./create-check-in.dto"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateCheckInDto extends PartialType(CreateCheckInDto) {
  @ApiProperty({
    description: "Numeric score representing the current mood (1-10)",
    example: 7,
    minimum: 1,
    maximum: 10,
    required: false,
  })
  mood?: number
}
