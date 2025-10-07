import AuthController from "../app/controllers/AuthController"; 
import Auth from "../app/middlewares/auth"
import Admin from "../app/middlewares/admin"
import HomeController from "../app/controllers/HomeController";
import AssetController from "../app/controllers/AssetController";
import ProductController from "../app/controllers/ProductController";
import ContentController from "../app/controllers/ContentController";
import S3Controller from "../app/controllers/S3Controller";
import HyperExpress from 'hyper-express';

const Route = new HyperExpress.Router();

/**
 * Public Routes
 * These routes are accessible without authentication
 * ------------------------------------------------
 * GET  / - Home page
 */
Route.get("/", HomeController.index);

/**
 * Authentication Routes
 * Routes for handling user authentication
 * ------------------------------------------------
 * GET   /login - Login page
 * POST  /login - Process login
 * GET   /register - Registration page
 * POST  /register - Process registration
 * POST  /logout - Logout user
 * GET   /google/redirect - Google OAuth redirect
 * GET   /google/callback - Google OAuth callback
 */
Route.get("/login", AuthController.loginPage);
Route.post("/login", AuthController.processLogin);
Route.get("/register", AuthController.registerPage);
Route.post("/register", AuthController.processRegister);
Route.post("/logout", AuthController.logout);
Route.get("/google/redirect", AuthController.redirect);
Route.get("/google/callback", AuthController.googleCallback);

/**
 * Password Reset Routes
 * Routes for handling password reset
 * ------------------------------------------------
 * GET   /forgot-password - Forgot password page
 * POST  /forgot-password - Send reset password link
 * GET   /reset-password/:id - Reset password page
 * POST  /reset-password - Process password reset
 */
Route.get("/forgot-password", AuthController.forgotPasswordPage);
Route.post("/forgot-password", AuthController.sendResetPassword);
Route.get("/reset-password/:id", AuthController.resetPasswordPage);
Route.post("/reset-password", AuthController.resetPassword);

/**
 * Protected Routes
 * These routes require authentication
 * ------------------------------------------------
 * GET   /home - User dashboard
 * GET   /profile - User profile
 * POST  /change-profile - Update profile
 * POST  /change-password - Change password
 * DELETE /users - Delete users (admin only)
 */
Route.get("/home", [Auth], AuthController.homePage);
Route.get("/profile", [Auth], AuthController.profilePage);
Route.post("/change-profile", [Auth], AuthController.changeProfile);
Route.post("/change-password", [Auth], AuthController.changePassword);
Route.delete("/users", [Auth], AuthController.deleteUsers);

/**
 * Product Routes
 * Routes for product management and search
 * ------------------------------------------------
 * Admin Routes (requires admin middleware):
 * GET    /admin/products - List all products
 * GET    /admin/products/create - Create product form
 * POST   /admin/products - Store new product
 * GET    /admin/products/:id - Show product details
 * GET    /admin/products/:id/edit - Edit product form
 * PUT    /admin/products/:id - Update product
 * DELETE /admin/products/:id - Delete product
 * 
 * User Routes (requires auth middleware):
 * GET    /api/products/search - Search products for mentioning
 * GET    /api/products/:id - Get product details for mentioning
 */

// Admin product management routes
Route.get("/admin/products", [Admin], ProductController.index);
Route.get("/admin/products/create", [Admin], ProductController.create);
Route.post("/admin/products", [Admin], ProductController.store);
Route.get("/admin/products/:id", [Admin], ProductController.show);
Route.get("/admin/products/:id/edit", [Admin], ProductController.edit);
Route.put("/admin/products/:id", [Admin], ProductController.update);
Route.delete("/admin/products/:id", [Admin], ProductController.destroy);

// User product search routes
Route.get("/api/products/search", [Auth], ProductController.search);
Route.get("/api/products/:id", [Auth], ProductController.getById);

/**
 * Content Management Routes
 * Routes for handling content creation, viewing, and management
 * ------------------------------------------------
 * GET    /contents - Content listing with filters
 * GET    /contents/create - Content creation form
 * POST   /contents - Store new content
 * GET    /contents/:id - View single content
 * GET    /contents/:id/edit - Edit content form
 * PUT    /contents/:id - Update content
 * DELETE /contents/:id - Delete content
 * GET    /contents/:id/download - Download content file
 */// Content Management Routes
Route.get("/contents", [Auth], ContentController.index);
Route.get("/contents/create", [Auth], ContentController.create);
Route.post("/contents", [Auth], ContentController.store);
Route.get("/contents/:id", [Auth], ContentController.show);
Route.get("/contents/:id/edit", [Auth], ContentController.edit);
Route.put("/contents/:id", [Auth], ContentController.update);
Route.delete("/contents/:id", [Auth], ContentController.destroy);
Route.get("/contents/:id/download", [Auth], ContentController.download);
Route.post("/contents/:id/share", [Auth], ContentController.share);

// Public shared content route (no auth required)
Route.get("/shared/:shareId", ContentController.getSharedContent);
/**
 * S3 File Upload Routes
 * Routes for handling file uploads to Wasabi S3
 * ------------------------------------------------
 * POST  /api/s3/signed-url - Generate signed URL for file upload
 * POST  /api/s3/product-image-url - Generate signed URL for product images
 * GET   /api/s3/public-url/:fileKey - Get public URL for existing file
 * GET   /api/s3/health - S3 service health check
 */
Route.post("/api/s3/signed-url", [Auth], S3Controller.getSignedUrl);
Route.post("/api/s3/product-image-url", [Auth], S3Controller.getProductImageUrl);
Route.get("/api/s3/public-url/:fileKey", [Auth], S3Controller.getPublicUrl);
Route.get("/api/s3/health", [Auth], S3Controller.health);

// Demo Route for ProductSearch Component
Route.get("/product-demo", [Auth], (request: any, response: any) => {
    return response.inertia("product-demo");
});

/**
 * Static Asset Handling Routes
 * 
 * 1. Dist Assets (/assets/:file)
 * Serves compiled and bundled assets from the dist/assets directory
 * - Handles JavaScript files (*.js) with proper content type
 * - Handles CSS files (*.css) with proper content type
 * - Implements in-memory caching for better performance
 * - Sets long-term browser cache headers (1 year)
 * Example URLs:
 * - /assets/app.1234abc.js
 * - /assets/main.5678def.css
 */
Route.get("/assets/:file", AssetController.distFolder);

/**
 * 2. Public Assets (/*) - Catch-all Route
 * Serves static files from the public directory
 * - Must be the LAST route in the file
 * - Only serves files with allowed extensions
 * - Returns 404 for paths without extensions
 * - Implements security checks against unauthorized access
 * 
 * Allowed file types:
 * - Images: .ico, .png, .jpeg, .jpg, .gif, .svg
 * - Documents: .txt, .pdf
 * - Fonts: .woff, .woff2, .ttf, .eot
 * - Media: .mp4, .webm, .mp3, .wav
 * - Web: .css, .js
 * 
 * Example URLs:
 * - /images/logo.png
 * - /documents/terms.pdf
 * - /fonts/roboto.woff2
 */
Route.get("/*", AssetController.publicFolder);

export default Route;