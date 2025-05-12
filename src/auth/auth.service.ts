import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { LoginUserDto } from "src/backend/user/dto/login-user.dto"
import { UserService } from "src/backend/user/user.service"

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByEmail(email)
      const isPasswordValid = await user.comparePassword(password)

      if (isPasswordValid) {
        const { password, ...result } = user.toObject()
        return result
      }

      return null
    } catch (error) {
      return null
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto
    const user = await this.validateUser(email, password)

    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const payload = { id: user._id, email: user.email, role: user.role || 'user' }

    return {
      user,
      access_token: this.jwtService.sign(payload),
    }
  }
}