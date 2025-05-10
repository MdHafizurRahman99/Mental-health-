import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from "class-validator"
import { BloodType, Gender, RelationshipStatus } from "../schemas/user-profile.schema"

export class SubstanceUseDto {
  @ApiProperty({
    description: "Alcohol consumption",
    example: "Occasional",
    required: false,
  })
  @IsOptional()
  @IsString()
  alcohol?: string

  @ApiProperty({
    description: "Caffeine consumption",
    example: "Daily",
    required: false,
  })
  @IsOptional()
  @IsString()
  caffeine?: string

  @ApiProperty({
    description: "Tobacco use",
    example: "None",
    required: false,
  })
  @IsOptional()
  @IsString()
  tobacco?: string
}

export class CreateUserProfileDto {
  @ApiProperty({
    description: "User ID",
    example: "60d21b4667d0d8992e610c85",
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: string

  // General Information
  @ApiProperty({
    description: "Date of birth",
    example: "1990-01-01",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string

  @ApiProperty({
    description: "Gender identity",
    enum: Gender,
    example: Gender.MALE,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender

  @ApiProperty({
    description: "Relationship status",
    enum: RelationshipStatus,
    example: RelationshipStatus.SINGLE,
    required: false,
  })
  @IsOptional()
  @IsEnum(RelationshipStatus)
  relationshipStatus?: RelationshipStatus

  @ApiProperty({
    description: "Nationality or ethnicity",
    example: "American",
    required: false,
  })
  @IsOptional()
  @IsString()
  nationality?: string

  @ApiProperty({
    description: "Primary language",
    example: "English",
    required: false,
  })
  @IsOptional()
  @IsString()
  primaryLanguage?: string

  @ApiProperty({
    description: "Phone number",
    example: "+1234567890",
    required: false,
  })
  @IsOptional()
//   @IsPhoneNumber()
    @IsString()
  phoneNumber?: string

  @ApiProperty({
    description: "Address",
    example: "123 Main St, City, Country",
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string

  @ApiProperty({
    description: "Emergency contact name",
    example: "Jane Doe",
    required: false,
  })
  @IsOptional()
  @IsString()
  emergencyContactName?: string

  @ApiProperty({
    description: "Emergency contact number",
    example: "+1234567890",
    required: false,
  })
  @IsOptional()
  @IsString()
//   @IsPhoneNumber()
  emergencyContactNumber?: string

  @ApiProperty({
    description: "Height in centimeters",
    example: 175,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  height?: number

  @ApiProperty({
    description: "Weight in kilograms",
    example: 70,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  weight?: number

  @ApiProperty({
    description: "Blood type",
    enum: BloodType,
    example: BloodType.O_POSITIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(BloodType)
  bloodType?: BloodType

  @ApiProperty({
    description: "Allergies and chronic conditions",
    example: ["Peanut allergy", "Asthma"],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  allergiesAndConditions?: string[]

  @ApiProperty({
    description: "Current medications",
    example: ["Aspirin", "Insulin"],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  currentMedications?: string[]

  @ApiProperty({
    description: "Substance use (alcohol, caffeine, tobacco)",
    example: {
      alcohol: "Occasional",
      caffeine: "Daily",
      tobacco: "None",
    },
    required: false,
    type: SubstanceUseDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SubstanceUseDto)
  substanceUse?: SubstanceUseDto

  @ApiProperty({
    description: "Profession",
    example: "Software Engineer",
    required: false,
  })
  @IsOptional()
  @IsString()
  profession?: string

  // Employment Information (for job holders only)
  @ApiProperty({
    description: "Company name",
    example: "Acme Corporation",
    required: false,
  })
  @IsOptional()
  @IsString()
  companyName?: string

  @ApiProperty({
    description: "Employee ID",
    example: "EMP12345",
    required: false,
  })
  @IsOptional()
  @IsString()
  employeeId?: string

  @ApiProperty({
    description: "Department",
    example: "Engineering",
    required: false,
  })
  @IsOptional()
  @IsString()
  department?: string

  @ApiProperty({
    description: "Role in the company",
    example: "Senior Developer",
    required: false,
  })
  @IsOptional()
  @IsString()
  companyRole?: string

  @ApiProperty({
    description: "Manager or supervisor contact",
    example: "manager@example.com",
    required: false,
  })
  @IsOptional()
  @IsEmail()
  managerContact?: string
}
