---
name: spring-boot-components
description: Guidance for using Spring Boot components, constructor injection, Kafka listeners, and official Spring documentation in workshop services.
---

# Spring Boot Components Skill

## When To Use

Use this skill when changing Java Spring services, especially component boundaries, constructor injection, Kafka listeners, or tests.

## Official Docs First

When framework behavior matters, prefer official docs:

- Spring Framework IoC/DI: `https://docs.spring.io/spring-framework/reference/core/beans/`
- Spring Boot reference: `https://docs.spring.io/spring-boot/`
- Spring for Apache Kafka: `https://docs.spring.io/spring-kafka/reference/`

Use `webfetch` for exact Spring behavior instead of guessing.

## Procedure

1. Keep Spring annotations at the composition and adapter edges.
2. Prefer constructor injection for required collaborators.
3. Keep domain classes plain Java where possible.
4. Use `@Component` or `@Service` where Spring needs to instantiate the adapter/use case.
5. Keep `@KafkaListener` in an inbound adapter, not in domain or application policy.
6. Keep `KafkaTemplate` in an outbound adapter behind a port.
7. Use focused JUnit tests for domain/application logic without starting Spring unless Spring wiring is the thing being tested.

## Checklist

- Constructor injection only.
- No field injection.
- Spring annotations do not leak into domain policy.
- Kafka listener has one responsibility: deserialize/translate and call the use case.
- Kafka publisher adapter is the only class that knows `KafkaTemplate`.
- Tests cover behavior without requiring Kafka.

## Output Format

Return:

- `Spring components`: annotations and package placement.
- `Plain Java core`: classes deliberately left framework-free.
- `Docs checked`: official docs URLs when used.
- `Tests`: unit or Spring test recommendation.
