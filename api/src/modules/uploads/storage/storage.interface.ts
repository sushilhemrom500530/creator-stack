export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  thumbnailUrl?: string;
  format: string;
  resourceType: 'image' | 'video' | 'raw';
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
}

export interface StorageProvider {
  upload(file: Express.Multer.File, folder?: string): Promise<UploadResult>;
  delete(publicId: string, resourceType?: string): Promise<boolean>;
}
