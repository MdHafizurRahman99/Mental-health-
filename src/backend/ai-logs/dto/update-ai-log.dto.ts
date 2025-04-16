import { PartialType } from "@nestjs/mapped-types"
import { CreateAiLogDto } from "./create-ai-log.dto"
import { ApiProperty } from "@nestjs/swagger"

enum InteractionType {
  CHATBOT = "chatbot",
  ASSISTANT = "assistant",
  AGENT = "agent",
}

export class UpdateAiLogDto extends PartialType(CreateAiLogDto) {
  @ApiProperty({
    description: "Type of AI interaction",
    enum: InteractionType,
    example: InteractionType.CHATBOT,
    required: false,
  })
  InteractionType?: InteractionType

  @ApiProperty({
    description: "The input sent to the AI",
    example: "How can I improve my sleep habits?",
    required: false,
  })
  request?: string

  @ApiProperty({
    description: "The AI-generated response",
    example: "To improve your sleep habits, consider establishing a regular sleep schedule...",
    required: false,
  })
  response?: string
}
