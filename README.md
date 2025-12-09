# Shipping Line Application

A comprehensive shipping line management application with a React frontend and Node.js backend, featuring admin authentication and content management capabilities.

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI**: Built with React, TypeScript, Tailwind CSS, and Framer Motion
- **Responsive Design**: Mobile-first design that works on all devices
- **Authentication**: JWT-based login system with protected routes
- **Admin Dashboard**: Comprehensive admin interface for content management
- **Interactive Components**: Animated carousels, galleries, and forms

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Complete API with authentication and CRUD operations
- **Database**: MongoDB with Mongoose ODM
- **Security**: JWT authentication, password hashing, rate limiting, CORS
- **File Upload**: Support for images and PDF uploads
- **Admin Management**: Role-based access control

### Admin Features (Login Required)
1. **Gallery Management**: Upload and organize images by categories
2. **Blog Management**: Create and manage blog posts with rich content
3. **Tariff Management**: Upload and manage PDF tariff documents
4. **Vessel Schedule Management**: Create and manage vessel schedules with port details

## 🏗️ Project Structure

```
Shipping App/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── utils/         # Utility functions
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── utils/         # Utility functions
│   │   └── ...
│   ├── uploads/           # File uploads directory
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository
   ```bash
   git clone <repository-url>
cd Shipping-App
   ```

### 2. Backend Setup

   ```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your MongoDB connection string
# MONGO_URI=mongodb+srv://shippingUser:hellobuddy@shippingcluster.rqfhr3i.mongodb.net/shippingDB?retryWrites=true&w=majority&appName=ShippingCluster

# Create admin user
node scripts/create-admin.js

# Start the server (development)
npm run dev

# Or build and start (production)
npm run build
npm start
```

### 3. Frontend Setup

```bash
# Navigate to client directory (in a new terminal)
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Login**: Use the credentials created by the setup script
  - Email: admin@shippingapp.com
  - Password: admin123456

## 📱 Usage

### Public Features
- Browse gallery images by category
- Read blog posts and news
- View tariff documents
- Check vessel schedules
- Contact and quote forms

### Admin Features (After Login)
1. **Dashboard**: Overview of all content
2. **Gallery Management**: Add/edit/delete images with categories
3. **Blog Management**: Create/edit blog posts with rich content
4. **Tariff Management**: Upload/manage PDF documents
5. **Schedule Management**: Create complex vessel schedules with port details

## 🔐 Authentication Flow

1. **Login**: Admin logs in with email/password
2. **JWT Token**: Server returns JWT token for authentication
3. **Protected Routes**: Frontend checks token for admin pages
4. **API Calls**: All admin API calls include JWT in headers
5. **Logout**: Token is cleared from frontend storage

## 🗄️ Database Schema

### Users
- Email (unique)
- Password (hashed)
- Role (admin/user)

### Gallery
- Title, Description, Image URL
- Category (ships, ports, containers, logistics, offices)
- Upload metadata

### Blogs
- Title, Excerpt, Content
- Image, External Link
- Category, Author info
- Tags, Featured status

### Tariffs
- Title, Description
- PDF URL, Category
- Upload metadata

### Schedules
- Vessel information
- Multiple voyages with port schedules
- Status tracking

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, Vercel, etc.)
4. Ensure uploads directory is accessible

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to your preferred platform
3. Update API base URL for production

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@shippingapp.com
ADMIN_PASSWORD=admin123456
```

**Frontend**
- Update axios baseURL in AuthContext.tsx for production

## 🛡️ Security Features

- JWT authentication with expiration
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Input validation and sanitization
- File upload validation
- Role-based access control

## 📝 API Documentation

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Public Endpoints
- `GET /api/gallery` - Get gallery images
- `GET /api/blogs` - Get blog posts
- `GET /api/tariffs` - Get tariff documents
- `GET /api/schedules` - Get vessel schedules

### Admin Endpoints (Require Authentication)
- `POST /api/gallery` - Add gallery image
- `PUT /api/gallery/:id` - Update gallery image
- `DELETE /api/gallery/:id` - Delete gallery image
- Similar CRUD operations for blogs, tariffs, and schedules

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the documentation
2. Review the code comments
3. Create an issue in the repository

## 🔄 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced search and filtering
- [ ] Image optimization and CDN integration
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Multi-language support

---

**Built with ❤️ for efficient shipping line management**