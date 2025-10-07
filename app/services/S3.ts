import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

class S3Service {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.WASABI_BUCKET || "bank-content-dev";
    
    this.client = new S3Client({
      region: process.env.WASABI_REGION || "ap-southeast-1",
      endpoint: process.env.WASABI_ENDPOINT || "https://s3.ap-southeast-1.wasabisys.com",
      credentials: {
        accessKeyId: process.env.WASABI_ACCESS_KEY!,
        secretAccessKey: process.env.WASABI_SECRET_KEY!,
      },
      forcePathStyle: true, // Required for Wasabi
    });
  }

  /**
   * Generate a presigned URL for uploading files to S3
   * @param key - The file key/path in S3
   * @param contentType - The MIME type of the file
   * @param expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
   * @returns Promise<string> - The presigned URL
   */
  async getSignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(this.client, command, {
      expiresIn,
    });

    return signedUrl;
  }

  /**
   * Generate a presigned URL for downloading files from S3
   * @param key - The file key/path in S3
   * @param expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
   * @returns Promise<string> - The presigned download URL
   */
  async getSignedDownloadUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const signedUrl = await getSignedUrl(this.client, command, {
      expiresIn,
    });

    return signedUrl;
  }

  /**
   * Generate a direct Wasabi URL for uploaded files (used for upload operations)
   * @param key - The file key/path in S3
   * @returns string - The direct Wasabi URL
   */
  getDirectUrl(key: string): string {
    return `${process.env.WASABI_ENDPOINT}/${this.bucket}/${key}`;
  }

  /**
   * Generate a public URL for accessing uploaded files via CDN
   * @param key - The file key/path in S3
   * @returns string - The public CDN URL
   */
  getPublicUrl(key: string): string {
    const cdnUrl = process.env.CDN_URL || process.env.WASABI_ENDPOINT;
    return `${cdnUrl}/${this.bucket}/${key}`;
  }

  /**
   * Generate a unique file key with timestamp and random string
   * @param originalName - Original filename
   * @param folder - Optional folder path (default: 'uploads')
   * @returns string - Unique file key
   */
  generateFileKey(originalName: string, folder: string = "uploads"): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-');
    
    return `${folder}/${timestamp}-${randomString}-${sanitizedName}.${extension}`;
  }

  /**
   * Generate file key specifically for product images
   * @param originalName - Original filename
   * @returns string - Product image file key
   */
  generateProductImageKey(originalName: string): string {
    return this.generateFileKey(originalName, "products/images");
  }

  /**
   * Get bucket name
   * @returns string - Current bucket name
   */
  getBucket(): string {
    return this.bucket;
  }
}

export default new S3Service();