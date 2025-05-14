import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import { Notification, type NotificationDocument } from "./schemas/notification.schema"
import type { CreateNotificationDto } from "./dto/create-notification.dto"
import type { UpdateNotificationDto } from "./dto/update-notification.dto"

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const createdNotification = new this.notificationModel(createNotificationDto)
    return createdNotification.save()
  }

  async findAll(
    userId: string,
    isRead?: boolean,
    limit = 10,
    page = 1,
  ): Promise<{
    notifications: Notification[]
    total: number
    page: number
    limit: number
    unreadCount?: number
  }> {
    const query: any = { userId }

    if (isRead !== undefined) {
      query.isRead = isRead
    }

    const skip = (page - 1) * limit
    const [notifications, total] = await Promise.all([
      this.notificationModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.notificationModel.countDocuments(query).exec(),
    ])

    const result: any = {
      notifications,
      total,
      page,
      limit,
    }

    // If we're not already filtering by isRead, include the unread count
    if (isRead === undefined) {
      result.unreadCount = await this.notificationModel.countDocuments({ userId, isRead: false }).exec()
    }

    return result
  }

  async findOne(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(id).exec()

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`)
    }

    // Check if the notification belongs to the user
    if (notification.userId.toString() !== userId) {
      throw new ForbiddenException("You do not have permission to access this notification")
    }

    return notification
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto, userId: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(id).exec()

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`)
    }

    // Check if the notification belongs to the user
    if (notification.userId.toString() !== userId) {
      throw new ForbiddenException("You do not have permission to update this notification")
    }

    return this.notificationModel.findByIdAndUpdate(id, updateNotificationDto, { new: true }).exec()
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany({ userId, isRead: false }, { isRead: true }).exec()
  }

  async remove(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(id).exec()

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`)
    }

    // Check if the notification belongs to the user
    if (notification.userId.toString() !== userId) {
      throw new ForbiddenException("You do not have permission to delete this notification")
    }

    return this.notificationModel.findByIdAndDelete(id).exec()
  }

  async removeAll(userId: string): Promise<void> {
    await this.notificationModel.deleteMany({ userId }).exec()
  }
}
