package com.agenticbanking.account.kafka;

import com.agenticbanking.account.model.BankingEvent;
import com.agenticbanking.account.service.AccountEventHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class BankingEventConsumer {
  private final ObjectMapper objectMapper;
  private final AccountEventHandler handler;

  public BankingEventConsumer(ObjectMapper objectMapper, AccountEventHandler handler) {
    this.objectMapper = objectMapper;
    this.handler = handler;
  }

  @KafkaListener(topics = "banking.events", groupId = "account-service")
  public void onMessage(String value) throws Exception {
    handler.handle(objectMapper.readValue(value, BankingEvent.class));
  }
}
