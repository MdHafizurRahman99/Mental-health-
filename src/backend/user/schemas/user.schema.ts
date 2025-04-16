import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"
import * as bcrypt from "bcrypt"
import { ApiProperty } from "@nestjs/swagger"

export enum UserRole {
  USER = "user",
  THERAPIST = "therapist",
  ADMIN = "admin",
}

export type UserDocument = User &
  Document & {
    comparePassword(candidatePassword: string): Promise<boolean>
  }

@Schema({ timestamps: true })
export class User {
  @ApiProperty({
    description: "Full name of the user",
    example: "John Doe",
    required: true,
  })
  @Prop({ required: true })
  name: string

  @ApiProperty({
    description: "Email address of the user (unique)",
    example: "john@example.com",
    required: true,
  })
  @Prop({ required: true, unique: true })
  email: string

  @ApiProperty({
    description: "Hashed password of the user",
    example: "$2b$10$X7...",
    required: true,
    writeOnly: true,
  })
  @Prop({ required: true })
  password: string

  @ApiProperty({
    description: "Role of the user in the system",
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER,
  })
  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}
