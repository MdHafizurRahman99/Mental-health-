import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CreateUploadDto } from './dto/create-upload.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}
  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    type: CreateUploadDto,
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.handleFileUpload(file);
  }

  // @UseInterceptors(FileInterceptor('file'))
  // @Post('file/pass-validation')
  // @ApiOperation({ summary: 'Upload a file and pass validation' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'File upload with validation',
  //   type: CreateUploadDto,
  // })
  // uploadFileAndPassValidation(
  //   @Body() body: CreateUploadDto,
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType: 'jpg',
  //       })
  //       .build({
  //         fileIsRequired: false,
  //       }),
  //   )
  //   file?: Express.Multer.File,
  // ) {
  //   return {
  //     body,
  //     file: file?.buffer.toString(),
  //   };
  // }

  // @UseInterceptors(FileInterceptor('file'))
  // @Post('file/fail-validation')
  // @ApiOperation({ summary: 'Upload a file and fail validation' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'File upload with validation',
  //   type: CreateUploadDto,
  // })
  // uploadFileAndFailValidation(
  //   @Body() body: CreateUploadDto,
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType: 'jpg',
  //       })
  //       .build(),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return {
  //     body,
  //     file: file.buffer.toString(),
  //   };
  // }
}
