import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator"
import { MessageRole } from "../schemas/chat.entity"

export class CreateChatDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string

  @IsNotEmpty()
  @IsEnum(MessageRole)
  role: MessageRole

  @IsNotEmpty()
  @IsString()
  message: string
}
