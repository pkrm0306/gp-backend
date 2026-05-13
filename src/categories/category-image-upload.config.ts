import { Options } from 'multer';
import { adminImageMemoryMulterOptions } from '../common/upload/multer-universal.config';

export function categoryImageMulterOptions(): Options {
  return adminImageMemoryMulterOptions();
}
