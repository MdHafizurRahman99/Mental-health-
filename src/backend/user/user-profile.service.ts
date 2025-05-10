import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User, UserDocument } from "./schemas/user.schema"
import { UserProfile, UserProfileDocument } from "./schemas/user-profile.schema"
import { CreateUserDto } from "./dto/create-user.dto"
import { CreateUserProfileDto } from "./dto/create-user-profile.dto"
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto"
import * as fs from "fs"
import * as path from "path"
import { Express } from "express"

/**
 * Service responsible for user management operations
 */
@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(UserProfile.name)
    private userProfileModel: Model<UserProfileDocument>,
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

  /**
   * Creates or updates a user profile
   * @param createUserProfileDto - Data transfer object containing profile details
   * @returns The created or updated user profile
   */
  async createOrUpdateProfile(
    userId: string,
    createUserProfileDto: CreateUserProfileDto | UpdateUserProfileDto,
  ): Promise<UserProfile> {
    // Check if user exists
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    // Check if profile already exists
    const existingProfile = await this.userProfileModel.findOne({ userId });
  
    if (existingProfile) {
      // Update existing profile
      const updatedProfile = await this.userProfileModel
        .findOneAndUpdate({ userId }, { $set: createUserProfileDto }, { new: true })
        .exec();
      if (!updatedProfile) {
        throw new NotFoundException(`Failed to update profile for userId ${userId}`);
      }
      return updatedProfile;
    } else {
      // Create new profile
      const newProfile = new this.userProfileModel({
        ...createUserProfileDto,
        userId,
      });
      return newProfile.save();
    }
  }

  /**
   * Gets a user profile by user ID
   * @param userId - The user ID to search for
   * @returns The user profile if found
   * @throws NotFoundException if no profile is found for the given user ID
   */
  async getProfileByUserId(userId: string): Promise<UserProfile> {
    const profile = await this.userProfileModel.findOne({ userId }).exec()
    if (!profile) {
      throw new NotFoundException(`Profile for user with ID ${userId} not found`)
    }
    return profile
  }

  /**
   * Updates a user's profile image
   * @param userId - The user ID
   * @param file - The uploaded file
   * @returns The updated user profile
   */
  async updateProfileImage(userId: string, file: Express.Multer.File): Promise<UserProfile> {
    // Check if user exists
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    // Get the profile or create a new one if it doesn't exist
    let profile = await this.userProfileModel.findOne({ userId }).exec()
    if (!profile) {
      profile = new this.userProfileModel({ userId })
    }

    // If there's an existing profile image, delete it
    if (profile.profileImageUrl) {
      const oldImagePath = this.getProfileImagePath(profile.profileImageUrl)
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath)
      }
    }

    // Set the new profile image URL
    const imageUrl = `/uploads/profile-images/${file.filename}`
    profile.profileImageUrl = imageUrl

    // Save and return the updated profile
    return profile.save()
  }

  /**
   * Deletes a user's profile image
   * @param userId - The user ID
   * @returns The updated user profile
   */
  async deleteProfileImage(userId: string): Promise<UserProfile> {
    // Check if profile exists
    const profile = await this.userProfileModel.findOne({ userId }).exec()
    if (!profile) {
      throw new NotFoundException(`Profile for user with ID ${userId} not found`)
    }

    // If there's an existing profile image, delete it
    if (profile.profileImageUrl) {
      const imagePath = this.getProfileImagePath(profile.profileImageUrl)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
      profile.profileImageUrl = ''; 
      return profile.save()
    }

    return profile
  }

  /**
   * Gets the full path to a profile image
   * @param imageUrl - The image URL
   * @returns The full path to the image
   */
  private getProfileImagePath(imageUrl: string): string {
    // Remove the leading slash if present
    const relativePath = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl
    return path.join(process.cwd(), relativePath)
  }
}
