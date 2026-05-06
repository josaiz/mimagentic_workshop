package com.agenticbanking.investment.adapter.in.kafka;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import com.agenticbanking.investment.application.HandleInvestmentReservationUseCase;
import com.agenticbanking.investment.model.BankingEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.kafka.annotation.KafkaListener;

class BankingEventConsumerTest {
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Test
  void deserializesAndDelegatesToUseCase() throws Exception {
    var useCase = mock(HandleInvestmentReservationUseCase.class);
    var consumer = new BankingEventConsumer(objectMapper, useCase);
    var source = sourceEvent();

    consumer.onMessage(objectMapper.writeValueAsString(source));

    var eventCaptor = ArgumentCaptor.forClass(BankingEvent.class);
    verify(useCase).handle(eventCaptor.capture());
    var delegated = eventCaptor.getValue();
    assertThat(delegated.eventId()).isEqualTo(source.eventId());
    assertThat(delegated.eventType()).isEqualTo(source.eventType());
    assertThat(delegated.eventVersion()).isEqualTo(source.eventVersion());
    assertThat(delegated.occurredAt()).isEqualTo(source.occurredAt());
    assertThat(delegated.producer()).isEqualTo(source.producer());
    assertThat(delegated.correlationId()).isEqualTo(source.correlationId());
    assertThat(delegated.causationId()).isEqualTo(source.causationId());
    assertThat(delegated.idempotencyKey()).isEqualTo(source.idempotencyKey());
    assertThat(delegated.aggregateId()).isEqualTo(source.aggregateId());
    assertThat(delegated.payload().path("movementType").asText()).isEqualTo("INVESTMENT_FUND");
    assertThat(delegated.payload().path("amount").decimalValue()).isEqualByComparingTo("10.00");
  }

  @Test
  void listenerKeepsCurrentTopicAndGroupId() throws Exception {
    var listener = BankingEventConsumer.class.getMethod("onMessage", String.class)
        .getAnnotation(KafkaListener.class);

    assertThat(listener.topics()).containsExactly("banking.events");
    assertThat(listener.groupId()).isEqualTo("investment-service");
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
}
