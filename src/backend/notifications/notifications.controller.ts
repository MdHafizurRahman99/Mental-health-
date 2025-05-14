import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Query, Req } from "@nestjs/common"
import { NotificationsService } from "./notifications.service"
import { UpdateNotificationDto } from "./dto/update-notification.dto"
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger"
import { Notification } from "./schemas/notification.schema"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"

@ApiTags("notifications")
@Controller("notifications")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "Get all notifications for the current user" })
  @ApiQuery({ name: "isRead", required: false, type: Boolean, description: "Filter by read status" })
  @ApiQuery({ name: "limit", required: false, description: "Number of notifications to return" })
  @ApiQuery({ name: "page", required: false, description: "Page number" })
  @ApiResponse({
    status: 200,
    description: "Returns a paginated list of notifications",
    schema: {
      properties: {
        notifications: {
          type: "array",
          items: { $ref: "#/components/schemas/Notification" },
        },
        total: { type: "number" },
        page: { type: "number" },
        limit: { type: "number" },
        unreadCount: { type: "number" },
      },
    },
  })
  findAll(@Req() req, @Query("isRead") isRead?: string, @Query("limit") limit?: number, @Query("page") page?: number) {
    const isReadBool = isRead ? isRead === "true" : undefined
    return this.notificationsService.findAll(req.user.userId, isReadBool, limit, page)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a notification by ID" })
  @ApiParam({ name: "id", description: "Notification ID" })
  @ApiResponse({
    status: 200,
    description: "Returns the notification with the specified ID",
    type: Notification,
  })
  @ApiResponse({ status: 403, description: "Forbidden: You do not have permission to access this notification" })
  @ApiResponse({ status: 404, description: "Notification not found" })
  findOne(@Param("id") id: string, @Req() req) {
    return this.notificationsService.findOne(id, req.user.userId)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a notification (mark as read/unread)" })
  @ApiParam({ name: "id", description: "Notification ID" })
  @ApiResponse({
    status: 200,
    description: "The notification has been successfully updated",
    type: Notification,
  })
  @ApiResponse({ status: 403, description: "Forbidden: You do not have permission to update this notification" })
  @ApiResponse({ status: 404, description: "Notification not found" })
  update(@Param("id") id: string, @Body() updateNotificationDto: UpdateNotificationDto, @Req() req) {
    return this.notificationsService.update(id, updateNotificationDto, req.user.userId)
  }

  @Patch()
  @ApiOperation({ summary: "Mark all notifications as read" })
  @ApiResponse({
    status: 200,
    description: "All notifications have been marked as read",
  })
  markAllAsRead(@Req() req) {
    return this.notificationsService.markAllAsRead(req.user.userId)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a notification" })
  @ApiParam({ name: "id", description: "Notification ID" })
  @ApiResponse({
    status: 200,
    description: "The notification has been successfully deleted",
    type: Notification,
  })
  @ApiResponse({ status: 403, description: "Forbidden: You do not have permission to delete this notification" })
  @ApiResponse({ status: 404, description: "Notification not found" })
  remove(@Param("id") id: string, @Req() req) {
    return this.notificationsService.remove(id, req.user.userId)
  }

  @Delete()
  @ApiOperation({ summary: "Delete all notifications for the current user" })
  @ApiResponse({
    status: 200,
    description: "All notifications have been successfully deleted",
  })
  removeAll(@Req() req) {
    return this.notificationsService.removeAll(req.user.userId)
  }
}
