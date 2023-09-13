# Build with dockerfile

docker build -t notes-service .

# create volume

docker volume create mongodb
docker volume create mongodb_config

# Create Network

docker network create mongodb

# compose

docker compose -f docker-compose.dev.yml up --build

# run

- 1: Normal
  docker run --rm -p 8081:8081 --name notes notes-service

- 2: attach it to the volumes and network
  docker run -it --rm -d -v mongodb:/data/db -v mongodb_config:/data/configdb -p 27017:27017 --network mongodb --name mongodb mongo

- 3: Set your environment variables
  docker run -it --rm -d --network mongodb --name notes -p 8081:8081 -e SERVER_PORT=8081 -e SERVER_PORT=8081 -e DATABASE_CONNECTIONSTRING=mongodb://mongodb:27017/yoda_notes notes-service

# Stop

docker stop notes mongodb
