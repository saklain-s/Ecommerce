# 🛍️ ShopAura E-Commerce Project Structure

## 📁 **Root Directory**
```
Ecommerce/
├── 📄 README.md                           # Project documentation
├── 📄 PROJECT_STRUCTURE.md                # This file - Project structure overview
├── 📄 DEPLOYMENT.md                       # Deployment guide
├── 📄 .gitattributes                      # Git line ending configuration
│
├── 🐳 docker-compose.yml                  # Local development with Docker
│
├── 📁 sb-com/                            # Spring Boot Backend
│   ├── 📄 mvnw                           # Maven wrapper (Unix)
│   ├── 📄 mvnw.cmd                       # Maven wrapper (Windows)
│   ├── 📄 pom.xml                        # Maven dependencies
│   ├── 📄 Dockerfile                     # Backend Docker image
│   │
│   └── 📁 src/
│       ├── 📁 main/
│       │   ├── 📁 java/com/ecommerce/project/
│       │   │   ├── 📄 SbComApplication.java           # Main Spring Boot app
│       │   │   │
│       │   │   ├── 📁 config/
│       │   │   │   ├── 📄 SecurityConfig.java         # Spring Security config
│       │   │   │   └── 📄 RedisConfig.java            # Redis configuration
│       │   │   │
│       │   │   ├── 📁 controller/
│       │   │   │   ├── 📄 CategoryController.java     # Category REST API
│       │   │   │   ├── 📄 ProductController.java      # Product REST API
│       │   │   │   ├── 📄 UserController.java         # User REST API
│       │   │   │   ├── 📄 RedisController.java        # Redis cache management
│       │   │   │   └── 📄 GlobalExceptionHandler.java # Global error handling
│       │   │   │
│       │   │   ├── 📁 model/
│       │   │   │   ├── 📄 User.java                   # User entity
│       │   │   │   ├── 📄 Product.java                # Product entity
│       │   │   │   ├── 📄 Category.java               # Category entity
│       │   │   │   ├── 📄 Order.java                  # Order entity
│       │   │   │   └── 📄 OrderItem.java              # Order item entity
│       │   │   │
│       │   │   ├── 📁 repositories/
│       │   │   │   ├── 📄 UserRepository.java         # User data access
│       │   │   │   ├── 📄 ProductRepository.java      # Product data access
│       │   │   │   ├── 📄 CategoryRepository.java     # Category data access
│       │   │   │   └── 📄 OrderRepository.java        # Order data access
│       │   │   │
│       │   │   ├── 📁 service/
│       │   │   │   ├── 📄 UserService.java            # User business logic
│       │   │   │   ├── 📄 UserServiceImpl.java        # User service implementation
│       │   │   │   ├── 📄 ProductService.java         # Product business logic
│       │   │   │   ├── 📄 ProductServiceImpl.java     # Product service implementation
│       │   │   │   ├── 📄 CategoryService.java        # Category business logic
│       │   │   │   ├── 📄 CategoryServiceImpl.java    # Category service implementation
│       │   │   │   ├── 📄 ImageUploadService.java     # Cloudinary image upload
│       │   │   │   └── 📄 RedisService.java           # Redis cache operations
│       │   │   │
│       │   │   └── 📁 util/
│       │   │       └── 📄 JwtUtil.java                # JWT token utilities
│       │   │
│       │   └── 📁 resources/
│       │       ├── 📄 application.properties           # Development config
│       │       └── 📄 application-production.yml       # Production config
│       │
│       └── 📁 test/
│           └── 📁 java/com/ecommerce/project/
│               └── 📄 SbComApplicationTests.java       # Unit tests
│
├── 📁 frontend/                           # React Frontend
│   ├── 📄 package.json                    # Node.js dependencies
│   ├── 📄 vite.config.js                  # Vite configuration
│   ├── 📄 Dockerfile                      # Frontend Docker image
│   ├── 📄 nginx.conf                      # Nginx configuration
│   │
│   ├── 📁 public/
│   │   ├── 📄 index.html                  # Main HTML file
│   │   └── 📄 shopaura-icon.svg           # Custom favicon
│   │
│   └── 📁 src/
│       ├── 📄 main.jsx                    # React entry point
│       ├── 📄 App.jsx                     # Main app component
│       │
│       ├── 📁 components/
│       │   ├── 📄 Navbar.jsx              # Navigation bar
│       │   ├── 📄 CategoryBar.jsx         # Category navigation
│       │   ├── 📄 ProductCard.jsx         # Product display card
│       │   ├── 📄 ProductDetails.jsx      # Product detail view
│       │   ├── 📄 Cart.jsx                # Shopping cart
│       │   ├── 📄 Orders.jsx              # Order history
│       │   ├── 📄 AddProduct.jsx          # Add product form
│       │   ├── 📄 Products.jsx            # Products listing
│       │   ├── 📄 Home.jsx                # Home page
│       │   ├── 📄 Login.jsx               # Login form
│       │   ├── 📄 Register.jsx            # Registration form
│       │   └── 📄 Profile.jsx             # User profile
│       │
│       ├── 📁 context/
│       │   └── 📄 AuthContext.jsx         # Authentication context
│       │
│       └── 📁 styles/
│           └── 📄 index.css               # Global styles
│
├── 📁 infrastructure/                     # AWS Infrastructure (Terraform)
│   ├── 📄 main.tf                        # Free tier infrastructure (USE THIS)
│   ├── 📄 main-production.tf              # Production infrastructure
│   └── 📄 variables.tf                   # Terraform variables
│
├── 📁 scripts/                           # Deployment Scripts
│   ├── 📄 deploy.sh                      # Linux/macOS deployment
│   ├── 📄 deploy.ps1                     # Windows PowerShell deployment
│   └── 📄 deploy-free.sh                 # Free tier deployment
│
└── 📁 .github/                           # GitHub Actions CI/CD
    └── 📁 workflows/
        ├── 📄 deploy.yml                  # Main deployment workflow
        └── 📄 deploy-free-tier.yml        # Free tier deployment workflow
```

