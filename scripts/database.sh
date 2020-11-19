#!/bin/bash
# cd /tmp &&
# 	rm -rf /tmp/connect-4 &&
# 	git clone https://github.com/iee-ihu-gr-course1941/ADISE20_510072.git &&
# 	cd connect-4/database
docker network create --driver bridge connect4.network
sudo docker rm -f connect4.database
sudo docker rm -f connect4.database.pma
sudo docker run --restart=unless-stopped --name connect4.database \
	-v /home/DockerVolumes/mysql:/var/lib/mysql \
	--network connect4.network \
	-e MYSQL_ROOT_PASSWORD=NJPPKzGjJ6zjVuzR \
	-e MYSQL_DATABASE=data \
	-e MYSQL_USER=user \
	-e MYSQL_PASSWORD=X8aQbULcbmR9DS5Y \
	-d mysql:8 \
	--sql_mode="STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION" \
	--character-set-server=utf8mb4 \
	--collation-server=utf8mb4_unicode_ci \
	--default-authentication-plugin=mysql_native_password
sleep 10s
# sudo docker exec -i connect4.database sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD"' < ./database.sql
sudo docker run --restart=unless-stopped --name connect4.database.pma \
	--network connect4.network \
	-d --link connect4.database:db \
	-e PMA_ABSOLUTE_URI=http://api.connect4.iee.ihu.gr/pma phpmyadmin/phpmyadmin:latest
# rm -rf /tmp/connect-4
