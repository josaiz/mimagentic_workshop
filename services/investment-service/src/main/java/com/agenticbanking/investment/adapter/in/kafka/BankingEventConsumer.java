package com.agenticbanking.investment.adapter.in.kafka;

import com.agenticbanking.investment.application.HandleInvestmentReservationUseCase;
import com.agenticbanking.investment.model.BankingEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class BankingEventConsumer {
  private final ObjectMapper objectMapper;
  private final HandleInvestmentReservationUseCase useCase;

  public BankingEventConsumer(ObjectMapper objectMapper, HandleInvestmentReservationUseCase useCase) {
    this.objectMapper = objectMapper;
    this.useCase = useCase;
  }

  @KafkaListener(topics = "banking.events", groupId = "investment-service")
  public void onMessage(String value) throws Exception {
    useCase.handle(objectMapper.readValue(value, BankingEvent.class));
  }
}
