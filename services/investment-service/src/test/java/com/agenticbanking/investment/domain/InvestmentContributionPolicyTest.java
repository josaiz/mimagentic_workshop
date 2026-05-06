package com.agenticbanking.investment.domain;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class InvestmentContributionPolicyTest {
  private final InvestmentContributionPolicy policy = new InvestmentContributionPolicy();

  @Test
  void rejectsAmountsBelowTenEuros() {
    assertThat(policy.evaluate(new BigDecimal("9.99"))).isEqualTo(ContributionDecision.REJECTED);
  }

  @Test
  void completesAmountsAtTenEuros() {
    assertThat(policy.evaluate(new BigDecimal("10.00"))).isEqualTo(ContributionDecision.COMPLETED);
  }

  @Test
  void completesAmountsAboveTenEuros() {
    assertThat(policy.evaluate(new BigDecimal("10.01"))).isEqualTo(ContributionDecision.COMPLETED);
  }
}
