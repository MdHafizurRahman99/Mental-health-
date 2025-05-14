import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from "@nestjs/common"
import type { GroupsService } from "./groups.service"
import type { CreateGroupDto } from "./dto/create-group.dto"
import type { UpdateGroupDto } from "./dto/update-group.dto"
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger"
import { Group } from "./schemas/group.schema"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"

@ApiTags("groups")
@Controller("groups")
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new group" })
  @ApiResponse({
    status: 201,
    description: "The group has been successfully created",
    type: Group,
  })
  create(@Body() createGroupDto: CreateGroupDto, @Req() req) {
    // Override createdBy with the authenticated user's ID
    createGroupDto.createdBy = req.user.userId
    return this.groupsService.create(createGroupDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all groups with pagination" })
  @ApiQuery({ name: "limit", required: false, description: "Number of groups to return" })
  @ApiQuery({ name: "page", required: false, description: "Page number" })
  @ApiResponse({
    status: 200,
    description: "Returns a paginated list of groups",
    schema: {
      properties: {
        groups: {
          type: "array",
          items: { $ref: "#/components/schemas/Group" },
        },
        total: { type: "number" },
        page: { type: "number" },
        limit: { type: "number" },
      },
    },
  })
  findAll(@Query("limit") limit?: number, @Query("page") page?: number) {
    return this.groupsService.findAll(limit, page)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a group by ID" })
  @ApiParam({ name: "id", description: "Group ID" })
  @ApiResponse({
    status: 200,
    description: "Returns the group with the specified ID",
    type: Group,
  })
  @ApiResponse({ status: 404, description: "Group not found" })
  findOne(@Param("id") id: string) {
    return this.groupsService.findOne(id)
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a group by ID" })
  @ApiParam({ name: "id", description: "Group ID" })
  @ApiResponse({
    status: 200,
    description: "The group has been successfully updated",
    type: Group,
  })
  @ApiResponse({ status: 404, description: "Group not found" })
  update(@Param("id") id: string, @Body() updateGroupDto: UpdateGroupDto, @Req() req) {
    updateGroupDto.updatedBy = req.user.userId
    return this.groupsService.update(id, updateGroupDto, req.user.userId)
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a group by ID" })
  @ApiParam({ name: "id", description: "Group ID" })
  @ApiResponse({ status: 204, description: "Group successfully deleted" })
  @ApiResponse({ status: 404, description: "Group not found" })
  remove(@Param("id") id: string, @Req() req) {
    return this.groupsService.remove(id, req.user.userId)
  }
}
