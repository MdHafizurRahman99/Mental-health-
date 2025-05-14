import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean } from "class-validator"

export class UpdateNotificationDto {
  @ApiProperty({
    description: "Whether the notification has been read",
    example: true,
  })
  @IsBoolean()
  isRead: boolean
}
