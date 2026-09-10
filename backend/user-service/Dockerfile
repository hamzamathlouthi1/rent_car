FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /build
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline
COPY src src
RUN mvn -q clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=build /build/target/user-service-*.jar app.jar
RUN mkdir /data && chown -R app:app /app /data
USER app
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
