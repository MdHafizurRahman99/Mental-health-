import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator"
import { InteractionType } from "../schemas/ai-log.entity"

export class CreateAiLogDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string

  @IsNotEmpty()
  @IsEnum(InteractionType)
  interactionType: InteractionType

  @IsNotEmpty()
  @IsString()
  request: string

  @IsNotEmpty()
  @IsString()
  response: string
}
