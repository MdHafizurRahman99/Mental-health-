import { IsEnum, IsNotEmpty, IsString, IsUrl } from "class-validator"
import { ContentType } from "../schemas/content.entity"

export class CreateContentDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsEnum(ContentType)
  type: ContentType

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsUrl()
  url: string
}
