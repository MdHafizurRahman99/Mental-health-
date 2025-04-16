import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User, UserDocument } from "./schemas/user.schema"
import { CreateUserDto } from "./dto/create-user.dto"

/**
 * Service responsible for user management operations
 */
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Creates a new user in the system
   * @param createUserDto - Data transfer object containing user details
   * @returns The created user object without the password
   * @throws ConflictException if a user with the same email already exists
   */
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

  /**
   * Finds a user by their email address
   * @param email - The email address to search for
   * @returns The user document if found
   * @throws NotFoundException if no user is found with the given email
   */
  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return user
  }

  /**
   * Finds a user by their ID
   * @param id - The user ID to search for
   * @returns The user object without the password
   * @throws NotFoundException if no user is found with the given ID
   */
  async findById(id: string): Promise<Partial<User>> {
    const user = await this.userModel.findById(id)
    if (!user) {
      throw new NotFoundException("User not found")
    }

    // Return user without password
    const { password, ...result } = user.toObject()
    return result
  }

  /**
   * Retrieves all users from the database
   * @returns Array of user objects without passwords
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find().select("-password").exec()
  }
}
