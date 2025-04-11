import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common"
import type { AiLogsService } from "./ai-logs.service"
import type { CreateAiLogDto } from "./dto/create-ai-log.dto"
import type { UpdateAiLogDto } from "./dto/update-ai-log.dto"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { UserRole } from "../user/schemas/user.schema"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { Roles } from "src/auth/decorators/roles.decorator"
import { InteractionType } from "./schemas/ai-log.entity"


@Controller("ai-logs")
@UseGuards(JwtAuthGuard)
export class AiLogsController {
  constructor(private readonly aiLogsService: AiLogsService) {}

  @Post()
  create(@Body() createAiLogDto: CreateAiLogDto) {
    return this.aiLogsService.create(createAiLogDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll(@Query('userId') userId: string, @Query('interactionType') interactionType: InteractionType) {
    return this.aiLogsService.findAll(userId, interactionType)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiLogsService.findOne(id);
  }

  @Patch(":id")
  update(@Param('id') id: string, @Body() updateAiLogDto: UpdateAiLogDto) {
    return this.aiLogsService.update(id, updateAiLogDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiLogsService.remove(id);
  }
}
