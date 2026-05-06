package com.agenticbanking.investment.adapter.out.kafka;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import com.agenticbanking.investment.domain.ContributionDecision;
import com.agenticbanking.investment.model.BankingEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.kafka.core.KafkaTemplate;

class KafkaInvestmentEventPublisherTest {
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Test
  void publishesRequestedEnvelopeWithDeterministicIdAndKafkaKey() throws Exception {
    var kafkaTemplate = kafkaTemplate();
    var publisher = new KafkaInvestmentEventPublisher(kafkaTemplate, objectMapper);
    var source = sourceEvent();

    var event = publisher.publishContributionRequested(source);

    assertEnvelope(
        event,
        "FundContributionRequested",
        source.eventId(),
        "FundContributionRequested:source-1",
        source);
    assertSentToBankingTopicWithCorrelationKey(kafkaTemplate, event);
  }

  @Test
  void publishesTerminalEnvelopeWithRequestedEventAsCausation() throws Exception {
    var kafkaTemplate = kafkaTemplate();
    var publisher = new KafkaInvestmentEventPublisher(kafkaTemplate, objectMapper);
    var source = sourceEvent();
    var requested = requestedEvent(source);

    var event = publisher.publishContributionTerminal(ContributionDecision.COMPLETED, source, requested);

    assertEnvelope(
        event,
        "FundContributionCompleted",
        requested.eventId(),
        "FundContributionTerminal:source-1",
        source);
    assertSentToBankingTopicWithCorrelationKey(kafkaTemplate, event);
  }

  private void assertEnvelope(
      BankingEvent event,
      String eventType,
      String causationId,
      String seed,
      BankingEvent source) {
    assertThat(event.eventId()).isEqualTo(UUID.nameUUIDFromBytes(seed.getBytes(UTF_8)).toString());
    assertThat(event.eventType()).isEqualTo(eventType);
    assertThat(event.eventVersion()).isEqualTo(1);
    assertThat(event.producer()).isEqualTo("investment-service");
    assertThat(event.correlationId()).isEqualTo(source.correlationId());
    assertThat(event.causationId()).isEqualTo(causationId);
    assertThat(event.idempotencyKey()).isEqualTo(seed);
    assertThat(event.aggregateId()).isEqualTo(source.aggregateId());
    assertThat(event.payload()).isSameAs(source.payload());
  }

  private void assertSentToBankingTopicWithCorrelationKey(
      KafkaTemplate<String, String> kafkaTemplate,
      BankingEvent event) throws Exception {
    var valueCaptor = ArgumentCaptor.forClass(String.class);
    verify(kafkaTemplate).send(eq("banking.events"), eq("corr-1"), valueCaptor.capture());
    var sent = objectMapper.readValue(valueCaptor.getValue(), BankingEvent.class);
    assertThat(sent.eventId()).isEqualTo(event.eventId());
    assertThat(sent.eventType()).isEqualTo(event.eventType());
    assertThat(sent.eventVersion()).isEqualTo(event.eventVersion());
    assertThat(sent.occurredAt()).isEqualTo(event.occurredAt());
    assertThat(sent.producer()).isEqualTo(event.producer());
    assertThat(sent.correlationId()).isEqualTo(event.correlationId());
    assertThat(sent.causationId()).isEqualTo(event.causationId());
    assertThat(sent.idempotencyKey()).isEqualTo(event.idempotencyKey());
    assertThat(sent.aggregateId()).isEqualTo(event.aggregateId());
    assertThat(sent.payload().path("movementType").asText()).isEqualTo("INVESTMENT_FUND");
    assertThat(sent.payload().path("amount").decimalValue()).isEqualByComparingTo("10.00");
  }

  @SuppressWarnings("unchecked")
  private KafkaTemplate<String, String> kafkaTemplate() {
    return mock(KafkaTemplate.class);
  }

  private BankingEvent sourceEvent() {
    var payload = objectMapper.createObjectNode();
    payload.put("movementType", "INVESTMENT_FUND");
    payload.put("amount", new BigDecimal("10.00"));
    return new BankingEvent(
        "source-1",
        "AccountDebitReserved",
        1,
        "2026-05-06T00:00:00Z",
        "account-service",
        "corr-1",
        "cause-1",
        "idempotency-1",
        "acc_main_001",
        payload);
  }

  private BankingEvent requestedEvent(BankingEvent source) {
    var seed = "FundContributionRequested:" + source.eventId();
    return new BankingEvent(
        UUID.nameUUIDFromBytes(seed.getBytes(UTF_8)).toString(),
        "FundContributionRequested",
        1,
        "2026-05-06T00:00:01Z",
        "investment-service",
        source.correlationId(),
        source.eventId(),
        seed,
        source.aggregateId(),
        source.payload());
  }
}
