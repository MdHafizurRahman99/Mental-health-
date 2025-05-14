import { Injectable, NotFoundException, ConflictException, ForbiddenException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Report, ReportDocument, ReportStatus } from "./schemas/report.schema"
import { CreateReportDto } from "./dto/create-report.dto"
import { UpdateReportDto } from "./dto/update-report.dto"
import { UserRole } from "../user/schemas/user.schema"

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>
  ) { }

  async create(createReportDto: CreateReportDto): Promise<Report> {
    // Check if the user has already reported this content
    const existingReport = await this.reportModel
      .findOne({
        reporterId: createReportDto.reporterId,
        targetType: createReportDto.targetType,
        targetId: createReportDto.targetId,
      })
      .exec()

    if (existingReport) {
      throw new ConflictException("You have already reported this content")
    }

    const createdReport = new this.reportModel(createReportDto)
    return createdReport.save()
  }

  async findAll(
    status?: ReportStatus,
    limit = 10,
    page = 1,
  ): Promise<{ reports: Report[]; total: number; page: number; limit: number }> {
    const query: any = {}

    if (status) {
      query.status = status
    }

    const skip = (page - 1) * limit
    const [reports, total] = await Promise.all([
      this.reportModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.reportModel.countDocuments(query).exec(),
    ])

    return {
      reports,
      total,
      page,
      limit,
    }
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportModel.findById(id).exec()
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`)
    }
    return report
  }

  async update(id: string, updateReportDto: UpdateReportDto, userRole: UserRole): Promise<Report> {
    // Only admins and moderators can update report status
    if (userRole !== UserRole.ADMIN && userRole !== UserRole.THERAPIST) {
      throw new ForbiddenException("Only admins and moderators can update report status")
    }

    const report = await this.reportModel.findById(id).exec()

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`)
    }


    const updatedReport = await this.reportModel
        .findByIdAndUpdate(id, updateReportDto, { new: true })
        .exec();
      if (!updatedReport) {
        throw new NotFoundException(`Report with ID ${id} not found`);
      } 
      return updatedReport;
  }

  async remove(id: string, userRole: UserRole): Promise<Report> {
    // Only admins can delete reports
    if (userRole !== UserRole.ADMIN) {
      throw new ForbiddenException("Only admins can delete reports")
    }

    const report = await this.reportModel.findById(id).exec()

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`)
    }

    const deletedReport = await this.reportModel.findByIdAndDelete(id).exec();
      if (!deletedReport) {
        throw new NotFoundException(`Report with ID ${id} not found`);
      }
      return deletedReport;
  }
}
