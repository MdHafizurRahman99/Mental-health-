import { Controller, Post, Body } from "@nestjs/common"
import { AuthService } from "./auth.service"
// import type { LoginUserDto } from "../user/dto/login-user.dto"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { LoginUserDto } from "src/backend/user/dto/login-user.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Return JWT token' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}

