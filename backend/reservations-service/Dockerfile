FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /build
COPY pom.xml .
COPY src src
RUN mvn -q clean package -DskipTests
FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=build /build/target/reservations-service-*.jar app.jar
USER app
EXPOSE 8082
ENTRYPOINT ["java","-jar","app.jar"]