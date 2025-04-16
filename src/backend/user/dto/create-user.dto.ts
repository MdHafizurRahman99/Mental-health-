import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator"
import { UserRole } from "../schemas/user.schema"

export class CreateUserDto {
  @ApiProperty({ description: "Full name of the user", example: "John Doe" })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ description: "Unique email address of the user", example: "john.doe@example.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: "Password for the user account (will be hashed)",
    example: "securePassword123",
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string

  @ApiProperty({
    description: "Role of the user",
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole = UserRole.USER
}
