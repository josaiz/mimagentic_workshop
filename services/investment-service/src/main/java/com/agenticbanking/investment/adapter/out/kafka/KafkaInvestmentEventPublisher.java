package com.agenticbanking.investment.adapter.out.kafka;

import com.agenticbanking.investment.application.port.InvestmentEventPublisher;
import com.agenticbanking.investment.domain.ContributionDecision;
import com.agenticbanking.investment.model.BankingEvent;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.UUID;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaInvestmentEventPublisher implements InvestmentEventPublisher {
  private static final String TOPIC = "banking.events";
  private static final String PRODUCER = "investment-service";

  private final KafkaTemplate<String, String> kafkaTemplate;
  private final ObjectMapper objectMapper;

  public KafkaInvestmentEventPublisher(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
    this.kafkaTemplate = kafkaTemplate;
    this.objectMapper = objectMapper;
  }

  @Override
  public BankingEvent publishContributionRequested(BankingEvent source) {
    return publish(
        "FundContributionRequested",
        source,
        source.eventId(),
        source.payload(),
        "FundContributionRequested:" + source.eventId());
  }

  @Override
  public BankingEvent publishContributionTerminal(
      ContributionDecision decision,
      BankingEvent source,
      BankingEvent requested) {
    return publish(
        decision.eventType(),
        source,
        requested.eventId(),
        source.payload(),
        "FundContributionTerminal:" + source.eventId());
  }

  private BankingEvent publish(
      String eventType,
      BankingEvent source,
      String causationId,
      JsonNode payload,
      String seed) {
    try {
      var event = new BankingEvent(
          UUID.nameUUIDFromBytes(seed.getBytes(StandardCharsets.UTF_8)).toString(),
          eventType,
          1,
          Instant.now().toString(),
          PRODUCER,
          source.correlationId(),
          causationId,
          seed,
          source.aggregateId(),
          payload);
      kafkaTemplate.send(TOPIC, event.correlationId(), objectMapper.writeValueAsString(event));
      return event;
    } catch (Exception ex) {
      throw new IllegalStateException("Failed to publish investment event", ex);
    }
  }
}
