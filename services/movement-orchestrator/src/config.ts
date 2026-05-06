export const config = {
  port: Number(process.env.PORT ?? 3001),
  kafkaBootstrapServers: (process.env.KAFKA_BOOTSTRAP_SERVERS ?? "localhost:9092").split(","),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  accountId: process.env.DEMO_ACCOUNT_ID ?? "acc_main_001"
};
