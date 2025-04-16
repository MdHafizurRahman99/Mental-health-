import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common"
import { TeletherapyService } from "./teletherapy.service"
import { CreateTeletherapySessionDto } from "./dto/create-teletherapy-session.dto"
import { UpdateTeletherapySessionDto } from "./dto/update-teletherapy-session.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { SessionStatus, TeletherapySession } from "./schemas/teletherapy-session.entity"

@ApiTags("teletherapy")
@Controller("teletherapy")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
export class TeletherapyController {
  constructor(private readonly teletherapyService: TeletherapyService) {}

  @ApiOperation({ summary: 'Create a new teletherapy session' })
  @ApiBody({ type: CreateTeletherapySessionDto })
  @ApiResponse({ 
    status: 201, 
    description: 'The teletherapy session has been successfully created.',
    type: TeletherapySession
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post()
  create(@Body() createTeletherapySessionDto: CreateTeletherapySessionDto) {
    return this.teletherapyService.create(createTeletherapySessionDto);
  }

  @ApiOperation({ summary: "Get all teletherapy sessions with optional filtering" })
  @ApiQuery({ name: "userId", required: false, description: "Filter by user ID" })
  @ApiQuery({ name: "therapistId", required: false, description: "Filter by therapist ID" })
  @ApiQuery({ name: "status", required: false, enum: SessionStatus, description: "Filter by session status" })
  @ApiResponse({
    status: 200,
    description: "Return all teletherapy sessions matching the criteria",
    type: [TeletherapySession],
  })
  @Get()
  findAll(
    @Query('userId') userId: string,
    @Query('therapistId') therapistId: string,
    @Query('status') status: SessionStatus,
  ) {
    return this.teletherapyService.findAll(userId, therapistId, status)
  }

  @ApiOperation({ summary: 'Get a teletherapy session by id' })
  @ApiParam({ name: 'id', description: 'Teletherapy session ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the teletherapy session with the specified id',
    type: TeletherapySession
  })
  @ApiResponse({ status: 404, description: 'Teletherapy session not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teletherapyService.findOne(id);
  }

  @ApiOperation({ summary: "Update a teletherapy session" })
  @ApiParam({ name: "id", description: "Teletherapy session ID" })
  @ApiBody({ type: UpdateTeletherapySessionDto })
  @ApiResponse({
    status: 200,
    description: "The teletherapy session has been successfully updated.",
    type: TeletherapySession,
  })
  @ApiResponse({ status: 404, description: "Teletherapy session not found." })
  @Patch(":id")
  update(@Param('id') id: string, @Body() updateTeletherapySessionDto: UpdateTeletherapySessionDto) {
    return this.teletherapyService.update(id, updateTeletherapySessionDto)
  }

  @ApiOperation({ summary: 'Delete a teletherapy session' })
  @ApiParam({ name: 'id', description: 'Teletherapy session ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The teletherapy session has been successfully deleted.',
    type: TeletherapySession
  })
  @ApiResponse({ status: 404, description: 'Teletherapy session not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teletherapyService.remove(id);
  }
}
