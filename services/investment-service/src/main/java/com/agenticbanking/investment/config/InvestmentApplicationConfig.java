package com.agenticbanking.investment.config;

import com.agenticbanking.investment.domain.InvestmentContributionPolicy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InvestmentApplicationConfig {
  @Bean
  InvestmentContributionPolicy investmentContributionPolicy() {
    return new InvestmentContributionPolicy();
  }
}
