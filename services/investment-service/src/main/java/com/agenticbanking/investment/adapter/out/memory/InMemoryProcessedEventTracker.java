package com.agenticbanking.investment.adapter.out.memory;

import com.agenticbanking.investment.application.port.ProcessedEventTracker;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class InMemoryProcessedEventTracker implements ProcessedEventTracker {
  private final Set<String> processed = ConcurrentHashMap.newKeySet();

  @Override
  public boolean markProcessed(String sourceEventId) {
    return processed.add(sourceEventId);
  }
}
