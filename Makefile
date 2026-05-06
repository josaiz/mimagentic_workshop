COMPOSE=docker compose -f infra/docker-compose.yml

.PHONY: up down logs ps restart demo-data test

up:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down -v

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

restart:
	$(COMPOSE) down
	$(COMPOSE) up --build

demo-data:
	python3 tools/demo-data-generator/generate.py --scenario morning

test:
	$(COMPOSE) config >/dev/null
	npm test
	npm run build -w @agentic-banking-lab/web-dashboard
	cd services/account-service && mvn -q -Djava.version=$${JAVA_TEST_VERSION:-23} test
	cd services/investment-service && mvn -q -Djava.version=$${JAVA_TEST_VERSION:-23} test
	cd services/mortgage-service && mvn -q -Djava.version=$${JAVA_TEST_VERSION:-23} test
