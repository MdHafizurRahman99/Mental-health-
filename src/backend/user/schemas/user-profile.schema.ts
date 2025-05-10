import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "./user.schema"

export type UserProfileDocument = UserProfile & Document

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  NON_BINARY = "non-binary",
  OTHER = "other",
  PREFER_NOT_TO_SAY = "prefer-not-to-say",
}

export enum RelationshipStatus {
  SINGLE = "single",
  MARRIED = "married",
  DIVORCED = "divorced",
  WIDOWED = "widowed",
  SEPARATED = "separated",
  IN_RELATIONSHIP = "in-relationship",
  OTHER = "other",
}

export enum BloodType {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-",
  UNKNOWN = "unknown",
}

@Schema({ timestamps: true })
export class UserProfile {
  @ApiProperty({
    description: "Reference to the user",
    type: String,
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true, unique: true })
  userId: User

  @ApiProperty({
    description: "URL to the user's profile image",
    example: "https://example.com/uploads/profile-123456.jpg",
    required: false,
  })
  @Prop()
  profileImageUrl: string

  @ApiProperty({
    description: "Date of birth",
    example: "1990-01-01",
    required: false,
  })
  @Prop()
  dateOfBirth: Date

  @ApiProperty({
    description: "Gender identity",
    enum: Gender,
    example: Gender.MALE,
    required: false,
  })
  @Prop({ type: String, enum: Gender })
  gender: Gender

  @ApiProperty({
    description: "Relationship status",
    enum: RelationshipStatus,
    example: RelationshipStatus.SINGLE,
    required: false,
  })
  @Prop({ type: String, enum: RelationshipStatus })
  relationshipStatus: RelationshipStatus

  @ApiProperty({
    description: "Nationality or ethnicity",
    example: "American",
    required: false,
  })
  @Prop()
  nationality: string

  @ApiProperty({
    description: "Primary language",
    example: "English",
    required: false,
  })
  @Prop()
  primaryLanguage: string

  @ApiProperty({
    description: "Phone number",
    example: "+1234567890",
    required: false,
  })
  @Prop()
  phoneNumber: string

  @ApiProperty({
    description: "Address",
    example: "123 Main St, City, Country",
    required: false,
  })
  @Prop()
  address: string

  @ApiProperty({
    description: "Emergency contact name",
    example: "Jane Doe",
    required: false,
  })
  @Prop()
  emergencyContactName: string

  @ApiProperty({
    description: "Emergency contact number",
    example: "+1234567890",
    required: false,
  })
  @Prop()
  emergencyContactNumber: string

  @ApiProperty({
    description: "Height in centimeters",
    example: 175,
    required: false,
  })
  @Prop()
  height: number

  @ApiProperty({
    description: "Weight in kilograms",
    example: 70,
    required: false,
  })
  @Prop()
  weight: number

  @ApiProperty({
    description: "BMI (Body Mass Index)",
    example: 22.9,
    required: false,
  })
  @Prop()
  bmi: number

  @ApiProperty({
    description: "Blood type",
    enum: BloodType,
    example: BloodType.O_POSITIVE,
    required: false,
  })
  @Prop({ type: String, enum: BloodType })
  bloodType: BloodType

  @ApiProperty({
    description: "Allergies and chronic conditions",
    example: ["Peanut allergy", "Asthma"],
    required: false,
  })
  @Prop([String])
  allergiesAndConditions: string[]

  @ApiProperty({
    description: "Current medications",
    example: ["Aspirin", "Insulin"],
    required: false,
  })
  @Prop([String])
  currentMedications: string[]

  @ApiProperty({
    description: "Substance use (alcohol, caffeine, tobacco)",
    example: {
      alcohol: "Occasional",
      caffeine: "Daily",
      tobacco: "None",
    },
    required: false,
  })
  @Prop({ type: Object })
  substanceUse: Record<string, string>

  @ApiProperty({
    description: "Profession",
    example: "Software Engineer",
    required: false,
  })
  @Prop()
  profession: string

  @ApiProperty({
    description: "Company name",
    example: "Acme Corporation",
    required: false,
  })
  @Prop()
  companyName: string

  @ApiProperty({
    description: "Employee ID",
    example: "EMP12345",
    required: false,
  })
  @Prop()
  employeeId: string

  @ApiProperty({
    description: "Department",
    example: "Engineering",
    required: false,
  })
  @Prop()
  department: string

  @ApiProperty({
    description: "Role in the company",
    example: "Senior Developer",
    required: false,
  })
  @Prop()
  companyRole: string

  @ApiProperty({
    description: "Manager or supervisor contact",
    example: "manager@example.com",
    required: false,
  })
  @Prop()
  managerContact: string

  @ApiProperty({
    description: "Timestamp when the profile was created",
    example: "2023-01-01T00:00:00.000Z",
    readOnly: true,
  })
  createdAt: Date

  @ApiProperty({
    description: "Timestamp when the profile was last updated",
    example: "2023-01-01T00:00:00.000Z",
    readOnly: true,
  })
  updatedAt: Date
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile)

UserProfileSchema.pre("save", function (next) {
  if (this.height && this.weight) {
    // BMI = weight(kg) / (height(m))²
    const heightInMeters = this.height / 100
    this.bmi = Number.parseFloat((this.weight / (heightInMeters * heightInMeters)).toFixed(1))
  }
  next()
})
