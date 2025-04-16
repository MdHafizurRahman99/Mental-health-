import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common"
import { AiLogsService } from "./ai-logs.service"
import { CreateAiLogDto } from "./dto/create-ai-log.dto"
import { UpdateAiLogDto } from "./dto/update-ai-log.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from "@nestjs/swagger"
import { AiLog, InteractionType } from "./schemas/ai-log.entity"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { UserRole } from "../user/schemas/user.schema"
import { Roles } from "src/auth/decorators/roles.decorator"
@ApiTags("ai-logs")
@Controller("ai-logs")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
export class AiLogsController {
  constructor(private readonly aiLogsService: AiLogsService) {}

  @ApiOperation({ summary: 'Create a new AI interaction log' })
  @ApiBody({ type: CreateAiLogDto })
  @ApiResponse({ 
    status: 201, 
    description: 'The AI log has been successfully created.',
    type: AiLog
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post()
  create(@Body() createAiLogDto: CreateAiLogDto) {
    return this.aiLogsService.create(createAiLogDto);
  }

  @ApiOperation({ summary: "Get all AI logs with optional filtering" })
  @ApiQuery({ name: "userId", required: false, description: "Filter by user ID" })
  @ApiQuery({
    name: "interactionType",
    required: false,
    enum: InteractionType,
    description: "Filter by interaction type",
  })
  @ApiResponse({
    status: 200,
    description: "Return all AI logs matching the criteria",
    type: [AiLog],
  })
  @ApiResponse({ status: 403, description: "Forbidden - requires admin role." })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll(@Query('userId') userId: string, @Query('interactionType') interactionType: InteractionType) {
    return this.aiLogsService.findAll(userId, interactionType)
  }

  @ApiOperation({ summary: 'Get an AI log by id' })
  @ApiParam({ name: 'id', description: 'AI log ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the AI log with the specified id',
    type: AiLog
  })
  @ApiResponse({ status: 404, description: 'AI log not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiLogsService.findOne(id);
  }

  @ApiOperation({ summary: "Update an AI log" })
  @ApiParam({ name: "id", description: "AI log ID" })
  @ApiBody({ type: UpdateAiLogDto })
  @ApiResponse({
    status: 200,
    description: "The AI log has been successfully updated.",
    type: AiLog,
  })
  @ApiResponse({ status: 404, description: "AI log not found." })
  @Patch(":id")
  update(@Param('id') id: string, @Body() updateAiLogDto: UpdateAiLogDto) {
    return this.aiLogsService.update(id, updateAiLogDto)
  }

  @ApiOperation({ summary: 'Delete an AI log' })
  @ApiParam({ name: 'id', description: 'AI log ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The AI log has been successfully deleted.',
    type: AiLog
  })
  @ApiResponse({ status: 404, description: 'AI log not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiLogsService.remove(id);
  }
}
