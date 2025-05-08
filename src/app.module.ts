import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./backend/user/user.module";
import { AssessmentsModule } from "./backend/assessment/assessments.module";
import { ContentModule } from "./backend/content/content.module";
import { ChatsModule } from "./backend/chats/chats.module";
import { FeedbackModule } from "./backend/feedback/feedback.module";
import { GamificationModule } from "./backend/gamification/gamification.module";
import { CheckInsModule } from "./backend/check-ins/check-ins.module";
import { AiLogsModule } from "./backend/ai-logs/ai-logs.module";
import { TeletherapyModule } from "./backend/teletherapy/teletherapy.module";
import { UploadsModule } from "./backend/uploads/uploads.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>("MONGODB_URI");
        // console.log("MongoDB URI:", uri);
        return { uri };
      },
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
    UploadsModule, // Uncomment if you have an uploads module
  ],
})
export class AppModule {}