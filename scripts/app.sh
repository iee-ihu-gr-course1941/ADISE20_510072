#!/bin/bash
cd /tmp &&
	rm -rf /tmp/connect-4 &&
	git clone https://github.com/iee-ihu-gr-course1941/ADISE20_510072.git &&
	cd connect-4/app
docker network create --driver bridge connect4.network
sudo docker build . -t connect4.app:latest
sudo docker rm -f connect4.app
sudo docker run --restart=unless-stopped --name connect4.app --network connect4.network -d connect4.app:latest
rm -rf /tmp/connect-4
