# Mantri Traders Backend API

A Node.js + Express + MongoDB backend for the Mantri Traders tile business website.

## Features

- 🔐 **Authentication** - JWT-based admin authentication
- 📦 **Product Management** - CRUD operations for tile products
- 📸 **Image Upload** - Multer-based image handling with validation
- 📧 **Enquiry System** - Customer enquiry management
- 🗄️ **Database** - MongoDB with Mongoose ODM
- 🔒 **Security** - Password hashing, JWT tokens, input validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd mantritraders-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `config.env` and update the values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mantritraders
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ADMIN_EMAIL=admin@mantritraders.com
   ADMIN_PASSWORD=admin123
   ```

4. **Start MongoDB**
   - Local: `mongod`
   - Or use MongoDB Atlas (cloud)

5. **Run the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/setup` - Create initial admin user

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/upload-image` - Upload image (admin)
- `GET /api/products/categories/list` - Get categories (public)

### Enquiries
- `POST /api/enquiries` - Submit enquiry (public)
- `GET /api/enquiries` - Get all enquiries (admin)
- `GET /api/enquiries/:id` - Get single enquiry (admin)
- `PATCH /api/enquiries/:id/status` - Update status (admin)
- `DELETE /api/enquiries/:id` - Delete enquiry (admin)
- `GET /api/enquiries/stats/overview` - Get statistics (admin)

## Database Models

### User
- email, password, role, isActive, timestamps

### Product
- name, category, description, image, price, isActive, featured, timestamps

### Enquiry
- name, email, phone, message, product (ref), status, ipAddress, userAgent, timestamps

## Security Features

- **Password Hashing** - bcryptjs for secure password storage
- **JWT Authentication** - Token-based session management
- **Input Validation** - Request data validation
- **File Upload Security** - File type and size restrictions
- **CORS** - Cross-origin resource sharing configuration

## File Structure

```
mantritraders-backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── uploads/         # Uploaded images
├── server.js        # Main server file
├── config.env       # Environment variables
└── package.json     # Dependencies
```

## Usage Examples

### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mantritraders.com","password":"admin123"}'
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Classic Marble","category":"Floor Tiles","description":"Elegant marble finish","image":"data:image/jpeg;base64,..."}'
```

### Submit Enquiry
```bash
curl -X POST http://localhost:5000/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","message":"Interested in your tiles"}'
```

## Development

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon for automatic server restart on file changes.

### Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `ADMIN_EMAIL` - Default admin email
- `ADMIN_PASSWORD` - Default admin password

## Production Deployment

1. **Set production environment variables**
2. **Use PM2 or similar process manager**
3. **Set up MongoDB Atlas or production MongoDB**
4. **Configure reverse proxy (nginx)**
5. **Set up SSL certificates**

## Support

For issues and questions, please check the API documentation or contact the development team. 