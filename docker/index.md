- mongo container with password
  docker run -e MONGO_INITDB_ROOT_USERNAME=kimmoc -e MONGO_INITDB_ROOT_PASSWORD=abc123 --name mongo -p 27017:27017 -v $HOME/mongo:/data/db --rm -d mongo:latest --auth
