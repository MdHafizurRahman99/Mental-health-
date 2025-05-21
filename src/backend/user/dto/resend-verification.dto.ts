import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

export class ResendVerificationDto {
  @ApiProperty({
    description: "Email address of the user",
    example: "john@example.com",
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string
}