## 🏗️ **Architecture Overview**

### **Backend (Spring Boot)**
- **Framework**: Spring Boot 3.x
- **Database**: H2 (File-based for persistence)
- **Cache**: Redis (In-memory caching)
- **Security**: JWT + Spring Security
- **File Storage**: Cloudinary (Image uploads)
- **Build Tool**: Maven

### **Frontend (React)**
- **Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router DOM
- **State Management**: Context API
- **HTTP Client**: Axios

### **Infrastructure (AWS)**
- **Container Registry**: ECR
- **Container Orchestration**: ECS (Fargate)
- **Load Balancer**: ALB
- **Networking**: VPC, Subnets, Security Groups
- **Monitoring**: CloudWatch
- **IaC**: Terraform

## 🚀 **Key Features**

### **Authentication & Authorization**
- ✅ JWT-based authentication
- ✅ Role-based access (Customer/Seller)
- ✅ PAN number validation for sellers
- ✅ Secure password hashing (BCrypt)

### **Product Management**
- ✅ CRUD operations for products
- ✅ Image upload to Cloudinary
- ✅ Category-based organization
- ✅ Search and filtering
- ✅ Price range filtering
- ✅ Pagination support

### **Shopping Experience**
- ✅ Shopping cart with localStorage
- ✅ Order history
- ✅ Product details view
- ✅ Responsive design

### **Performance & Caching**
- ✅ Redis caching for products
- ✅ Search result caching
- ✅ Category caching
- ✅ Session management

### **Deployment**
- ✅ Docker containerization
- ✅ AWS ECS deployment
- ✅ CI/CD with GitHub Actions
- ✅ Free tier optimization

## 📊 **Database Schema**

### **Users Table**
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password` (Hashed)
- `role` (CUSTOMER/SELLER)
- `panNumber` (For sellers)

### **Categories Table**
- `id` (Primary Key)
- `name`
- `description`

### **Products Table**
- `id` (Primary Key)
- `name`
- `description`
- `price`
- `stock`
- `categoryId` (Foreign Key)
- `createdBy` (Foreign Key to Users)
- `imageUrl` (Cloudinary URL)

### **Orders Table**
- `id` (Primary Key)
- `userId` (Foreign Key)
- `total`
- `status`
- `createdAt`

### **OrderItems Table**
- `id` (Primary Key)
- `orderId` (Foreign Key)
- `productId` (Foreign Key)
- `quantity`
- `price`

## 🔧 **Configuration Files**

### **Development Environment**
- `application.properties`: H2 database, Redis localhost
- `vite.config.js`: Development server settings
- `docker-compose.yml`: Local Redis + Backend + Frontend

### **Production Environment**
- `application-production.yml`: PostgreSQL, Redis cluster
- `main.tf`: AWS infrastructure (Free tier)
- `nginx.conf`: Frontend web server

## 🎯 **Deployment Options**

### **Option 1: Free Tier (Recommended)**
```bash
cd infrastructure
terraform init
terraform plan
terraform apply
```

### **Option 2: Production**
```bash
cd infrastructure
# Rename main-production.tf to main.tf
terraform init
terraform plan
terraform apply
```

### **Option 3: Manual Script**
```bash
./scripts/deploy-free.sh  # Linux/macOS
# or
./scripts/deploy.ps1      # Windows
```

## 💰 **Cost Estimation (Free Tier)**
- **EC2**: 750 hours/month (t3.micro)
- **ECR**: 500MB storage
- **ALB**: 15GB data processing
- **EBS**: 30GB storage
- **CloudWatch**: 5GB log ingestion
- **Total**: **$0/month** (within limits)

## 🔍 **Monitoring & Logs**
- **Application Logs**: CloudWatch Logs
- **Performance**: CloudWatch Metrics
- **Health Checks**: ALB health checks
- **Cache Stats**: Redis controller endpoints

## 🛠️ **Development Commands**

### **Backend**
```bash
cd sb-com
mvn spring-boot:run
```

### **Frontend**
```bash
cd frontend
npm install
npm run dev
```

### **Docker (Local)**
```bash
docker-compose up
```

### **Redis (Local)**
```bash
redis-server
```

## 📝 **API Endpoints**

### **Public Endpoints**
- `GET /api/categories` - List categories
- `GET /api/products` - List products (paginated)
- `GET /api/products/all` - List all products
- `GET /api/products/search` - Search products
- `GET /api/products/price-range` - Filter by price
- `GET /api/products/stats` - Product statistics
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### **Protected Endpoints**
- `POST /api/products` - Add product (SELLER only)
- `DELETE /api/products/{id}` - Delete product (Owner/SELLER)
- `GET /api/users/profile` - User profile
- `PUT /api/users/profile` - Update profile
- `GET /api/orders` - User orders
- `POST /api/orders` - Create order

### **Cache Management**
- `GET /api/cache/stats` - Cache statistics
- `GET /api/cache/health` - Cache health check
- `DELETE /api/cache/clear` - Clear all cache
- `GET /api/cache/keys` - List cache keys

---

**Last Updated**: August 2024
**Version**: 1.0.0
**Status**: Production Ready 🚀 