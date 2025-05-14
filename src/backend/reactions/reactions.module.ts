import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ReactionsService } from "./reactions.service"
import { ReactionsController } from "./reactions.controller"
import { Reaction, ReactionSchema } from "./schemas/reaction.schema"
import { PostsModule } from "../posts/posts.module"
import { CommentsModule } from "../comments/comments.module"

@Module({
  imports: [MongooseModule.forFeature([{ name: Reaction.name, schema: ReactionSchema }]), PostsModule, CommentsModule],
  controllers: [ReactionsController],
  providers: [ReactionsService],
  exports: [ReactionsService],
})
export class ReactionsModule {}
