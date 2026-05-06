package com.agenticbanking.investment.application.port;

public interface ProcessedEventTracker {
  boolean markProcessed(String sourceEventId);
}
