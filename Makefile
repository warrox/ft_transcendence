.PHONY: up down
# ASCII logo with color
# Target to bring the containers up
up:
	docker-compose up --build -d

# Target to bring the containers down
down:
	docker-compose down
