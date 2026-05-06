package com.agenticbanking.investment.application.port;

import com.agenticbanking.investment.domain.ContributionDecision;
import com.agenticbanking.investment.model.BankingEvent;

public interface InvestmentEventPublisher {
  BankingEvent publishContributionRequested(BankingEvent source);

  BankingEvent publishContributionTerminal(
      ContributionDecision decision,
      BankingEvent source,
      BankingEvent requested);
}
