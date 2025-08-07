# Multi-stage build for Spring Boot application
<<<<<<< HEAD
FROM maven:3.9.6-openjdk-21 AS build
=======
FROM maven:3.9.6-eclipse-temurin-21 AS build
>>>>>>> 01ff45a (your commit message)

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
<<<<<<< HEAD
FROM openjdk:21-jre-slim
=======
FROM eclipse-temurin:21-jre-jammy
>>>>>>> 01ff45a (your commit message)

# Set working directory
WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Set environment variables
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]