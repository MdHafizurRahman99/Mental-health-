import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsMongoId, IsNotEmpty } from "class-validator"
import { MembershipRole } from "../schemas/membership.schema"
import { Types } from "mongoose"

export class CreateMembershipDto {
  @ApiProperty({
    description: "ID of the group",
    example: "60d21b4667d0d8992e610c85",
  })
  @IsNotEmpty()
  @IsMongoId()
  groupId: string

  @ApiProperty({
    description: "ID of the user",
    example: "60d21b4667d0d8992e610c86",
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: Types.ObjectId

  @ApiProperty({
    description: "Role of the user in the group",
    enum: MembershipRole,
    default: MembershipRole.MEMBER,
    example: MembershipRole.MEMBER,
  })
  @IsEnum(MembershipRole)
  role: MembershipRole = MembershipRole.MEMBER


}
