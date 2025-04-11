import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User, UserDocument } from "./schemas/user.schema"
import { CreateUserDto } from "./dto/create-user.dto"

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email: createUserDto.email })
    if (existingUser) {
      throw new ConflictException("Email already exists")
    }

    const createdUser = new this.userModel(createUserDto)
    const savedUser = await createdUser.save()

    // Return user without password
    const { password, ...result } = savedUser.toObject()
    return result
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return user
  }

  async findById(id: string): Promise<Partial<User>> {
    const user = await this.userModel.findById(id)
    if (!user) {
      throw new NotFoundException("User not found")
    }

    // Return user without password
    const { password, ...result } = user.toObject()
    return result
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select("-password").exec()
  }
}

