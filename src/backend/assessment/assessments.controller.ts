import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common"
import { AssessmentsService } from "./assessments.service"
import { CreateAssessmentDto } from "./dto/create-assessment.dto"
import { UpdateAssessmentDto } from "./dto/update-assessment.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { Assessment, AssessmentType } from "./schemas/assessment.entity"

@ApiTags("assessments")
@Controller("assessments")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @ApiOperation({ summary: 'Create a new assessment' })
  @ApiBody({ type: CreateAssessmentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'The assessment has been successfully created.',
    type: Assessment
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post()
  create(@Body() createAssessmentDto: CreateAssessmentDto) {
    return this.assessmentsService.create(createAssessmentDto);
  }

  @ApiOperation({ summary: "Get all assessments with optional filtering" })
  @ApiQuery({ name: "userId", required: false, description: "Filter by user ID" })
  @ApiQuery({ name: "type", required: false, enum: AssessmentType, description: "Filter by assessment type" })
  @ApiResponse({
    status: 200,
    description: "Return all assessments matching the criteria",
    type: [Assessment],
  })
  @Get()
  findAll(@Query('userId') userId: string, @Query('type') type: AssessmentType) {
    return this.assessmentsService.findAll(userId, type)
  }

  @ApiOperation({ summary: 'Get an assessment by id' })
  @ApiParam({ name: 'id', description: 'Assessment ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the assessment with the specified id',
    type: Assessment
  })
  @ApiResponse({ status: 404, description: 'Assessment not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessmentsService.findOne(id);
  }

  @ApiOperation({ summary: "Update an assessment" })
  @ApiParam({ name: "id", description: "Assessment ID" })
  @ApiBody({ type: UpdateAssessmentDto })
  @ApiResponse({
    status: 200,
    description: "The assessment has been successfully updated.",
    type: Assessment,
  })
  @ApiResponse({ status: 404, description: "Assessment not found." })
  @Patch(":id")
  update(@Param('id') id: string, @Body() updateAssessmentDto: UpdateAssessmentDto) {
    return this.assessmentsService.update(id, updateAssessmentDto)
  }

  @ApiOperation({ summary: 'Delete an assessment' })
  @ApiParam({ name: 'id', description: 'Assessment ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The assessment has been successfully deleted.',
    type: Assessment
  })
  @ApiResponse({ status: 404, description: 'Assessment not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assessmentsService.remove(id);
  }
}
