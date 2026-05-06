package com.agenticbanking.account.service;

import com.agenticbanking.account.model.BankingEvent;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.UUID;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class EventPublisher {
  private static final String TOPIC = "banking.events";
  private final KafkaTemplate<String, String> kafkaTemplate;
  private final ObjectMapper objectMapper;

  public EventPublisher(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
    this.kafkaTemplate = kafkaTemplate;
    this.objectMapper = objectMapper;
  }

  public void publish(String eventType, BankingEvent source, JsonNode payload, String idempotencyKey) {
    try {
      var event = new BankingEvent(
          UUID.randomUUID().toString(),
          eventType,
          1,
          Instant.now().toString(),
          "account-service",
          source.correlationId(),
          source.eventId(),
          idempotencyKey,
          source.aggregateId(),
          payload);
      kafkaTemplate.send(TOPIC, event.correlationId(), objectMapper.writeValueAsString(event));
    } catch (Exception ex) {
      throw new IllegalStateException("Failed to publish account event", ex);
    }
  }
}
