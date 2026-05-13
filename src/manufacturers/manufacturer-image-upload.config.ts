import { Options } from 'multer';
import { adminImageMemoryMulterOptions } from '../common/upload/multer-universal.config';

export function manufacturerImageMulterOptions(): Options {
  return adminImageMemoryMulterOptions();
}
