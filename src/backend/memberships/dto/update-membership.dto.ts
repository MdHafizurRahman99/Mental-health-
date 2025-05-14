import { ApiProperty } from "@nestjs/swagger"
import { IsEnum } from "class-validator"
import { MembershipRole } from "../schemas/membership.schema"

export class UpdateMembershipDto {
  @ApiProperty({
    description: "Role of the user in the group",
    enum: MembershipRole,
    example: MembershipRole.MODERATOR,
  })
  @IsEnum(MembershipRole)
  role: MembershipRole
}
