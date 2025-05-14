import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, Req } from "@nestjs/common"
import { ReactionsService } from "./reactions.service"
import { CreateReactionDto } from "./dto/create-reaction.dto"
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger"
import { Reaction, TargetType } from "./schemas/reaction.schema"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"

@ApiTags("reactions")
@Controller("reactions")
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new reaction" })
  @ApiResponse({
    status: 201,
    description: "The reaction has been successfully created",
    type: Reaction,
  })
  @ApiResponse({ status: 409, description: "Conflict: You have already reacted to this item" })
  create(@Body() createReactionDto: CreateReactionDto, @Req() req: any) {
    // Override userId with the authenticated user's ID
    createReactionDto.userId = req.user.userId
    return this.reactionsService.create(createReactionDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all reactions with optional filtering" })
  @ApiQuery({ name: "userId", required: false, description: "Filter by user ID" })
  @ApiQuery({ name: "targetType", required: false, enum: TargetType, description: "Filter by target type" })
  @ApiQuery({ name: "targetId", required: false, description: "Filter by target ID" })
  @ApiResponse({
    status: 200,
    description: "Returns a list of reactions",
    type: [Reaction],
  })
  findAll(
    @Query("userId") userId?: string,
    @Query("targetType") targetType?: TargetType,
    @Query("targetId") targetId?: string,
  ) {
    return this.reactionsService.findAll(userId, targetType, targetId)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a reaction by ID" })
  @ApiParam({ name: "id", description: "Reaction ID" })
  @ApiResponse({
    status: 200,
    description: "Returns the reaction with the specified ID",
    type: Reaction,
  })
  @ApiResponse({ status: 404, description: "Reaction not found" })
  findOne(@Param("id") id: string) {
    return this.reactionsService.findOne(id)
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a reaction" })
  @ApiParam({ name: "id", description: "Reaction ID" })
  @ApiResponse({
    status: 200,
    description: "The reaction has been successfully deleted",
    type: Reaction,
  })
  @ApiResponse({ status: 404, description: "Reaction not found" })
  remove(@Param("id") id: string, @Req() req) {
    return this.reactionsService.remove(id, req.user.userId)
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a reaction by target" })
  @ApiQuery({ name: "targetType", required: true, enum: TargetType, description: "Target type" })
  @ApiQuery({ name: "targetId", required: true, description: "Target ID" })
  @ApiResponse({
    status: 200,
    description: "The reaction has been successfully deleted",
  })
  removeByTarget(@Query("targetType") targetType: TargetType, @Query("targetId") targetId: string, @Req() req) {
    return this.reactionsService.removeByTarget(req.user.userId, targetType, targetId)
  }
}
