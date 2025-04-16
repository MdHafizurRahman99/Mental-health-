import { PartialType } from "@nestjs/mapped-types"
import { CreateChatDto } from "./create-chat.dto"
import { ApiProperty } from "@nestjs/swagger"

enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
}

export class UpdateChatDto extends PartialType(CreateChatDto) {
  @ApiProperty({
    description: "Role of the message sender",
    enum: MessageRole,
    example: MessageRole.USER,
    required: false,
  })
  role?: MessageRole

  @ApiProperty({
    description: "Text content of the message",
    example: "How can I manage my anxiety?",
    required: false,
  })
  message?: string
}
