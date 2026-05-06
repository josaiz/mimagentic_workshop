export const config = {
  port: Number(process.env.PORT ?? 3002),
  kafkaBootstrapServers: (process.env.KAFKA_BOOTSTRAP_SERVERS ?? "localhost:9092").split(","),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  postgres: {
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    database: process.env.POSTGRES_DB ?? "banking",
    user: process.env.POSTGRES_USER ?? "banking",
    password: process.env.POSTGRES_PASSWORD ?? "banking"
  }
};
