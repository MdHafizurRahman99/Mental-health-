import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common"
import { FeedbackService } from "./feedback.service"
import { CreateFeedbackDto } from "./dto/create-feedback.dto"
import { UpdateFeedbackDto } from "./dto/update-feedback.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { Feedback } from "./schemas/feedback.entity"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { UserRole } from "../user/schemas/user.schema"
import { Roles } from "src/auth/decorators/roles.decorator"

@ApiTags("feedback")
@Controller("feedback")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @ApiOperation({ summary: 'Create a new feedback' })
  @ApiBody({ type: CreateFeedbackDto })
  @ApiResponse({ 
    status: 201, 
    description: 'The feedback has been successfully created.',
    type: Feedback
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @ApiOperation({ summary: 'Get all feedback with optional filtering by user' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all feedback matching the criteria',
    type: [Feedback]
  })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role.' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll(@Query('userId') userId: string) {
    return this.feedbackService.findAll(userId);
  }

  @ApiOperation({ summary: 'Get a feedback by id' })
  @ApiParam({ name: 'id', description: 'Feedback ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the feedback with the specified id',
    type: Feedback
  })
  @ApiResponse({ status: 404, description: 'Feedback not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(id);
  }

  @ApiOperation({ summary: "Update a feedback" })
  @ApiParam({ name: "id", description: "Feedback ID" })
  @ApiBody({ type: UpdateFeedbackDto })
  @ApiResponse({
    status: 200,
    description: "The feedback has been successfully updated.",
    type: Feedback,
  })
  @ApiResponse({ status: 404, description: "Feedback not found." })
  @Patch(":id")
  update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackService.update(id, updateFeedbackDto)
  }

  @ApiOperation({ summary: 'Delete a feedback' })
  @ApiParam({ name: 'id', description: 'Feedback ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The feedback has been successfully deleted.',
    type: Feedback
  })
  @ApiResponse({ status: 404, description: 'Feedback not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}
