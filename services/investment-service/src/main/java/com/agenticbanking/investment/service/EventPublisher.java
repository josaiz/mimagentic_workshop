package com.agenticbanking.investment.service;

import com.agenticbanking.investment.model.BankingEvent;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.UUID;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class EventPublisher {
  private final KafkaTemplate<String, String> kafkaTemplate;
  private final ObjectMapper objectMapper;

  public EventPublisher(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
    this.kafkaTemplate = kafkaTemplate;
    this.objectMapper = objectMapper;
  }

  public BankingEvent publish(String eventType, BankingEvent source, String causationId, JsonNode payload, String seed) {
    try {
      var event = new BankingEvent(
          UUID.nameUUIDFromBytes(seed.getBytes(StandardCharsets.UTF_8)).toString(),
          eventType,
          1,
          Instant.now().toString(),
          "investment-service",
          source.correlationId(),
          causationId,
          seed,
          source.aggregateId(),
          payload);
      kafkaTemplate.send("banking.events", event.correlationId(), objectMapper.writeValueAsString(event));
      return event;
    } catch (Exception ex) {
      throw new IllegalStateException("Failed to publish investment event", ex);
    }
  }
}
