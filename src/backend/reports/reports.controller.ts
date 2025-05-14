import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from "@nestjs/common"
import { ReportsService } from "./reports.service"
import { CreateReportDto } from "./dto/create-report.dto"
import { UpdateReportDto } from "./dto/update-report.dto"
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger"
import { Report, ReportStatus } from "./schemas/report.schema"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { UserRole } from "../user/schemas/user.schema"
import { Roles } from "src/auth/decorators/roles.decorator"

@ApiTags("reports")
@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new report" })
  @ApiResponse({
    status: 201,
    description: "The report has been successfully created",
    type: Report,
  })
  @ApiResponse({ status: 409, description: "Conflict: You have already reported this content" })
  create(@Body() createReportDto: CreateReportDto, @Req() req: any) {
    // Override reporterId with the authenticated user's ID
    createReportDto.reporterId = req.user.userId
    return this.reportsService.create(createReportDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.THERAPIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all reports with optional filtering (admin/moderator only)" })
  @ApiQuery({ name: "status", required: false, enum: ReportStatus, description: "Filter by status" })
  @ApiQuery({ name: "limit", required: false, description: "Number of reports to return" })
  @ApiQuery({ name: "page", required: false, description: "Page number" })
  @ApiResponse({
    status: 200,
    description: "Returns a paginated list of reports",
    schema: {
      properties: {
        reports: {
          type: "array",
          items: { $ref: "#/components/schemas/Report" },
        },
        total: { type: "number" },
        page: { type: "number" },
        limit: { type: "number" },
      },
    },
  })
  findAll(@Query("status") status?: ReportStatus, @Query("limit") limit?: number, @Query("page") page?: number) {
    return this.reportsService.findAll(status, limit, page)
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.THERAPIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get a report by ID (admin/moderator only)" })
  @ApiParam({ name: "id", description: "Report ID" })
  @ApiResponse({
    status: 200,
    description: "Returns the report with the specified ID",
    type: Report,
  })
  @ApiResponse({ status: 404, description: "Report not found" })
  findOne(@Param("id") id: string) {
    return this.reportsService.findOne(id)
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.THERAPIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a report status (admin/moderator only)" })
  @ApiParam({ name: "id", description: "Report ID" })
  @ApiResponse({
    status: 200,
    description: "The report has been successfully updated",
    type: Report,
  })
  @ApiResponse({ status: 403, description: "Forbidden: Only admins and moderators can update report status" })
  @ApiResponse({ status: 404, description: "Report not found" })
  update(@Param("id") id: string, @Body() updateReportDto: UpdateReportDto, @Req() req) {
    return this.reportsService.update(id, updateReportDto, req.user.role)
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a report (admin only)" })
  @ApiParam({ name: "id", description: "Report ID" })
  @ApiResponse({
    status: 200,
    description: "The report has been successfully deleted",
    type: Report,
  })
  @ApiResponse({ status: 403, description: "Forbidden: Only admins can delete reports" })
  @ApiResponse({ status: 404, description: "Report not found" })
  remove(@Param("id") id: string, @Req() req) {
    return this.reportsService.remove(id, req.user.role)
  }
}
