import { PartialType } from "@nestjs/mapped-types"
import { CreateUserProfileDto } from "./create-user-profile.dto"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateUserProfileDto extends PartialType(CreateUserProfileDto) {
  @ApiProperty({
    description: "User ID is not required for updates",
    required: false,
  })
  userId?: string
}
