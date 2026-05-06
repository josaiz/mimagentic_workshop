FROM maven:3.9.11-eclipse-temurin-25 AS test
WORKDIR /workspace
COPY pom.xml .
COPY src src
RUN mvn test

FROM test AS build
RUN mvn package -DskipTests

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /workspace/target/account-service-0.1.0.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
