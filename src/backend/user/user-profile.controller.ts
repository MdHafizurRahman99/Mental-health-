import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Req,
    UploadedFile,
    UseInterceptors,
    Delete,
    Put,
    ForbiddenException,
  } from "@nestjs/common"
  import { FileInterceptor } from "@nestjs/platform-express"
  import { diskStorage } from "multer"
  import { extname } from "path"
  import { CreateUserProfileDto } from "./dto/create-user-profile.dto"
  import { UpdateUserProfileDto } from "./dto/update-user-profile.dto"
  import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
  import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger"
  import { UserProfile } from "./schemas/user-profile.schema"
  import { UploadProfileImageDto } from "./dto/upload-profile-image.dto"
  import { Express } from "express"
import { UserProfileService } from "./user-profile.service"
import { log } from "console"
  
  @ApiTags("user-profiles")
  @Controller("user-profiles")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  export class UserProfileController {
    constructor(private readonly userService: UserProfileService) {}
  
    @Post()
    @ApiOperation({
      summary: 'Create or update user profile',
      description: 'Creates a new user profile or updates an existing one',
    })
    @ApiBody({ type: CreateUserProfileDto })
    @ApiResponse({
      status: 201,
      description: 'Profile created or updated successfully',
      type: UserProfile,
    })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
    @ApiResponse({ status: 403, description: 'Forbidden - Unauthorized to modify this profile' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async createOrUpdateProfile(@Body() createUserProfileDto: CreateUserProfileDto, @Req() req) {
    //   if (createUserProfileDto.userId !== req.user.userId) {
    //     throw new ForbiddenException('You can only modify your own profile');
    //   }
      return this.userService.createOrUpdateProfile(createUserProfileDto.userId, createUserProfileDto);
    }
  
    // @Get("me")
    // @ApiOperation({
    //   summary: "Get current user's profile",
    //   description: "Returns the profile of the currently authenticated user",
    // })
    // @ApiResponse({
    //   status: 200,
    //   description: "Profile retrieved successfully",
    //   type: UserProfile,
    // })
    // @ApiResponse({ status: 404, description: "Profile not found" })
    // async getMyProfile(@Req() req) {
    //   return this.userService.getProfileByUserId(req.user.userId)
    // }
  
    @Get(":userId")
    @ApiOperation({
      summary: "Get user profile by user ID",
      description: "Returns the profile of a specific user",
    })
    @ApiParam({ name: "userId", description: "User ID" })
    @ApiResponse({
      status: 200,
      description: "Profile retrieved successfully",
      type: UserProfile,
    })
    @ApiResponse({ status: 404, description: "Profile not found" })
    async getProfileByUserId(@Param("userId") userId: string) {
      return this.userService.getProfileByUserId(userId)
    }
  
    @Put()
    @ApiOperation({
      summary: "Update user profile",
      description: "Updates an existing user profile",
    })
    @ApiBody({ type: UpdateUserProfileDto })
    @ApiResponse({
      status: 200,
      description: "Profile updated successfully",
      type: UserProfile,
    })
    @ApiResponse({ status: 400, description: "Bad request - Invalid input data" })
    @ApiResponse({ status: 404, description: "User or profile not found" })
    async updateProfile(@Body() updateUserProfileDto: UpdateUserProfileDto, @Req() req) {
      return this.userService.createOrUpdateProfile(req.user.userId, updateUserProfileDto)
    }
  
    @Post("upload-image")
    @UseInterceptors(
      FileInterceptor("file", {
        storage: diskStorage({
          destination: "./uploads/profile-images",
          filename: (req, file, cb) => {
            // Generate a unique filename
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
            const ext = extname(file.originalname)
            cb(null, `profile-${uniqueSuffix}${ext}`)
          },
        }),
        fileFilter: (req, file, cb) => {
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error("Only image files are allowed!"), false)
          }
          cb(null, true)
        },
        limits: {
          fileSize: 5 * 1024 * 1024, 
        },
      }),
    )
    @ApiOperation({
      summary: "Upload profile image",
      description: "Uploads a profile image for the current user",
    })
    @ApiConsumes("multipart/form-data")
    @ApiBody({
      description: "Profile image file",
      type: UploadProfileImageDto,
    })
    @ApiResponse({
      status: 200,
      description: "Image uploaded successfully",
      type: UserProfile,
    })
    @ApiResponse({ status: 400, description: "Bad request - Invalid file" })
    @ApiResponse({ status: 404, description: "User not found" })
    async uploadProfileImage(@UploadedFile() file: Express.Multer.File, @Req() req) {
            log("req.user", req.user)
      return this.userService.updateProfileImage(req.user.userId, file)
    }
  
    @Delete("image")
    @ApiOperation({
      summary: "Delete profile image",
      description: "Deletes the profile image of the current user",
    })
    @ApiResponse({
      status: 200,
      description: "Image deleted successfully",
      type: UserProfile,
    })
    @ApiResponse({ status: 404, description: "Profile or image not found" })
    async deleteProfileImage(@Req() req) {
      return this.userService.deleteProfileImage(req.user.userId)
    }
  }
  