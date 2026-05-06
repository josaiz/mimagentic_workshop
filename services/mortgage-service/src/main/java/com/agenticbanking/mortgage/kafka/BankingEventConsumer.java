package com.agenticbanking.mortgage.kafka;

import com.agenticbanking.mortgage.model.BankingEvent;
import com.agenticbanking.mortgage.service.MortgageEventHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class BankingEventConsumer {
  private final ObjectMapper objectMapper;
  private final MortgageEventHandler handler;

  public BankingEventConsumer(ObjectMapper objectMapper, MortgageEventHandler handler) {
    this.objectMapper = objectMapper;
    this.handler = handler;
  }

  @KafkaListener(topics = "banking.events", groupId = "mortgage-service")
  public void onMessage(String value) throws Exception {
    handler.handle(objectMapper.readValue(value, BankingEvent.class));
  }
}
