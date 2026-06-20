// import {
//   Controller,
//   Post,
//   UploadedFile,
//   UseInterceptors,
// } from '@nestjs/common';

// import { FileInterceptor } from '@nestjs/platform-express';
// import { memoryStorage } from 'multer';

// import cloudinary from '../config/cloudinary';
// import { Readable } from 'stream';

// @Controller('upload')
// export class UploadController {

//   @Post('image')
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: memoryStorage(),
//       limits: {
//         fileSize: 5 * 1024 * 1024,
//       },
//     }),
//   )
//   async uploadFile(@UploadedFile() file: Express.Multer.File) {

//     if (!file) {
//       throw new Error('No file uploaded');
//     }

//     return new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           folder: 'courses',
//           resource_type: 'image',
//         },
//         (error, result) => {
//           if (error) return reject(error);

//           resolve({
//             url: result?.secure_url,
//           });
//         },
//       );

//       const bufferStream = new Readable();
//       bufferStream.push(file.buffer);
//       bufferStream.push(null);

//       bufferStream.pipe(uploadStream);
//     });
//   }
// }
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

@Controller('upload')
export class UploadController {

  // ================= UPLOAD IMAGE =================
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadImage(
    @UploadedFile()
    file: Express.Multer.File,
  ) {

    if (!file) {
      throw new Error('No file uploaded');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'courses',
          resource_type: 'image',
        },
        (error, result) => {

          if (error) {
            return reject(error);
          }

          resolve({
            url: result?.secure_url,
          });
        },
      );

      const bufferStream = new Readable();

      bufferStream.push(file.buffer);
      bufferStream.push(null);

      bufferStream.pipe(uploadStream);
    });
  }

  // ================= UPLOAD VIDEO =================
  @Post('video')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 500 * 1024 * 1024, // 500MB
      },
    }),
  )
  async uploadVideo(
    @UploadedFile()
    file: Express.Multer.File,
  ) {

    if (!file) {
      throw new Error('No file uploaded');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'course-videos',
          resource_type: 'video',
        },
        (error, result) => {

          if (error) {
            return reject(error);
          }

          resolve({
            url: result?.secure_url,

            // thời lượng video (giây)
            duration: result?.duration,
          });
        },
      );

      const bufferStream = new Readable();

      bufferStream.push(file.buffer);
      bufferStream.push(null);

      bufferStream.pipe(uploadStream);
    });
  }
}