# Production Multi-Stage Dockerfile for CampusFlex

# 1. Build Stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# 2. Production Execution Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create a non-root system user for security
RUN addgroup -S campusflex && adduser -S campusflex -G campusflex
USER campusflex

COPY --from=builder /app/target/campusflex-1.0.0.jar app.jar

EXPOSE 8080

# Configure JVM options for container environments
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
