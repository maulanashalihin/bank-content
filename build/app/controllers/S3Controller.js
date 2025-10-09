"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const S3_1 = __importDefault(require("../services/S3"));
class S3Controller {
    async getSignedUrl(request, response) {
        try {
            const { filename, contentType, folder } = await request.json();
            if (!filename || !contentType) {
                return response.status(400).json({
                    success: false,
                    message: "Filename and content type are required",
                });
            }
            let allowedTypes = [];
            let errorMessage = "";
            if (folder === "carousel" || folder === "uploads") {
                allowedTypes = [
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/gif",
                    "image/webp",
                    "image/svg+xml",
                    "video/mp4",
                    "video/mpeg",
                    "video/quicktime",
                    "video/x-msvideo",
                    "video/webm",
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "application/vnd.ms-powerpoint",
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                ];
                errorMessage = "Only image, video, and document files are allowed";
            }
            else {
                allowedTypes = [
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/gif",
                    "image/webp",
                    "image/svg+xml"
                ];
                errorMessage = "Only image files are allowed";
            }
            if (!allowedTypes.includes(contentType)) {
                return response.status(400).json({
                    success: false,
                    message: errorMessage,
                });
            }
            const fileKey = folder === "products"
                ? S3_1.default.generateProductImageKey(filename)
                : S3_1.default.generateFileKey(filename, folder || "uploads");
            const signedUrl = await S3_1.default.getSignedUploadUrl(fileKey, contentType);
            const publicUrl = S3_1.default.getPublicUrl(fileKey);
            return response.json({
                success: true,
                data: {
                    signedUrl,
                    publicUrl,
                    fileKey,
                    bucket: S3_1.default.getBucket(),
                    expiresIn: 3600,
                },
            });
        }
        catch (error) {
            console.error("Error generating signed URL:", error);
            return response.status(500).json({
                success: false,
                message: "Failed to generate signed URL",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async getProductImageUrl(request, response) {
        try {
            const { filename, contentType } = await request.json();
            if (!filename || !contentType) {
                return response.status(400).json({
                    success: false,
                    message: "Filename and content type are required",
                });
            }
            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/gif",
                "image/webp",
                "image/svg+xml"
            ];
            if (!allowedTypes.includes(contentType)) {
                return response.status(400).json({
                    success: false,
                    message: "Only image files are allowed",
                });
            }
            const fileKey = S3_1.default.generateProductImageKey(filename);
            const signedUrl = await S3_1.default.getSignedUploadUrl(fileKey, contentType);
            const publicUrl = S3_1.default.getPublicUrl(fileKey);
            return response.json({
                success: true,
                data: {
                    signedUrl,
                    publicUrl,
                    fileKey,
                    bucket: S3_1.default.getBucket(),
                    expiresIn: 3600,
                },
            });
        }
        catch (error) {
            console.error("Error generating product image signed URL:", error);
            return response.status(500).json({
                success: false,
                message: "Failed to generate signed URL for product image",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async getPublicUrl(request, response) {
        try {
            const { fileKey } = request.params;
            if (!fileKey) {
                return response.status(400).json({
                    success: false,
                    message: "File key is required",
                });
            }
            const publicUrl = S3_1.default.getPublicUrl(fileKey);
            return response.json({
                success: true,
                data: {
                    publicUrl,
                    fileKey,
                    bucket: S3_1.default.getBucket(),
                },
            });
        }
        catch (error) {
            console.error("Error getting public URL:", error);
            return response.status(500).json({
                success: false,
                message: "Failed to get public URL",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async health(request, response) {
        try {
            return response.json({
                success: true,
                message: "S3 service is healthy",
                data: {
                    bucket: S3_1.default.getBucket(),
                    endpoint: process.env.WASABI_ENDPOINT,
                    region: process.env.WASABI_REGION,
                },
            });
        }
        catch (error) {
            console.error("S3 health check failed:", error);
            return response.status(500).json({
                success: false,
                message: "S3 service health check failed",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
exports.default = new S3Controller();
//# sourceMappingURL=S3Controller.js.map