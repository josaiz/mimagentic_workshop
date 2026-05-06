package com.agenticbanking.investment.domain;

import java.math.BigDecimal;

public class InvestmentContributionPolicy {
  private static final BigDecimal MINIMUM_COMPLETED_AMOUNT = new BigDecimal("10.00");

  public ContributionDecision evaluate(BigDecimal amount) {
    if (amount.compareTo(MINIMUM_COMPLETED_AMOUNT) < 0) {
      return ContributionDecision.REJECTED;
    }

    return ContributionDecision.COMPLETED;
  }
}
