import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"
import { User, UserSchema } from "./schemas/user.schema"
import { AuthModule } from "src/auth/auth.module"
import { UserProfileController } from "./user-profile.controller"
import { UserProfileService } from "./user-profile.service"
import { UserProfile, UserProfileSchema } from "./schemas/user-profile.schema"

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{ name: UserProfile.name, schema: UserProfileSchema },])],
  controllers: [UserController,UserProfileController],
  providers: [UserService,UserProfileService],
  exports: [UserService],
})
export class UserModule {}

