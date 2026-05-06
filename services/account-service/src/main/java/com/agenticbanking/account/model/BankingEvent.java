package com.agenticbanking.account.model;

import com.fasterxml.jackson.databind.JsonNode;

public record BankingEvent(
    String eventId,
    String eventType,
    int eventVersion,
    String occurredAt,
    String producer,
    String correlationId,
    String causationId,
    String idempotencyKey,
    String aggregateId,
    JsonNode payload
) {}
