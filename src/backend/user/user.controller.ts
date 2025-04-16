import { Controller, Get, Post, Body, UseGuards, Req } from "@nestjs/common"
import { UserService } from "./user.service"
import { CreateUserDto } from "./dto/create-user.dto"
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { User } from "./schemas/user.schema"

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new user',
    description: 'Creates a new user with the provided details and returns the user object without the password.'
  })
  @ApiCreatedResponse({ 
    description: 'User successfully created',
    type: User,
    schema: {
      properties: {
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john@example.com' },
        role: { type: 'string', enum: ['user', 'therapist', 'admin'], example: 'user' },
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 409, description: 'Conflict - Email already exists' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get user profile',
    description: 'Returns the profile of the currently authenticated user.'
  })
  @ApiOkResponse({ 
    description: 'User profile retrieved successfully',
    type: User,
    schema: {
      properties: {
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john@example.com' },
        role: { type: 'string', enum: ['user', 'therapist', 'admin'], example: 'user' },
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or expired token' })
  async getProfile(@Req() req) {
    return this.userService.findById(req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get all users",
    description: "Returns a list of all users in the system without their passwords.",
  })
  @ApiOkResponse({
    description: "Users retrieved successfully",
    type: [User],
    schema: {
      type: "array",
      items: {
        properties: {
          name: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john@example.com" },
          role: { type: "string", enum: ["user", "therapist", "admin"], example: "user" },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized - Invalid or expired token" })
  async findAll(): Promise<User[]> {
    return this.userService.findAll()
  }
}
