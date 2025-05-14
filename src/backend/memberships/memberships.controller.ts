import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from "@nestjs/common"
import { MembershipsService } from "./memberships.service"
import { CreateMembershipDto } from "./dto/create-membership.dto"
import { UpdateMembershipDto } from "./dto/update-membership.dto"
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger"
import { Membership } from "./schemas/membership.schema"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"

@ApiTags("memberships")
@Controller("memberships")
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Join a group" })
  @ApiResponse({
    status: 201,
    description: "Successfully joined the group",
    type: Membership,
  })
  @ApiResponse({ status: 409, description: "User is already a member of this group" })
  create(@Body() createMembershipDto: CreateMembershipDto, @Req() req: any) {
    // Override userId with the authenticated user's ID
    createMembershipDto.userId = req.user.userId
    return this.membershipsService.create(createMembershipDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all memberships with optional filtering" })
  @ApiQuery({ name: "groupId", required: false, description: "Filter by group ID" })
  @ApiQuery({ name: "userId", required: false, description: "Filter by user ID" })
  @ApiResponse({
    status: 200,
    description: "Returns a list of memberships",
    type: [Membership],
  })
  findAll(@Query("groupId") groupId?: string, @Query("userId") userId?: string) {
    return this.membershipsService.findAll(groupId, userId)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a membership by ID" })
  @ApiParam({ name: "id", description: "Membership ID" })
  @ApiResponse({
    status: 200,
    description: "Returns the membership with the specified ID",
    type: Membership,
  })
  @ApiResponse({ status: 404, description: "Membership not found" })
  findOne(@Param("id") id: string) {
    return this.membershipsService.findOne(id)
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a membership role" })
  @ApiParam({ name: "id", description: "Membership ID" })
  @ApiResponse({
    status: 200,
    description: "The membership has been successfully updated",
    type: Membership,
  })
  @ApiResponse({ status: 403, description: "Forbidden: Only group admins can update membership roles" })
  @ApiResponse({ status: 404, description: "Membership not found" })
  update(@Param("id") id: string, @Body() updateMembershipDto: UpdateMembershipDto, @Req() req) {
    return this.membershipsService.update(id, updateMembershipDto, req.user.userId)
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Leave a group or remove a member" })
  @ApiParam({ name: "id", description: "Membership ID" })
  @ApiResponse({
    status: 200,
    description: "The membership has been successfully deleted",
    type: Membership,
  })
  @ApiResponse({ status: 403, description: "Forbidden: Only group admins can remove members" })
  @ApiResponse({ status: 404, description: "Membership not found" })
  remove(@Param("id") id: string, @Req() req) {
    return this.membershipsService.remove(id, req.user.userId)
  }
}
