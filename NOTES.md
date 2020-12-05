# Create Network

```bash
docker network create --driver bridge connect4.network
```

# Run build

```bash
docker build -t connect4.app:latest .
```

# Run Container

```bash
docker run --restart=unless-stopped --name connect4.database --network connect4.network -e MYSQL_ROOT_PASSWORD=NJPPKzGjJ6zjVuzR -e MYSQL_DATABASE=data -e MYSQL_USER=user -e MYSQL_PASSWORD=X8aQbULcbmR9DS5Y -d mysql:8 --sql_mode="STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION" --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci --default-authentication-plugin=mysql_native_password

sudo docker exec -i connect4.database sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD"' < ./database.sql

docker run --restart=unless-stopped --name connect4.database.pma --network connect4.network -d -p 8080:80 --link connect4.database:db phpmyadmin:latest

docker rm -f connect4.app && docker run --name connect4.app --network connect4.network -d -p 8081:8000 connect4.app:latest
```
