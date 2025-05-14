import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsMongoId, IsNotEmpty, ValidateNested } from "class-validator"
import { NotificationType, ReferenceType } from "../schemas/notification.schema"
import { Type } from "class-transformer"
import { Types } from "mongoose"

export class ReferenceDto {
  @ApiProperty({
    description: "Type of the target",
    enum: ReferenceType,
    example: ReferenceType.POST,
  })
  @IsNotEmpty()
  @IsEnum(ReferenceType)
  targetType: ReferenceType

  @ApiProperty({
    description: "ID of the target",
    example: "60d21b4667d0d8992e610c85",
  })
  @IsNotEmpty()
  @IsMongoId()
  targetId: Types.ObjectId
}

export class CreateNotificationDto {
  @ApiProperty({
    description: "ID of the user receiving the notification",
    example: "60d21b4667d0d8992e610c86",
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: Types.ObjectId

  @ApiProperty({
    description: "Type of notification",
    enum: NotificationType,
    example: NotificationType.REACTION,
  })
  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType

  @ApiProperty({
    description: "Reference to the target object",
    type: ReferenceDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ReferenceDto)
  reference: ReferenceDto
}
