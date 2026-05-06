package com.agenticbanking.investment.application;

import static org.assertj.core.api.Assertions.assertThat;

import com.agenticbanking.investment.application.port.InvestmentEventPublisher;
import com.agenticbanking.investment.application.port.ProcessedEventTracker;
import com.agenticbanking.investment.domain.ContributionDecision;
import com.agenticbanking.investment.domain.InvestmentContributionPolicy;
import com.agenticbanking.investment.model.BankingEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;

class HandleInvestmentReservationUseCaseTest {
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Test
  void publishesRequestedThenCompletedForEligibleAmountAtLeastTenEuros() {
    var publisher = new RecordingPublisher();
    var useCase = useCase(publisher);
    var source = sourceEvent("source-1", "AccountDebitReserved", "INVESTMENT_FUND", "10.00", "corr-1");

    useCase.handle(source);

    assertThat(publisher.calls()).extracting(PublishedCall::eventType)
        .containsExactly("FundContributionRequested", "FundContributionCompleted");
    assertThat(publisher.calls().get(0).source()).isSameAs(source);
    assertThat(publisher.calls().get(1).source()).isSameAs(source);
    assertThat(publisher.calls().get(1).requested().eventId()).isEqualTo("requested-source-1");
  }

  @Test
  void publishesRequestedThenRejectedForEligibleAmountBelowTenEuros() {
    var publisher = new RecordingPublisher();
    var useCase = useCase(publisher);

    useCase.handle(sourceEvent("source-1", "AccountDebitReserved", "INVESTMENT_FUND", "9.99", "corr-1"));

    assertThat(publisher.calls()).extracting(PublishedCall::eventType)
        .containsExactly("FundContributionRequested", "FundContributionRejected");
  }

  @Test
  void ignoresEventsThatAreNotEligibleInvestmentReservations() {
    var publisher = new RecordingPublisher();
    var useCase = useCase(publisher);

    useCase.handle(sourceEvent("source-1", "AccountCreditReceived", "INVESTMENT_FUND", "10.00", "corr-1"));
    useCase.handle(sourceEvent("source-2", "AccountDebitReserved", "EXTERNAL_TRANSFER", "10.00", "corr-2"));

    assertThat(publisher.calls()).isEmpty();
  }

  @Test
  void ignoresDuplicateSourceEventIdsButProcessesDifferentSourceEventsWithSameCorrelation() {
    var publisher = new RecordingPublisher();
    var useCase = useCase(publisher);

    useCase.handle(sourceEvent("source-1", "AccountDebitReserved", "INVESTMENT_FUND", "10.00", "corr-1"));
    useCase.handle(sourceEvent("source-1", "AccountDebitReserved", "INVESTMENT_FUND", "10.00", "corr-1"));
    useCase.handle(sourceEvent("source-2", "AccountDebitReserved", "INVESTMENT_FUND", "10.00", "corr-1"));

    assertThat(publisher.calls()).extracting(PublishedCall::eventType)
        .containsExactly(
            "FundContributionRequested",
            "FundContributionCompleted",
            "FundContributionRequested",
            "FundContributionCompleted");
    assertThat(publisher.calls()).extracting(call -> call.source().eventId())
        .containsExactly("source-1", "source-1", "source-2", "source-2");
  }

  private HandleInvestmentReservationUseCase useCase(RecordingPublisher publisher) {
    return new HandleInvestmentReservationUseCase(
        new InvestmentContributionPolicy(),
        publisher,
        new MemoryProcessedEventTracker());
  }

  private BankingEvent sourceEvent(
      String eventId,
      String eventType,
      String movementType,
      String amount,
      String correlationId) {
    var payload = objectMapper.createObjectNode();
    payload.put("movementType", movementType);
    payload.put("amount", new BigDecimal(amount));
    payload.put("accountId", "acc_main_001");
    return new BankingEvent(
        eventId,
        eventType,
        1,
        "2026-05-06T00:00:00Z",
        "account-service",
        correlationId,
        "cause-1",
        "idempotency-1",
        "acc_main_001",
        payload);
  }

  private record PublishedCall(String eventType, BankingEvent source, BankingEvent requested) {}

  private static class RecordingPublisher implements InvestmentEventPublisher {
    private final List<PublishedCall> calls = new ArrayList<>();

    @Override
    public BankingEvent publishContributionRequested(BankingEvent source) {
      var requested = new BankingEvent(
          "requested-" + source.eventId(),
          "FundContributionRequested",
          1,
          "2026-05-06T00:00:00Z",
          "investment-service",
          source.correlationId(),
          source.eventId(),
          "FundContributionRequested:" + source.eventId(),
          source.aggregateId(),
          source.payload());
      calls.add(new PublishedCall(requested.eventType(), source, requested));
      return requested;
    }

    @Override
    public BankingEvent publishContributionTerminal(
        ContributionDecision decision,
        BankingEvent source,
        BankingEvent requested) {
      var terminal = new BankingEvent(
          "terminal-" + source.eventId(),
          decision.eventType(),
          1,
          "2026-05-06T00:00:00Z",
          "investment-service",
          source.correlationId(),
          requested.eventId(),
          "FundContributionTerminal:" + source.eventId(),
          source.aggregateId(),
          source.payload());
      calls.add(new PublishedCall(terminal.eventType(), source, requested));
      return terminal;
    }

    List<PublishedCall> calls() {
      return calls;
    }
  }

  private static class MemoryProcessedEventTracker implements ProcessedEventTracker {
    private final Set<String> processed = new HashSet<>();

    @Override
    public boolean markProcessed(String sourceEventId) {
      return processed.add(sourceEventId);
    }
  }
}
