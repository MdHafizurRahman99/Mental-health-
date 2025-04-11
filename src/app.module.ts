import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AuthModule } from "./auth/auth.module"
import { UserModule } from "./backend/user/user.module"
import { AssessmentsModule } from "./backend/assessment/assessments.module"
import { ContentModule } from "./backend/content/content.module"
import { ChatsModule } from "./backend/chats/chats.module"
import { FeedbackModule } from "./backend/feedback/feedback.module"
import { GamificationModule } from "./backend/gamification/gamification.module"
import { CheckInsModule } from "./backend/check-ins/check-ins.module"
import { AiLogsModule } from "./backend/ai-logs/ai-logs.module"
import { TeletherapyModule } from "./backend/teletherapy/teletherapy.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI") || "mongodb://localhost:27017/mental-health",
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    AssessmentsModule,
    ContentModule,
    ChatsModule,
    FeedbackModule,
    GamificationModule,
    CheckInsModule,
    AiLogsModule,
    TeletherapyModule,
  ],
})
export class AppModule {}

