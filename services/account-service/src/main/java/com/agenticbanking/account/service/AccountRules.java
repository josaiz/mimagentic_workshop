package com.agenticbanking.account.service;

import java.math.BigDecimal;

public final class AccountRules {
  private AccountRules() {}

  public static boolean canReserve(BigDecimal availableBalance, BigDecimal amount) {
    return amount.compareTo(BigDecimal.ZERO) > 0 && availableBalance.compareTo(amount) >= 0;
  }
}
