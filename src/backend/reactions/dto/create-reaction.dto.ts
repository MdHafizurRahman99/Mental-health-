import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsMongoId, IsNotEmpty } from "class-validator"
import { TargetType } from "../schemas/reaction.schema"
import { Types } from "mongoose"

export class CreateReactionDto {
  @ApiProperty({
    description: "ID of the user creating the reaction",
    example: "60d21b4667d0d8992e610c85",
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: Types.ObjectId

  @ApiProperty({
    description: "Type of target (Post or Comment)",
    enum: TargetType,
    example: TargetType.POST,
  })
  @IsNotEmpty()
  @IsEnum(TargetType)
  targetType: TargetType

  @ApiProperty({
    description: "ID of the target (Post or Comment)",
    example: "60d21b4667d0d8992e610c86",
  })
  @IsNotEmpty()
  @IsMongoId()
  targetId: Types.ObjectId
}
