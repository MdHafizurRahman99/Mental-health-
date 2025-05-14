import { ApiProperty } from "@nestjs/swagger"
import { IsMongoId, IsNotEmpty } from "class-validator"
import { Types } from "mongoose"

export class CreateShareDto {
  @ApiProperty({
    description: "ID of the user sharing the post",
    example: "60d21b4667d0d8992e610c85",
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: Types.ObjectId

  @ApiProperty({
    description: "ID of the post being shared",
    example: "60d21b4667d0d8992e610c86",
  })
  @IsNotEmpty()
  @IsMongoId()
  postId: Types.ObjectId
}
