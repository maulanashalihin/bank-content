"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
class S3Service {
    constructor() {
        this.bucket = process.env.WASABI_BUCKET || "bank-content-dev";
        this.client = new client_s3_1.S3Client({
            region: process.env.WASABI_REGION || "ap-southeast-1",
            endpoint: process.env.WASABI_ENDPOINT || "https://s3.ap-southeast-1.wasabisys.com",
            credentials: {
                accessKeyId: process.env.WASABI_ACCESS_KEY,
                secretAccessKey: process.env.WASABI_SECRET_KEY,
            },
            forcePathStyle: true,
        });
    }
    async getSignedUploadUrl(key, contentType, expiresIn = 3600) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: contentType,
        });
        const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.client, command, {
            expiresIn,
        });
        return signedUrl;
    }
    async getSignedDownloadUrl(key, expiresIn = 3600) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.client, command, {
            expiresIn,
        });
        return signedUrl;
    }
    getDirectUrl(key) {
        return `${process.env.WASABI_ENDPOINT}/${this.bucket}/${key}`;
    }
    getPublicUrl(key) {
        const cdnUrl = process.env.CDN_URL || process.env.WASABI_ENDPOINT;
        return `${cdnUrl}/${this.bucket}/${key}`;
    }
    generateFileKey(originalName, folder = "uploads") {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = originalName.split('.').pop();
        const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
        const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-');
        return `${folder}/${timestamp}-${randomString}-${sanitizedName}.${extension}`;
    }
    generateProductImageKey(originalName) {
        return this.generateFileKey(originalName, "products/images");
    }
    async deleteFile(key) {
        try {
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });
            await this.client.send(command);
            return true;
        }
        catch (error) {
            console.error('Error deleting file from S3:', error);
            return false;
        }
    }
    getBucket() {
        return this.bucket;
    }
}
exports.default = new S3Service();
//# sourceMappingURL=S3.js.map