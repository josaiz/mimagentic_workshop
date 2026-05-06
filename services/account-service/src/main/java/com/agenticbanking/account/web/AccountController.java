package com.agenticbanking.account.web;

import com.agenticbanking.account.repository.AccountRepository;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AccountController {
  private final AccountRepository accountRepository;

  public AccountController(AccountRepository accountRepository) {
    this.accountRepository = accountRepository;
  }

  @GetMapping("/health")
  Map<String, String> health() {
    return Map.of("status", "UP", "service", "account-service");
  }

  @GetMapping("/accounts/{accountId}")
  ResponseEntity<?> account(@PathVariable String accountId) {
    return accountRepository.find(accountId)
        .<ResponseEntity<?>>map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }
}
