# This will up the container
docker-postgres-up:
	@docker-compose -f docker-compose.yaml -p seryu up --build postgres -d
	
# This will delete the container
docker-postgres-down:
	@docker-compose -f docker-compose.yaml -p seryu down