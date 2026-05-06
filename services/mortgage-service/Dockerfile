FROM maven:3.9.11-eclipse-temurin-25 AS build
WORKDIR /workspace
COPY pom.xml .
COPY src src
RUN mvn package

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /workspace/target/mortgage-service-0.1.0.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
