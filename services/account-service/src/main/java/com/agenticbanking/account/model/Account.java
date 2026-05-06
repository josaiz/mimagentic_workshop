package com.agenticbanking.account.model;

import java.math.BigDecimal;
import java.time.Instant;

public record Account(
    String accountId,
    String ownerName,
    String currency,
    BigDecimal availableBalance,
    BigDecimal reservedBalance,
    BigDecimal bookedDebitTotal,
    Instant createdAt
) {}
