import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { MessageRole } from "../schemas/chat.entity"

export class CreateChatDto {
  @ApiProperty({ description: "ID of the user in the conversation", example: "60d21b4667d0d8992e610c85" })
  @IsNotEmpty()
  @IsMongoId()
  userId: string

  @ApiProperty({
    description: "Role of the message sender",
    enum: MessageRole,
    example: MessageRole.USER,
  })
  @IsNotEmpty()
  @IsEnum(MessageRole)
  role: MessageRole

  @ApiProperty({
    description: "Text content of the message",
    example: "How can I manage my anxiety?",
  })
  @IsNotEmpty()
  @IsString()
  message: string
}
