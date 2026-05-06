package com.agenticbanking.account.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class AccountRulesTest {
  @Test
  void allowsReservationWhenAvailableBalanceCoversAmount() {
    assertThat(AccountRules.canReserve(new BigDecimal("2450.00"), new BigDecimal("100.00"))).isTrue();
  }

  @Test
  void rejectsReservationWhenFundsAreInsufficient() {
    assertThat(AccountRules.canReserve(new BigDecimal("50.00"), new BigDecimal("999999.00"))).isFalse();
  }
}
