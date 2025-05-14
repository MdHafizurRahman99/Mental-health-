import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, Req } from "@nestjs/common"
import { SharesService } from "./shares.service"
import { CreateShareDto } from "./dto/create-share.dto"
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger"
import { Share } from "./schemas/share.schema"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"

@ApiTags("shares")
@Controller("shares")
export class SharesController {
  constructor(private readonly sharesService: SharesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new share" })
  @ApiResponse({
    status: 201,
    description: "The share has been successfully created",
    type: Share,
  })
  @ApiResponse({ status: 409, description: "Conflict: You have already shared this post" })
  create(@Body() createShareDto: CreateShareDto, @Req() req) {
    // Override userId with the authenticated user's ID
    createShareDto.userId = req.user.userId
    return this.sharesService.create(createShareDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all shares with optional filtering" })
  @ApiQuery({ name: "userId", required: false, description: "Filter by user ID" })
  @ApiQuery({ name: "postId", required: false, description: "Filter by post ID" })
  @ApiResponse({
    status: 200,
    description: "Returns a list of shares",
    type: [Share],
  })
  findAll(@Query("userId") userId?: string, @Query("postId") postId?: string) {
    return this.sharesService.findAll(userId, postId)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a share by ID" })
  @ApiParam({ name: "id", description: "Share ID" })
  @ApiResponse({
    status: 200,
    description: "Returns the share with the specified ID",
    type: Share,
  })
  @ApiResponse({ status: 404, description: "Share not found" })
  findOne(@Param("id") id: string) {
    return this.sharesService.findOne(id)
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a share" })
  @ApiParam({ name: "id", description: "Share ID" })
  @ApiResponse({
    status: 200,
    description: "The share has been successfully deleted",
    type: Share,
  })
  @ApiResponse({ status: 404, description: "Share not found" })
  remove(@Param("id") id: string, @Req() req) {
    return this.sharesService.remove(id, req.user.userId)
  }
}
