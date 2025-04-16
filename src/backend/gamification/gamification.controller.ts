import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common"
import { GamificationService } from "./gamification.service"
import { CreateGamificationDto } from "./dto/create-gamification.dto"
import { UpdateGamificationDto } from "./dto/update-gamification.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { Gamification } from "./schemas/gamification.entity"

@ApiTags("gamification")
@Controller("gamification")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @ApiOperation({ summary: 'Create a new gamification profile' })
  @ApiBody({ type: CreateGamificationDto })
  @ApiResponse({ 
    status: 201, 
    description: 'The gamification profile has been successfully created.',
    type: Gamification
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Gamification profile already exists for this user.' })
  @Post()
  create(@Body() createGamificationDto: CreateGamificationDto) {
    return this.gamificationService.create(createGamificationDto);
  }

  @ApiOperation({ summary: "Get all gamification profiles" })
  @ApiResponse({
    status: 200,
    description: "Return all gamification profiles",
    type: [Gamification],
  })
  @Get()
  findAll() {
    return this.gamificationService.findAll()
  }

  @ApiOperation({ summary: 'Get a gamification profile by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the gamification profile for the specified user',
    type: Gamification
  })
  @ApiResponse({ status: 404, description: 'Gamification profile not found.' })
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.gamificationService.findByUserId(userId);
  }

  @ApiOperation({ summary: 'Get a gamification profile by id' })
  @ApiParam({ name: 'id', description: 'Gamification profile ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the gamification profile with the specified id',
    type: Gamification
  })
  @ApiResponse({ status: 404, description: 'Gamification profile not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamificationService.findOne(id);
  }

  @ApiOperation({ summary: "Update a gamification profile" })
  @ApiParam({ name: "id", description: "Gamification profile ID" })
  @ApiBody({ type: UpdateGamificationDto })
  @ApiResponse({
    status: 200,
    description: "The gamification profile has been successfully updated.",
    type: Gamification,
  })
  @ApiResponse({ status: 404, description: "Gamification profile not found." })
  @Patch(":id")
  update(@Param('id') id: string, @Body() updateGamificationDto: UpdateGamificationDto) {
    return this.gamificationService.update(id, updateGamificationDto)
  }

  @ApiOperation({ summary: 'Delete a gamification profile' })
  @ApiParam({ name: 'id', description: 'Gamification profile ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The gamification profile has been successfully deleted.',
    type: Gamification
  })
  @ApiResponse({ status: 404, description: 'Gamification profile not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamificationService.remove(id);
  }
}
