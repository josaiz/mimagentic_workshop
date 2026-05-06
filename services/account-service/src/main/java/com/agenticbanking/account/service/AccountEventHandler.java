package com.agenticbanking.account.service;

import com.agenticbanking.account.model.BankingEvent;
import com.agenticbanking.account.repository.AccountRepository;
import com.fasterxml.jackson.databind.JsonNode;
import java.math.BigDecimal;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountEventHandler {
  private static final Set<String> COMPLETED_EVENTS = Set.of(
      "ExternalTransferCompleted",
      "FundContributionCompleted",
      "MortgageRepaymentCompleted");
  private static final Set<String> REJECTED_EVENTS = Set.of(
      "ExternalTransferRejected",
      "FundContributionRejected",
      "MortgageRepaymentRejected");

  private final AccountRepository accountRepository;
  private final EventPublisher publisher;

  public AccountEventHandler(AccountRepository accountRepository, EventPublisher publisher) {
    this.accountRepository = accountRepository;
    this.publisher = publisher;
  }

  @Transactional
  public void handle(BankingEvent event) {
    if (!accountRepository.markProcessed(event.eventId())) {
      return;
    }

    if ("MoneyMovementRequested".equals(event.eventType())) {
      handleMoneyMovement(event);
    } else if ("SalaryReceived".equals(event.eventType())) {
      handleSalary(event);
    } else if (COMPLETED_EVENTS.contains(event.eventType())) {
      handleTerminal(event, true);
    } else if (REJECTED_EVENTS.contains(event.eventType())) {
      handleTerminal(event, false);
    }
  }

  private void handleMoneyMovement(BankingEvent event) {
    JsonNode payload = event.payload();
    String accountId = text(payload, "sourceAccountId");
    BigDecimal amount = decimal(payload, "amount");
    var account = accountRepository.find(accountId).orElseThrow();

    if (AccountRules.canReserve(account.availableBalance(), amount)) {
      accountRepository.reserve(accountId, amount);
      publisher.publish("AccountDebitReserved", event, payload, text(payload, "movementId") + "_reserved");
    } else {
      publisher.publish("AccountDebitRejected", event, payload, text(payload, "movementId") + "_rejected");
    }
  }

  private void handleSalary(BankingEvent event) {
    JsonNode payload = event.payload();
    String accountId = text(payload, "accountId");
    BigDecimal amount = decimal(payload, "amount");
    if (amount.compareTo(BigDecimal.ZERO) > 0) {
      accountRepository.credit(accountId, amount);
      publisher.publish("AccountCredited", event, payload, "credit_" + event.eventId());
    }
  }

  private void handleTerminal(BankingEvent event, boolean completed) {
    JsonNode payload = event.payload();
    String accountId = text(payload, "sourceAccountId");
    BigDecimal amount = decimal(payload, "amount");
    if (completed) {
      accountRepository.commitReserved(accountId, amount);
      publisher.publish("AccountDebitCommitted", event, payload, text(payload, "movementId") + "_committed");
    } else {
      accountRepository.releaseReserved(accountId, amount);
      publisher.publish("AccountDebitReleased", event, payload, text(payload, "movementId") + "_released");
    }
  }

  private static String text(JsonNode payload, String field) {
    return payload.path(field).asText();
  }

  private static BigDecimal decimal(JsonNode payload, String field) {
    return payload.path(field).decimalValue();
  }
}
