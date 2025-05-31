
# 🛒 SprinEcommerce - Spring Boot E-Commerce Application

MyCoolLeap is a simple e-commerce web application built using **Spring Boot 3.5.0**, featuring Spring Web, Actuator for monitoring, and DevTools for efficient development. The application supports the creation and management of **product categories**, forming the foundation for a scalable e-commerce backend.

---

## 🚀 Features

- ✅ RESTful APIs using Spring Web
- 📦 Category management functionality
- 🔍 Actuator endpoints for monitoring (`/health`, `/info`)
- 🔁 Live reloading using Spring DevTools
- 🛠️ Built with Java 21 and Maven

---

## 🧾 Actuator Endpoints

The following Actuator endpoints are exposed:

- `GET /actuator/health` – Check application health
- `GET /actuator/info` – View application metadata

# 🛠️Technologies Used
Java 21

Spring Boot 3.5.0

Spring Web

Spring Boot Actuator

Spring Boot DevTools

Maven

application.properties

# Enable specific actuator endpoints
management.endpoint.web.exposure.include=health,info

# Enable /info data
management.info.env.enabled=true

# Custom application info
info.app.name=MyCoolLeap 

info.app.version=1.0.0 

info.app.description=This is a Spring Boot application with Actuator 

🧪 Build & Run
Make sure you're using IntelliJ IDEA with Maven configured (no separate Maven installation required if you're using IntelliJ):


📁 Future Improvements
🛍️ Add product listing under each category

👤 Implement user registration & authentication

🛒 Shopping cart and order processing

🧾 Database integration using Spring Data JPA

📜 License
This project is for educational purposes.

Feel free to contribute or expand this project as a base for a full-fledged e-commerce application!



Let me know if you want to add database integration, product APIs, or security features next!






