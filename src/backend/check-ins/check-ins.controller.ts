import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common"
import { CheckInsService } from "./check-ins.service"
import { CreateCheckInDto } from "./dto/create-check-in.dto"
import { UpdateCheckInDto } from "./dto/update-check-in.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { CheckIn } from "./schemas/check-in.entity"

@ApiTags("check-ins")
@Controller("check-ins")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
export class CheckInsController {
  constructor(private readonly checkInsService: CheckInsService) {}

  @ApiOperation({ summary: 'Create a new check-in' })
  @ApiBody({ type: CreateCheckInDto })
  @ApiResponse({ 
    status: 201, 
    description: 'The check-in has been successfully created.',
    type: CheckIn
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post()
  create(@Body() createCheckInDto: CreateCheckInDto) {
    return this.checkInsService.create(createCheckInDto);
  }

  @ApiOperation({ summary: 'Get all check-ins with optional filtering by user' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all check-ins matching the criteria',
    type: [CheckIn]
  })
  @Get()
  findAll(@Query('userId') userId: string) {
    return this.checkInsService.findAll(userId);
  }

  @ApiOperation({ summary: 'Get a check-in by id' })
  @ApiParam({ name: 'id', description: 'Check-in ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the check-in with the specified id',
    type: CheckIn
  })
  @ApiResponse({ status: 404, description: 'Check-in not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkInsService.findOne(id);
  }

  @ApiOperation({ summary: "Update a check-in" })
  @ApiParam({ name: "id", description: "Check-in ID" })
  @ApiBody({ type: UpdateCheckInDto })
  @ApiResponse({
    status: 200,
    description: "The check-in has been successfully updated.",
    type: CheckIn,
  })
  @ApiResponse({ status: 404, description: "Check-in not found." })
  @Patch(":id")
  update(@Param('id') id: string, @Body() updateCheckInDto: UpdateCheckInDto) {
    return this.checkInsService.update(id, updateCheckInDto)
  }

  @ApiOperation({ summary: 'Delete a check-in' })
  @ApiParam({ name: 'id', description: 'Check-in ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The check-in has been successfully deleted.',
    type: CheckIn
  })
  @ApiResponse({ status: 404, description: 'Check-in not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkInsService.remove(id);
  }
}
