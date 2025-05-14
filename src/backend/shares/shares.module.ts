import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { SharesService } from "./shares.service"
import { SharesController } from "./shares.controller"
import { Share, ShareSchema } from "./schemas/share.schema"
import { PostsModule } from "../posts/posts.module"

@Module({
  imports: [MongooseModule.forFeature([{ name: Share.name, schema: ShareSchema }]), PostsModule],
  controllers: [SharesController],
  providers: [SharesService],
  exports: [SharesService],
})
export class SharesModule {}
