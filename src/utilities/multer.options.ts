import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const imageRootPath = path.join(__dirname, '..', '..', '..', `storage`);

const createDir = (uploadType: string) => {
  const imageDirPath = path.join(imageRootPath, uploadType);
  const rootCheck = fs.existsSync(imageRootPath);
  const dirCheck = fs.existsSync(imageDirPath);

  if (!rootCheck) {
    fs.mkdirSync(imageRootPath);
    fs.mkdirSync(imageDirPath);
  } else if (!dirCheck) {
    fs.mkdirSync(imageDirPath);
  }
};

const storage = (uploadType: string): multer.StorageEngine => {
  createDir(uploadType);

  return multer.diskStorage({
    destination(req, file, cb) {
      const imageDirPath = path.join(imageRootPath, uploadType);
      cb(null, imageDirPath);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      const fileName = `${req.query.ownerId}_${Date.now()}${ext}`;

      cb(null, fileName);
    },
  });
};

export const multerOptions = (uploadType: string) => {
  const result: MulterOptions = {
    storage: storage(uploadType),
  };
  return result;
};
