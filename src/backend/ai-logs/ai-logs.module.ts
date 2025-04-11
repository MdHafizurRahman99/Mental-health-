import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AiLogsService } from "./ai-logs.service"
import { AiLogsController } from "./ai-logs.controller"
import { AiLog, AiLogSchema } from "./schemas/ai-log.entity"

@Module({
  imports: [MongooseModule.forFeature([{ name: AiLog.name, schema: AiLogSchema }])],
  controllers: [AiLogsController],
  providers: [AiLogsService],
  exports: [AiLogsService],
})
export class AiLogsModule {}
