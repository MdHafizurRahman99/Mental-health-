import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common"
import { Model } from "mongoose"
import { User, UserDocument } from "./schemas/user.schema"
import { CreateUserDto } from "./dto/create-user.dto"
import { MailService } from "../mail/mail.service"
import { randomBytes } from "crypto"
import { UserProfile, UserProfileDocument } from "./schemas/user-profile.schema"
import { InjectModel } from "@nestjs/mongoose"

/**
 * Service responsible for user management operations
 */
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserProfile.name) private userProfileModel: Model<UserProfileDocument>,
    private mailService: MailService,
  ) {}

  /**
   * Creates a new user in the system and sends verification email
   * @param createUserDto - Data transfer object containing user details
   * @returns The created user object without the password
   * @throws ConflictException if a user with the same email already exists
   */
  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    try {
      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email: createUserDto.email })
      if (existingUser) {
        throw new ConflictException("Email already exists")
      }

      // Generate verification token
      const verificationToken = (Number.parseInt(randomBytes(4).toString("hex"), 16) % 90000000) + 10000000
      // Create new user with verification token
      const createdUser = new this.userModel({
        ...createUserDto,
        verificationToken,
        isVerified: false,
      })

      const savedUser = await createdUser.save()

      // Send verification email
      //ignore
      await this.mailService.sendVerificationEmail(savedUser.email, savedUser.name, verificationToken)

      // Return user without password
      const { password, ...result } = savedUser.toObject()
      return result
    } catch (error) {
      console.error("Error creating user:", error)
      if (error instanceof ConflictException) {
        throw error
      }
      throw new InternalServerErrorException("Failed to create user")
    }
  }

  /**
   * Resends the verification token to a user's email
   * @param email - The email address of the user
   * @returns The updated user object without the password
   * @throws NotFoundException if no user is found with the given email
   * @throws BadRequestException if the user's email is already verified
   */
  async resendVerificationToken(email: string): Promise<Partial<User>> {
    try {
      // Find the user by email
      const user = await this.userModel.findOne({ email })
      if (!user) {
        throw new NotFoundException("User not found")
      }

      // Check if the user is already verified
      if (user.isVerified) {
        throw new BadRequestException("Email already verified")
      }

      // Generate a new verification token
      const verificationToken = (Number.parseInt(randomBytes(4).toString("hex"), 16) % 90000000) + 10000000

      // Update the user with the new token
      // @ts-ignore
      user.verificationToken = verificationToken
      const savedUser = await user.save()

      // Send the verification email
      await this.mailService.sendVerificationEmail(savedUser.email, savedUser.name, verificationToken)

      // Return user without password
      const { password, ...result } = savedUser.toObject()
      return result
    } catch (error) {
      console.error("Error resending verification token:", error)
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error
      }
      throw new InternalServerErrorException("Failed to resend verification token")
    }
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
  async findById(id: string): Promise<Partial<User & { profile: UserProfile }>> {
    // Find the user by ID
    const user = await this.userModel.findById(id).exec()
    if (!user) {
      throw new NotFoundException("User not found")
    }

    // Find the associated user profile by userId
    const userProfile = await this.userProfileModel.findOne({ userId: id }).exec()

    // Convert user to plain object and exclude password
    const { password, ...userResult } = user.toObject()

    // Combine user data with profile data (if profile exists)
    return {
      ...userResult,
      profile: userProfile ? userProfile.toObject() : undefined,
    }
  }

  /**
   * Retrieves all users from the database
   * @returns Array of user objects without passwords
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find().select("-password").exec()
  }
}
