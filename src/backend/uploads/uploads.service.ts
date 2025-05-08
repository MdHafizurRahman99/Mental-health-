import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  constructor(private configService: ConfigService) {}

  handleFileUpload(file: Express.Multer.File) {
    // Get base URL from config or use default
    const baseUrl = this.configService.get<string>('API_URL') || 
                   `http://localhost:${this.configService.get<number>('PORT') || 3000}`;
    
    // Construct the file URL
    const fileUrl = `${baseUrl}/uploads/${file.filename}`;
    
    // Return with filePath for backward compatibility
    return {
      success: true,
      message: 'File uploaded successfully',
      filePath: file.path, // Added for backward compatibility
      data: {
        originalname: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
        url: fileUrl
      }
    };
  }
}