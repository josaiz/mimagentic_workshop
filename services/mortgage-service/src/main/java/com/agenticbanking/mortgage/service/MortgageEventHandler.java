package com.agenticbanking.mortgage.service;

import com.agenticbanking.mortgage.model.BankingEvent;
import java.math.BigDecimal;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class MortgageEventHandler {
  private final EventPublisher publisher;
  private final Set<String> processed = ConcurrentHashMap.newKeySet();
  private BigDecimal outstandingPrincipal = new BigDecimal("180000.00");

  public MortgageEventHandler(EventPublisher publisher) {
    this.publisher = publisher;
  }

  public synchronized void handle(BankingEvent event) {
    if (!"AccountDebitReserved".equals(event.eventType())
        || !"MORTGAGE_REPAYMENT".equals(event.payload().path("movementType").asText())
        || !processed.add(event.eventId())) {
      return;
    }

    var requested = publisher.publish(
        "MortgageRepaymentRequested",
        event,
        event.eventId(),
        event.payload(),
        "MortgageRepaymentRequested:" + event.eventId());

    BigDecimal amount = event.payload().path("amount").decimalValue();
    boolean rejected = amount.compareTo(BigDecimal.ZERO) <= 0 || amount.compareTo(outstandingPrincipal) > 0;
    if (!rejected) {
      outstandingPrincipal = outstandingPrincipal.subtract(amount);
    }
    publisher.publish(
        rejected ? "MortgageRepaymentRejected" : "MortgageRepaymentCompleted",
        event,
        requested.eventId(),
        event.payload(),
        "MortgageRepaymentTerminal:" + event.eventId());
  }
}
