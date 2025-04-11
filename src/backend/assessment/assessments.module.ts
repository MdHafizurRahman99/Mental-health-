import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AssessmentsService } from "./assessments.service"
import { AssessmentsController } from "./assessments.controller"
import { Assessment, AssessmentSchema } from "./entities/assessment.entity"

@Module({
  imports: [MongooseModule.forFeature([{ name: Assessment.name, schema: AssessmentSchema }])],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  exports: [AssessmentsService],
})
export class AssessmentsModule {}
