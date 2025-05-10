import { ApiProperty } from "@nestjs/swagger"

export class UploadProfileImageDto {
  @ApiProperty({
    description: "Profile image file",
    type: "string",
    format: "binary",
  })
  file: any
}
