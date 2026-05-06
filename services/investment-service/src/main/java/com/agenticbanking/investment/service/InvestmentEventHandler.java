package com.agenticbanking.investment.service;

import com.agenticbanking.investment.model.BankingEvent;
import java.math.BigDecimal;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class InvestmentEventHandler {
  private final EventPublisher publisher;
  private final Set<String> processed = ConcurrentHashMap.newKeySet();

  public InvestmentEventHandler(EventPublisher publisher) {
    this.publisher = publisher;
  }

  public void handle(BankingEvent event) {
    if (!"AccountDebitReserved".equals(event.eventType())
        || !"INVESTMENT_FUND".equals(event.payload().path("movementType").asText())
        || !processed.add(event.eventId())) {
      return;
    }

    var requested = publisher.publish(
        "FundContributionRequested",
        event,
        event.eventId(),
        event.payload(),
        "FundContributionRequested:" + event.eventId());

    BigDecimal amount = event.payload().path("amount").decimalValue();
    String terminalType = amount.compareTo(new BigDecimal("10.00")) < 0
        ? "FundContributionRejected"
        : "FundContributionCompleted";
    publisher.publish(
        terminalType,
        event,
        requested.eventId(),
        event.payload(),
        "FundContributionTerminal:" + event.eventId());
  }
}
