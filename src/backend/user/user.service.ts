import { Injectable, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User, UserDocument } from "./schemas/user.schema"
import { CreateUserDto } from "./dto/create-user.dto"
import { MailService } from "../mail/mail.service"
import { randomBytes } from "crypto"

/**
 * Service responsible for user management operations
 */
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: MailService,
  ) {}

  /**
   * Creates a new user in the system and sends verification email
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

    // Generate verification token
    const verificationToken = randomBytes(32).toString("hex")

    // Create new user with verification token
    const createdUser = new this.userModel({
      ...createUserDto,
      verificationToken,
      isVerified: false,
    })

    const savedUser = await createdUser.save()

    // Send verification email
    await this.mailService.sendVerificationEmail(savedUser.email, savedUser.name, verificationToken)

    // Return user without password
    const { password, ...result } = savedUser.toObject()
    return result
  }

  /**
   * Verifies a user's email using the verification token
   * @param token - The verification token
   * @returns The updated user object without the password
   * @throws NotFoundException if no user is found with the given token
   */
  async verifyEmail(token: string): Promise<Partial<User>> {
    const user = await this.userModel.findOne({ verificationToken: token })

    if (!user) {
      throw new NotFoundException("Invalid verification token")
    }

    if (user.isVerified) {
      throw new BadRequestException("Email already verified")
    }

    user.isVerified = true
    user.verificationToken = undefined

    const savedUser = await user.save()

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
