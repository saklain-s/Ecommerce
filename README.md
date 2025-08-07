# 🛒 SprinEcommerce - Full Stack E-Commerce Application

ShopAura is a modern, full-stack e-commerce web application featuring a robust Spring Boot backend and a React (Vite + Material-UI) frontend. It supports user registration (Customer/Seller), JWT authentication, product and category management, image uploads via Cloudinary, a shopping cart, and order processing.

---

## 🚀 Features

### Backend (Spring Boot)
- RESTful APIs for products, categories, users, cart, and orders
- JWT-based authentication and role-based access (Customer/Seller)
- Secure password hashing (BCrypt)
- Image uploads to Cloudinary
- File-based H2 database for persistence (easily migratable to MySQL/PostgreSQL)
- Swagger/OpenAPI documentation
- CORS configured for frontend integration
- Actuator endpoints for monitoring

### Frontend (React + Vite + MUI)
- Enterprise-grade UI with a custom Material-UI theme
- Home page with a hero banner and featured products
- Product listing with filtering by category and search
- Product details with image, price (₹), and stock
- Shopping cart with add/remove/checkout functionality
- User registration, login, and profile management (PAN required for sellers)
- Seller-only product management (add/delete)
- Order history page
- Responsive and mobile-friendly design

---

## 🛠️ Tech Stack
- **Backend:** Java 21, Spring Boot 3.5.0, Spring Data JPA, Spring Security, JWT, Cloudinary, H2, Maven
- **Frontend:** React 18, Vite, Material-UI, Axios, React Router DOM

---

## ⚙️ Setup Instructions

### Backend
1. `cd sb-com`
2. Configure your Cloudinary credentials in `src/main/resources/application.properties`:
   ```properties
   cloudinary.cloud_name=YOUR_CLOUD_NAME
   cloudinary.api_key=YOUR_API_KEY
   cloudinary.api_secret=YOUR_API_SECRET
   ```
3. (Optional) Adjust the H2 database path in `application.properties` for persistence.
4. Run: `mvn spring-boot:run`
5. Access Swagger UI at: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### Frontend
1. `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. The app runs at: [http://localhost:5173](http://localhost:5173)

---

## 🔒 Authentication & Roles
- Register as a Customer or Seller (PAN number required for sellers)
- Login returns a JWT token (used for protected API calls)
- Role-based access: Only sellers can add or delete products

---

## 🖼️ Image Uploads
- Product images are uploaded to Cloudinary via the backend
- Maximum file size: 10MB (configurable)

---

## 🗄️ Database
- Uses a file-based H2 database for development (data persists across restarts)
- **Note:** For production, migrate to MySQL or PostgreSQL for reliability and scalability

---

## 📜 API Documentation
- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- See the API docs for endpoints, request/response formats, and authentication details

---

## 📦 Future Improvements
- Email notifications
- Payment gateway integration
- Product reviews and ratings
- Admin dashboard
- Production database migration

---

## 📄 License
This project is for educational purposes. Feel free to contribute or use this project as a base for a full-fledged e-commerce application!






