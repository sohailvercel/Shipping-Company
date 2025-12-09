# Shipping App Server

Backend server for the Shipping Line application built with Node.js, Express.js, TypeScript, and MongoDB.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **Gallery Management**: Upload and manage images with categories
- **Blog Management**: Create and manage blog posts with rich content
- **Tariff Management**: Upload and manage PDF tariff documents
- **Vessel Schedule Management**: Create and manage vessel schedules
- **File Upload**: Support for image and PDF file uploads
- **Security**: Rate limiting, CORS, helmet security headers

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Gallery
- `GET /api/gallery` - Get all gallery images (public)
- `GET /api/gallery/:id` - Get single gallery image (public)
- `POST /api/gallery` - Add new gallery image (admin only)
- `PUT /api/gallery/:id` - Update gallery image (admin only)
- `DELETE /api/gallery/:id` - Delete gallery image (admin only)

### Blogs
- `GET /api/blogs` - Get all blog posts (public)
- `GET /api/blogs/:id` - Get single blog post (public)
- `POST /api/blogs` - Create new blog post (admin only)
- `PUT /api/blogs/:id` - Update blog post (admin only)
- `DELETE /api/blogs/:id` - Delete blog post (admin only)

### Tariffs
- `GET /api/tariffs` - Get all tariff documents (public)
- `GET /api/tariffs/:id` - Get single tariff document (public)
- `POST /api/tariffs` - Upload new tariff PDF (admin only)
- `PUT /api/tariffs/:id` - Update tariff document (admin only)
- `DELETE /api/tariffs/:id` - Delete tariff document (admin only)

### Schedules
- `GET /api/schedules` - Get all vessel schedules (public)
- `GET /api/schedules/:id` - Get single vessel schedule (public)
- `POST /api/schedules` - Create new vessel schedule (admin only)
- `PUT /api/schedules/:id` - Update vessel schedule (admin only)
- `DELETE /api/schedules/:id` - Delete vessel schedule (admin only)

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env` file in the server directory:
```env
MONGO_URI=mongodb+srv://shippingUser:hellobuddy@shippingcluster.rqfhr3i.mongodb.net/shippingDB?retryWrites=true&w=majority&appName=ShippingCluster
JWT_SECRET=shipping_app_super_secret_jwt_key_2024
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=10485760
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/gif
ALLOWED_PDF_TYPES=application/pdf
ADMIN_EMAIL=admin@shippingapp.com
ADMIN_PASSWORD=admin123456
```

3. **Create admin user:**
```bash
node scripts/create-admin.js
```

4. **Build and start the server:**
```bash
# For development
npm run dev

# For production
npm run build
npm start
```

## Database Models

### User
- email (unique)
- password (hashed)
- role (admin/user)

### Gallery
- title
- description
- imageUrl
- category (ships, ports, containers, logistics, offices)
- uploadedBy (reference to User)

### Blog
- title
- excerpt
- content
- imageUrl
- externalLink
- category (shipping, logistics, industry, company)
- author
- authorRole
- publishDate
- readTime
- featured
- tags
- createdBy (reference to User)

### Tariff
- title
- description
- pdfUrl
- category
- uploadedBy (reference to User)

### Schedule
- vesselName
- vesselType
- capacity
- flag
- currentLocation
- voyages (array of voyage objects)
- createdBy (reference to User)

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- File upload validation

## File Upload

- Images: JPEG, PNG, WebP, GIF (max 10MB)
- PDFs: PDF files (max 10MB)
- Files are stored in the `uploads/` directory
- Static file serving for uploaded files

## Frontend Integration

The server is designed to work with the React frontend. Make sure to:

1. Start the server on port 5000
2. Configure the frontend to use `http://localhost:5000/api` as the base URL
3. Use the admin credentials created by the setup script to login

## Admin Dashboard

Once logged in, admins can access:
- Gallery management at `/admin/gallery`
- Blog management at `/admin/blogs`
- Tariff management at `/admin/tariffs`
- Schedule management at `/admin/schedules`

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**: Check your MONGO_URI in the .env file
2. **JWT Secret Error**: Make sure JWT_SECRET is set in your .env file
3. **File Upload Issues**: Check that the uploads directory exists and has proper permissions
4. **CORS Issues**: Verify CLIENT_URL is set correctly in your .env file

### Development Tips

- Use `npm run dev` for development with auto-restart
- Check the console for detailed error messages
- Use the health check endpoint: `GET /health`
- Monitor the uploads directory for uploaded files