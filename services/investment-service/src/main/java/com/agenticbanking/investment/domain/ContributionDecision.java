package com.agenticbanking.investment.domain;

public enum ContributionDecision {
  COMPLETED("FundContributionCompleted"),
  REJECTED("FundContributionRejected");

  private final String eventType;

  ContributionDecision(String eventType) {
    this.eventType = eventType;
  }

  public String eventType() {
    return eventType;
  }
}
