import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common"
import type { AssessmentsService } from "./assessments.service"
import type { CreateAssessmentDto } from "./dto/create-assessment.dto"
import type { UpdateAssessmentDto } from "./dto/update-assessment.dto"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AssessmentType } from "./schemas/assessment.entity";
// import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
// import type { AssessmentType } from "./entities/assessment.entity"

@Controller("assessments")
@UseGuards(JwtAuthGuard)
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post()
  create(@Body() createAssessmentDto: CreateAssessmentDto) {
    return this.assessmentsService.create(createAssessmentDto);
  }

  @Get()
  findAll(@Query('userId') userId: string, @Query('type') type: AssessmentType) {
    return this.assessmentsService.findAll(userId, type)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessmentsService.findOne(id);
  }

  @Patch(":id")
  update(@Param('id') id: string, @Body() updateAssessmentDto: UpdateAssessmentDto) {
    return this.assessmentsService.update(id, updateAssessmentDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assessmentsService.remove(id);
  }
}
