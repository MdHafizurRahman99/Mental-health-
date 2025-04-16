import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common"
import { ContentService } from "./content.service"
import { CreateContentDto } from "./dto/create-content.dto"
import { UpdateContentDto } from "./dto/update-content.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from "@nestjs/swagger"
import { Content, ContentType } from "./schemas/content.entity"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { Roles } from "src/auth/decorators/roles.decorator"
import { UserRole } from "../user/schemas/user.schema"

@ApiTags("content")
@Controller("content")
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiOperation({ summary: 'Create a new content item' })
  @ApiBody({ type: CreateContentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'The content item has been successfully created.',
    type: Content
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @ApiOperation({ summary: 'Get all content items with optional filtering by type' })
  @ApiQuery({ name: 'type', required: false, enum: ContentType, description: 'Filter by content type' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all content items matching the criteria',
    type: [Content]
  })
  @Get()
  findAll(@Query('type') type: ContentType) {
    return this.contentService.findAll(type);
  }

  @ApiOperation({ summary: 'Get a content item by id' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the content item with the specified id',
    type: Content
  })
  @ApiResponse({ status: 404, description: 'Content not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @ApiOperation({ summary: "Update a content item" })
  @ApiParam({ name: "id", description: "Content ID" })
  @ApiBody({ type: UpdateContentDto })
  @ApiResponse({
    status: 200,
    description: "The content item has been successfully updated.",
    type: Content,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden - requires admin role." })
  @ApiResponse({ status: 404, description: "Content not found." })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(":id")
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.update(id, updateContentDto)
  }

  @ApiOperation({ summary: 'Delete a content item' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The content item has been successfully deleted.',
    type: Content
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role.' })
  @ApiResponse({ status: 404, description: 'Content not found.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }
}
