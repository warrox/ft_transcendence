.PHONY: up down logs
# ASCII logo with color
# Target to bring the containers up
up:
	docker compose up --build -d
deploy:
	cd backend/blockchain/contract && npx hardhat run scripts/deploy.js --network fuji
# Target to bring the containers down
down:
	docker compose down

logs:
	docker compose logs -f
