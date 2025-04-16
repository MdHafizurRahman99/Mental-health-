import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { InteractionType } from "../schemas/ai-log.entity"

export class CreateAiLogDto {
  @ApiProperty({ description: "ID of the user", example: "60d21b4667d0d8992e610c85" })
  @IsNotEmpty()
  @IsMongoId()
  userId: string

  @ApiProperty({
    description: "Type of AI interaction",
    enum: InteractionType,
    example: InteractionType.CHATBOT,
  })
  @IsNotEmpty()
  @IsEnum(InteractionType)
  interactionType: InteractionType

  @ApiProperty({
    description: "The input sent to the AI",
    example: "How can I improve my sleep habits?",
  })
  @IsNotEmpty()
  @IsString()
  request: string

  @ApiProperty({
    description: "The AI-generated response",
    example: "To improve your sleep habits, consider establishing a regular sleep schedule...",
  })
  @IsNotEmpty()
  @IsString()
  response: string
}
