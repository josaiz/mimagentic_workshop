package com.agenticbanking.investment.application;

import com.agenticbanking.investment.application.port.InvestmentEventPublisher;
import com.agenticbanking.investment.application.port.ProcessedEventTracker;
import com.agenticbanking.investment.domain.InvestmentContributionPolicy;
import com.agenticbanking.investment.model.BankingEvent;
import org.springframework.stereotype.Service;

@Service
public class HandleInvestmentReservationUseCase {
  private final InvestmentContributionPolicy policy;
  private final InvestmentEventPublisher eventPublisher;
  private final ProcessedEventTracker processedEventTracker;

  public HandleInvestmentReservationUseCase(
      InvestmentContributionPolicy policy,
      InvestmentEventPublisher eventPublisher,
      ProcessedEventTracker processedEventTracker) {
    this.policy = policy;
    this.eventPublisher = eventPublisher;
    this.processedEventTracker = processedEventTracker;
  }

  public void handle(BankingEvent event) {
    if (!"AccountDebitReserved".equals(event.eventType())
        || !"INVESTMENT_FUND".equals(event.payload().path("movementType").asText())
        || !processedEventTracker.markProcessed(event.eventId())) {
      return;
    }

    var requested = eventPublisher.publishContributionRequested(event);
    var decision = policy.evaluate(event.payload().path("amount").decimalValue());
    eventPublisher.publishContributionTerminal(decision, event, requested);
  }
}
