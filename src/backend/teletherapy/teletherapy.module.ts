import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { TeletherapyService } from "./teletherapy.service"
import { TeletherapyController } from "./teletherapy.controller"
import { TeletherapySession, TeletherapySessionSchema } from "./schemas/teletherapy-session.entity"
@Module({
  imports: [MongooseModule.forFeature([{ name: TeletherapySession.name, schema: TeletherapySessionSchema }])],
  controllers: [TeletherapyController],
  providers: [TeletherapyService],
  exports: [TeletherapyService],
})
export class TeletherapyModule {}
