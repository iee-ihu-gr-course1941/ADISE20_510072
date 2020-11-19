FROM node:lts-buster-slim

WORKDIR /opt/app
COPY package.json ./
RUN npm install
COPY . .

EXPOSE 8000

CMD [ "npm", "start" ]