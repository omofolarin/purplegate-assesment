import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ReconcileService } from './reconcile.service';
import Express, { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('reconcile')
export class ReconcileController {
  constructor(private readonly reconcileService: ReconcileService) { }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(
            null,
            `${file.fieldname}-${Date.now()}${extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.csv$/)) {
          return cb(new HttpException('Only CSV files are allowed!', HttpStatus.BAD_REQUEST), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    })
  )
  async reconcile(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length !== 2) {
      throw new HttpException('Two CSV files required (systemA, systemB)', HttpStatus.BAD_REQUEST);
    }
    const [systemA, systemB] = files;
    try {
      return await this.reconcileService.processCsvs(systemA.path, systemB.path);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
