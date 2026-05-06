package com.agenticbanking.account.repository;

import com.agenticbanking.account.model.Account;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.util.Optional;
import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AccountRepository {
  private final JdbcTemplate jdbcTemplate;

  public AccountRepository(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  @PostConstruct
  public void init() {
    jdbcTemplate.execute("""
      CREATE TABLE IF NOT EXISTS accounts (
        account_id TEXT PRIMARY KEY,
        owner_name TEXT NOT NULL,
        currency TEXT NOT NULL,
        available_balance NUMERIC(19, 4) NOT NULL,
        reserved_balance NUMERIC(19, 4) NOT NULL,
        booked_debit_total NUMERIC(19, 4) NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      )
      """);
    jdbcTemplate.execute("""
      CREATE TABLE IF NOT EXISTS processed_events (
        event_id TEXT PRIMARY KEY,
        processed_at TIMESTAMPTZ DEFAULT now()
      )
      """);
    jdbcTemplate.update("""
      INSERT INTO accounts (account_id, owner_name, currency, available_balance, reserved_balance, booked_debit_total)
      VALUES ('acc_main_001', 'Jorge', 'EUR', 2450.00, 0.00, 0.00)
      ON CONFLICT (account_id) DO NOTHING
      """);
  }

  public Optional<Account> find(String accountId) {
    var accounts = jdbcTemplate.query(
        "SELECT * FROM accounts WHERE account_id = ?",
        (rs, rowNum) -> map(rs),
        accountId);
    return accounts.stream().findFirst();
  }

  public boolean markProcessed(String eventId) {
    int rows = jdbcTemplate.update(
        "INSERT INTO processed_events (event_id) VALUES (?) ON CONFLICT (event_id) DO NOTHING",
        eventId);
    return rows > 0;
  }

  public void reserve(String accountId, BigDecimal amount) {
    jdbcTemplate.update("""
      UPDATE accounts
         SET available_balance = available_balance - ?,
             reserved_balance = reserved_balance + ?,
             updated_at = now()
       WHERE account_id = ?
      """, amount, amount, accountId);
  }

  public void credit(String accountId, BigDecimal amount) {
    jdbcTemplate.update("""
      UPDATE accounts
         SET available_balance = available_balance + ?,
             updated_at = now()
       WHERE account_id = ?
      """, amount, accountId);
  }

  public void commitReserved(String accountId, BigDecimal amount) {
    jdbcTemplate.update("""
      UPDATE accounts
         SET reserved_balance = GREATEST(reserved_balance - ?, 0),
             booked_debit_total = booked_debit_total + ?,
             updated_at = now()
       WHERE account_id = ?
      """, amount, amount, accountId);
  }

  public void releaseReserved(String accountId, BigDecimal amount) {
    jdbcTemplate.update("""
      UPDATE accounts
         SET reserved_balance = GREATEST(reserved_balance - ?, 0),
             available_balance = available_balance + ?,
             updated_at = now()
       WHERE account_id = ?
      """, amount, amount, accountId);
  }

  private Account map(ResultSet rs) throws SQLException {
    return new Account(
        rs.getString("account_id"),
        rs.getString("owner_name"),
        rs.getString("currency"),
        rs.getBigDecimal("available_balance"),
        rs.getBigDecimal("reserved_balance"),
        rs.getBigDecimal("booked_debit_total"),
        rs.getTimestamp("created_at").toInstant());
  }
}
