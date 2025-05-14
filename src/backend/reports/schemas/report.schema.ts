import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "src/backend/user/schemas/user.schema"

export enum ReportTargetType {
  POST = "Post",
  COMMENT = "Comment",
}

export enum ReportStatus {
  PENDING = "pending",
  REVIEWED = "reviewed",
  RESOLVED = "resolved",
}

export type ReportDocument = Report & Document

@Schema({ timestamps: true })
export class Report {
  @ApiProperty({ description: "Unique identifier for the report" })
  _id: MongooseSchema.Types.ObjectId

  @ApiProperty({ description: "Reference to the user who reported the content" })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  reporterId: User

  @ApiProperty({
    description: "Type of content being reported",
    enum: ReportTargetType,
    example: ReportTargetType.POST,
  })
  @Prop({ type: String, enum: ReportTargetType, required: true })
  targetType: ReportTargetType

  @ApiProperty({ description: "ID of the content being reported" })
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  targetId: MongooseSchema.Types.ObjectId

  @ApiProperty({ description: "Reason for the report" })
  @Prop({ required: true })
  reason: string

  @ApiProperty({
    description: "Current status of the report",
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  @Prop({ type: String, enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus

  @ApiProperty({ description: "Timestamp when the report was created" })
  createdAt: Date
}

export const ReportSchema = SchemaFactory.createForClass(Report)

// Create an index for faster queries by status
ReportSchema.index({ status: 1 })

// Create a compound index to prevent duplicate reports from the same user
ReportSchema.index({ reporterId: 1, targetType: 1, targetId: 1 }, { unique: true })
