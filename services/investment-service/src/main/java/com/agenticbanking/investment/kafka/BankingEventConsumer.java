package com.agenticbanking.investment.kafka;

import com.agenticbanking.investment.model.BankingEvent;
import com.agenticbanking.investment.service.InvestmentEventHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class BankingEventConsumer {
  private final ObjectMapper objectMapper;
  private final InvestmentEventHandler handler;

  public BankingEventConsumer(ObjectMapper objectMapper, InvestmentEventHandler handler) {
    this.objectMapper = objectMapper;
    this.handler = handler;
  }

  @KafkaListener(topics = "banking.events", groupId = "investment-service")
  public void onMessage(String value) throws Exception {
    handler.handle(objectMapper.readValue(value, BankingEvent.class));
  }
}
