## install to docker

```docker pull mysql```

## start from docker

```
docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3306:3306 -d mysql:latest
```

## Store
- 