import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { GamificationService } from "./gamification.service"
import { GamificationController } from "./gamification.controller"
import { Gamification, GamificationSchema } from "./schemas/gamification.entity"
@Module({
  imports: [MongooseModule.forFeature([{ name: Gamification.name, schema: GamificationSchema }])],
  controllers: [GamificationController],
  providers: [GamificationService],
  exports: [GamificationService],
})
export class GamificationModule {}
